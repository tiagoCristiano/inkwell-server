// Checks private communities against a running API (default http://localhost:3001):
// join requests, owner approval/refusal, who sees the posts, and switching to public.
// Registers throwaway users and deletes them at the end. Run: node test-communities.js [baseUrl]
require("dotenv/config");
const assert = require("assert");
const { PrismaClient } = require("@prisma/client");

const BASE = process.argv[2] || "http://localhost:3001";
const prisma = new PrismaClient();
const users = {};

async function call(who, method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${users[who].token}` },
    body: body && JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

async function register(who) {
  const res = await fetch(BASE + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: `${who}-${Date.now()}@test.dev`, password: "secret123" }),
  });
  users[who] = await res.json();
  assert.equal(res.status, 201, JSON.stringify(users[who]));
}

async function main() {
  await register("owner");
  await register("reader");
  await register("other");
  const c = (await call("owner", "POST", "/communities", { title: "Clube secreto" })).body.community;
  assert.equal(c.is_private, true, "private by default");
  const path = `/communities/${c.id}`;
  const post = (await call("owner", "POST", "/topics", { selftext: "só membros", community_id: c.id })).body.topic;
  const view = async (who) => (await call(who, "GET", path)).body.community;

  // Outsiders see the community but not its posts, and can't post.
  let v = await view("reader");
  assert.deepEqual([v.can_see_posts, v.topics.length, v.is_member], [false, 0, false]);
  assert.equal((await call("reader", "GET", `/topics/${post.id}`)).status, 404);

  // Asking to join: pending, owner notified, still no access.
  assert.equal((await call("reader", "POST", `${path}/members`)).body.status, "pending");
  assert.equal((await call("other", "POST", `${path}/members`)).body.status, "pending");
  v = await view("reader");
  assert.deepEqual([v.is_pending, v.is_member, v.can_post], [true, false, false]);
  assert.equal((await call("reader", "POST", "/topics", { selftext: "x", community_id: c.id })).status, 403);
  const notes = (await call("owner", "GET", "/me/notifications")).body.notifications;
  assert.deepEqual(notes.map((n) => [n.type, n.community_title]).slice(0, 2),
    [["community_request", "Clube secreto"], ["community_request", "Clube secreto"]]);
  assert.equal((await view("owner")).requests.length, 2);
  assert.deepEqual((await view("reader")).requests, [], "requests are owner-only");

  // Only the owner decides.
  assert.equal((await call("reader", "POST", `${path}/requests/${users.other.username}`)).status, 403);
  assert.equal((await call("owner", "POST", `${path}/requests/${users.reader.username}`)).status, 204);
  assert.equal((await call("owner", "DELETE", `${path}/requests/${users.other.username}`)).status, 204);
  v = await view("reader");
  assert.deepEqual([v.is_member, v.can_see_posts, v.topics.length, v.num_members], [true, true, 1, 2]);
  assert.equal((await call("reader", "GET", "/me/notifications")).body.notifications[0].type, "community_approved");
  assert.equal((await view("other")).is_pending, false, "refused request is gone");

  // Public: posts open to all, joining is immediate, pending requests get in.
  await call("other", "POST", `${path}/members`);
  assert.equal((await call("reader", "PUT", `${path}/privacy`, { is_private: false })).status, 403);
  assert.equal((await call("owner", "PUT", `${path}/privacy`, { is_private: false })).body.community.is_private, false);
  assert.equal((await view("other")).is_member, true, "pending request let in when going public");
  console.log("ok: private communities");
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(async () => {
    const names = Object.values(users).map((u) => u.username).filter(Boolean);
    await prisma.community.deleteMany({ where: { owner_username: { in: names } } }).catch(() => {});
    await prisma.user.deleteMany({ where: { username: { in: names } } }).catch(() => {});
    await prisma.$disconnect();
  });
