// Checks the free/premium quotas against a running API (default http://localhost:3001).
// Registers a throwaway user, exercises every limit (incl. concurrent requests), then
// deletes everything it created. Run: node test-premium.js [baseUrl]
require("dotenv/config");
const assert = require("assert");
const { PrismaClient } = require("@prisma/client");

const BASE = process.argv[2] || "http://localhost:3001";
const prisma = new PrismaClient();
const email = `quota-${Date.now()}@test.dev`;
let token, username;

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body && JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

const post = (extra = {}) => call("POST", "/topics", { selftext: "quota test", ...extra });
const statuses = (results) => results.map((r) => r.status).sort();

async function main() {
  const session = await call("POST", "/auth/register", { email, password: "secret123" });
  assert.equal(session.status, 201, JSON.stringify(session.body));
  ({ token, username } = session.body);

  // Reading posts: only for books on the shelf, once per event, and quota-free.
  const reading = (reading_event, book_title = "Quota Book") =>
    post({ reading_event, book_title, lang: "en", selftext: "ignored" });
  assert.equal((await reading("started")).status, 400, "book not on the shelf");
  await call("PUT", "/me/reading", { book_title: "Quota Book", book_author: "Ann", progress: 10 });
  assert.equal((await reading("finished")).status, 400, "book not finished yet");
  const started = await reading("started");
  assert.equal(started.status, 201);
  assert.equal(started.body.topic.selftext, "I started reading Quota Book, by Ann.", "server writes the text");
  assert.equal((await reading("started")).status, 400, "shared once per book and event");
  await call("PUT", "/me/reading", { book_title: "Quota Book", status: "finished" });
  assert.equal((await reading("finished")).status, 201);

  // Free: 3 feed posts per 24h (reading posts above don't count), even when requests race.
  assert.equal((await post()).status, 201);
  assert.equal((await post()).status, 201);
  assert.deepEqual(statuses(await Promise.all([post(), post()])), [201, 402]);
  const blocked = await post({ title: "review", book_title: "B", rating: 4 });
  assert.equal(blocked.status, 402, "reviews count toward the daily feed limit");
  assert.equal(blocked.body.code, "premium_required");
  assert.equal((await reading("started", "Other Book")).status, 400, "quota-free path still needs a shelf entry");
  const plan = (await call("GET", "/me/plan")).body;
  assert.equal(plan.premium, false);
  assert.equal(plan.free_limits.feed_posts_per_day, 3);
  assert.equal(plan.usage.feed_posts_today, 3, "usage matches what enforcement counted");

  // Balance reset: only admins may trigger it; posts before the reset stop counting.
  // (The endpoint stamps every user; here only this user is stamped, to not touch real data.)
  assert.equal((await call("POST", "/admin/reset-post-quotas")).status, 403);
  await prisma.user.update({ where: { username }, data: { post_quota_reset_at: new Date() } });
  assert.equal((await call("GET", "/me/plan")).body.usage.feed_posts_today, 0);
  assert.equal((await post()).status, 201, "fresh balance after reset");

  // Free: 1 community, even when two requests race.
  const created = await Promise.all([1, 2].map((n) => call("POST", "/communities", { title: `Quota ${n}` })));
  assert.deepEqual(statuses(created), [201, 402]);
  const community = created.find((r) => r.status === 201).body.community;

  // Free: 1 topic per community; community posts don't use the daily feed quota.
  assert.equal((await post({ community_id: community.id })).status, 201);
  assert.equal((await post({ community_id: community.id })).status, 402);

  // The user can't grant themselves premium.
  await call("PUT", "/me/profile", { premium: true });
  assert.equal((await prisma.user.findUnique({ where: { username } })).premium, false);

  // Premium: no limits.
  await prisma.user.update({ where: { username }, data: { premium: true } });
  assert.equal((await post()).status, 201);
  assert.equal((await post({ community_id: community.id })).status, 201);
  assert.equal((await call("POST", "/communities", { title: "Quota 3" })).status, 201);
  assert.equal((await call("GET", "/me/plan")).body.premium, true);

  console.log("ok: free/premium quotas enforced");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (username) {
      await prisma.topic.deleteMany({ where: { author_username: username } });
      await prisma.community.deleteMany({ where: { owner_username: username } });
      await prisma.readingEntry.deleteMany({ where: { username } });
      await prisma.bookCover.deleteMany({ where: { book_title: "Quota Book" } });
      await prisma.user.delete({ where: { username } });
    }
    await prisma.$disconnect();
  });
