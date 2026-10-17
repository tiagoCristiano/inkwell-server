// Checks the security fixes against a running API (default http://localhost:3001): password
// check, role read from the DB, private posts hidden from comment/like/quote, body/text limits,
// JSON errors, headers and the login rate limit. The rate-limit check runs last and uses up this
// IP's attempts for 15 minutes; restart the server to reset them.
// Run: node test-security.js [baseUrl]
require("dotenv/config");
const assert = require("assert");
const { PrismaClient } = require("@prisma/client");

const BASE = process.argv[2] || "http://localhost:3001";
const prisma = new PrismaClient();
const users = {};

async function raw(method, path, { token, body, json = true } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : json ? JSON.stringify(body) : body,
  });
  return { status: res.status, headers: res.headers, body: await res.json().catch(() => null) };
}

const call = (who, method, path, body) => raw(method, path, { token: users[who].token, body });

async function register(who) {
  const email = `${who}-${Date.now()}@test.dev`;
  const res = await raw("POST", "/auth/register", { body: { email, password: "secret123" } });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  users[who] = { ...res.body, email };
}

async function main() {
  await register("alice");
  await register("bob");

  // Password check (async scrypt must still reject a wrong password).
  assert.equal((await raw("POST", "/auth/login", { body: { email: users.alice.email, password: "wrong-pass" } })).status, 401);
  assert.equal((await raw("POST", "/auth/login", { body: { email: users.alice.email, password: "secret123" } })).status, 200);

  // Role comes from the DB, not the token.
  assert.equal((await call("alice", "GET", "/admin/settings")).status, 403);
  await prisma.user.update({ where: { username: users.alice.username }, data: { role: "admin" } });
  assert.equal((await call("alice", "GET", "/admin/settings")).status, 200, "promoted in DB");
  await prisma.user.update({ where: { username: users.alice.username }, data: { role: "user" } });
  assert.equal((await call("alice", "GET", "/admin/settings")).status, 403, "demoted in DB");

  // bob's profile is private (default): alice, not a follower, can't touch his post.
  const post = (await call("bob", "POST", "/topics", { selftext: "só seguidores" })).body.topic;
  assert.equal((await call("alice", "POST", `/topics/${post.id}/comments`, { body: "oi" })).status, 404);
  assert.equal((await call("alice", "POST", `/topics/${post.id}/like`)).status, 404);
  assert.equal((await call("alice", "POST", "/topics", { quoted_id: post.id })).status, 400);

  // Private profile: people lists hidden and num_posts counts only visible posts.
  assert.equal((await call("alice", "GET", `/users/${users.bob.username}/followers`)).status, 403);
  assert.equal((await call("alice", "GET", `/users/${users.bob.username}/following`)).status, 403);
  assert.equal((await call("alice", "GET", `/users/${users.bob.username}`)).body.profile.num_posts, 0);

  // Trending: a private profile's hashtag never shows up, even when it's the most used one.
  const tag = `segredo${Date.now()}`;
  await prisma.user.update({ where: { username: users.bob.username }, data: { premium: true } });
  for (let i = 0; i < 20; i++) await call("bob", "POST", "/topics", { selftext: "x", hashtags: [tag] });
  const tags = async () => (await call("alice", "GET", "/trending")).body.hashtags.map((h) => h.tag);
  assert.ok(!(await tags()).includes(tag), "private hashtag hidden from trending");
  await prisma.user.update({ where: { username: users.bob.username }, data: { is_public: true } });
  assert.ok((await tags()).includes(tag), "public hashtag trends");
  await prisma.user.update({ where: { username: users.bob.username }, data: { is_public: false } });

  await call("alice", "POST", `/users/${users.bob.username}/follow`);
  assert.equal((await call("alice", "GET", `/users/${users.bob.username}/followers`)).status, 200, "follower sees the list");
  assert.equal((await call("alice", "GET", `/users/${users.bob.username}`)).body.profile.num_posts, 21);
  assert.ok("last_active" in (await call("alice", "GET", "/me/following")).body.following[0], "own list has last_active");
  await prisma.user.update({ where: { username: users.alice.username }, data: { is_public: true } });
  const othersList = (await call("bob", "GET", `/users/${users.alice.username}/following`)).body.users;
  assert.ok(othersList.length === 1 && !("last_active" in othersList[0]), "someone else's list has no last_active");
  assert.equal((await call("alice", "POST", `/topics/${post.id}/comments`, { body: "oi" })).status, 201, "follower can comment");
  assert.equal((await call("alice", "POST", "/topics", { quoted_id: post.id })).status, 403, "private post can't be quoted");

  // Book cover: the first upload wins, later ones are ignored.
  const book_title = `Livro ${Date.now()}`;
  const first = Buffer.from("primeira capa");
  await call("alice", "POST", "/topics", { selftext: "x", book_title, cover: { data: first.toString("base64") } });
  await call("bob", "POST", "/topics", { selftext: "x", book_title, cover: { data: Buffer.from("outra").toString("base64") } });
  const cover = await fetch(`${BASE}/covers?title=${encodeURIComponent(book_title)}`);
  assert.deepEqual(Buffer.from(await cover.arrayBuffer()), first, "first cover kept");

  // Editing is author-only: moderators and admins can't change someone else's post.
  const own = (await call("alice", "POST", "/topics", { selftext: "meu texto" })).body.topic;
  for (const role of ["moderator", "admin"]) {
    await prisma.user.update({ where: { username: users.bob.username }, data: { role } });
    assert.equal((await call("bob", "PUT", `/topics/${own.id}`, { selftext: "editado" })).status, 403, `${role} can't edit`);
  }
  assert.equal((await call("bob", "DELETE", `/topics/${own.id}`)).status, 204, "admin still deletes");
  await prisma.user.update({ where: { username: users.bob.username }, data: { role: "user" } });
  const mine = (await call("alice", "POST", "/topics", { selftext: "antes" })).body.topic;
  assert.equal((await call("alice", "PUT", `/topics/${mine.id}`, { selftext: "depois" })).body.topic.selftext, "depois");

  // Text and body limits, JSON errors.
  assert.equal((await call("alice", "PUT", "/me/profile", { bio: "x".repeat(501) })).status, 400);
  assert.equal((await call("alice", "POST", "/topics", { hashtags: Array(11).fill("a"), selftext: "x" })).status, 400);
  const big = await call("alice", "PUT", "/me/profile", { display_name: "x".repeat(300 * 1024) });
  assert.equal(big.status, 413);
  assert.ok(big.body?.error, "413 is JSON");
  const avatar = await call("alice", "PUT", "/me/avatar", { data: Buffer.alloc(2.5 * 1024 * 1024).toString("base64") });
  assert.equal(avatar.status, 413, "avatar over 2 MB");
  const bad = await raw("PUT", "/me/profile", { token: users.alice.token, body: "{not json", json: false });
  assert.equal(bad.status, 400);
  assert.ok(bad.body?.error, "bad JSON answers JSON");
  const wrongType = await call("alice", "POST", "/topics", { selftext: "x", community_id: 123 });
  assert.equal(wrongType.status, 400, "Prisma validation error is a 400");

  // Headers.
  const panel = await fetch(`${BASE}/panel/`);
  assert.ok(panel.headers.get("content-security-policy"), "panel has CSP");
  assert.equal(panel.headers.get("x-powered-by"), null);

  // User deleted: the old token stops working.
  await prisma.following.deleteMany({ where: { follower_username: users.alice.username } });
  await prisma.comment.deleteMany({ where: { author_username: users.alice.username } });
  await prisma.topic.deleteMany({ where: { author_username: users.alice.username } });
  await prisma.user.delete({ where: { username: users.alice.username } });
  assert.equal((await call("alice", "GET", "/me/profile")).status, 401, "deleted user");

  // Rate limit: keeps failing logins until 429.
  let status;
  for (let i = 0; i < 30 && status !== 429; i++) {
    status = (await raw("POST", "/auth/login", { body: { email: users.bob.email, password: "wrong-pass" } })).status;
  }
  assert.equal(status, 429, "login rate limit");
  console.log("ok: security");
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(async () => {
    const names = Object.values(users).map((u) => u.username).filter(Boolean);
    await prisma.topic.deleteMany({ where: { author_username: { in: names } } }).catch(() => {});
    await prisma.following.deleteMany({ where: { OR: [{ follower_username: { in: names } }, { followed_username: { in: names } }] } }).catch(() => {});
    await prisma.user.deleteMany({ where: { username: { in: names } } }).catch(() => {});
    await prisma.bookCover.deleteMany({ where: { book_title: { startsWith: "Livro " }, data: Buffer.from("primeira capa") } }).catch(() => {});
    await prisma.$disconnect();
  });
