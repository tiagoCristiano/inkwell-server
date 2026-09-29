// Adds 10 persona users (each with posts, 2 reviews of their own books and a community with
// discussion) on top of whatever is already in the database. Never deletes anything: rows use
// stable ids / natural keys, so running it again only updates the seeded content in place.
// Run with `npm run seed:personas`. Data lives in prisma/personas/<username>.js.
require("dotenv/config");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const PASSWORD = "inkwell123"; // log in as <username>@inkwell.dev
const HOUR = 3600 * 1000;

// Same "salt:hash" format as hashPassword in index.js.
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

const dir = path.join(__dirname, "personas");
const PERSONAS = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".js"))
  .sort()
  .map((f) => require(path.join(dir, f)));
const USERNAMES = new Set(PERSONAS.map((p) => p.user.username));

// Catch typos in author/follow references before touching the database.
function validate() {
  for (const p of PERSONAS) {
    const refs = [...p.follows, ...p.community.posts.flatMap((t) => [t.author, ...t.comments.map((c) => c.author)])];
    const unknown = refs.filter((u) => !USERNAMES.has(u));
    if (unknown.length) throw new Error(`${p.user.username}: unknown usernames ${unknown.join(", ")}`);
    for (const t of p.community.posts) {
      t.comments.forEach((c, k) => {
        if (c.reply_to != null && !(c.reply_to < k)) throw new Error(`${p.user.username}: bad reply_to in "${t.title}"`);
      });
    }
  }
}

// Topic content is refreshed on every run; created_at only on the first one.
function upsertTopic(tx, id, data, created_at) {
  return tx.topic.upsert({ where: { id }, create: { id, ...data, created_at }, update: data });
}

async function seedComments(tx, topic_id, comments, start) {
  const ids = [];
  for (const [k, c] of comments.entries()) {
    const parent_id = c.reply_to != null ? ids[c.reply_to] : null;
    const key = { topic_id, author_username: c.author, body: c.body };
    const existing = await tx.comment.findFirst({ where: key, select: { id: true } });
    const created_at = new Date(start.getTime() + (k + 1) * 45 * 60 * 1000);
    ids.push((existing || (await tx.comment.create({ data: { ...key, parent_id, created_at } }))).id);
  }
}

async function seedPersona(tx, p, index) {
  const { username, display_name } = p.user;
  // Stagger personas so the feed interleaves them instead of showing one block per user.
  const at = (slot) => new Date(Date.now() - (slot * PERSONAS.length + index + 1) * 5 * HOUR);

  for (const [i, post] of p.posts.entries()) {
    await upsertTopic(tx, `persona-${username}-post-${i + 1}`, { ...post, author_username: username }, at(i + 2));
  }
  for (const [i, r] of p.reviews.entries()) {
    await upsertTopic(
      tx,
      `persona-${username}-review-${i + 1}`,
      { ...r, book_author: display_name, author_username: username },
      at(i * 5 + 1),
    );
  }

  const c = p.community;
  const community_id = `persona-community-${username}`;
  const communityData = { title: c.title, description: c.description, is_private: false };
  await tx.community.upsert({
    where: { id: community_id },
    create: { id: community_id, ...communityData, owner_username: username, created_at: at(p.posts.length + 3) },
    update: communityData,
  });
  const members = new Set([username, ...c.posts.flatMap((t) => [t.author, ...t.comments.map((x) => x.author)])]);
  await tx.communityMember.createMany({
    data: [...members].map((u) => ({ community_id, username: u })),
    skipDuplicates: true,
  });
  for (const [i, { author, comments, ...post }] of c.posts.entries()) {
    const created_at = at(i * 4 + 2);
    await upsertTopic(
      tx,
      `persona-${username}-cpost-${i + 1}`,
      { ...post, author_username: author, community_id },
      created_at,
    );
    await seedComments(tx, `persona-${username}-cpost-${i + 1}`, comments, created_at);
  }
}

async function main() {
  validate();
  console.log(`Seeding ${PERSONAS.length} personas (existing users are left untouched)...`);
  await prisma.$transaction(async (tx) => {
    for (const { user } of PERSONAS) {
      const profile = { display_name: user.display_name, bio: user.bio, gender: user.gender, age: user.age };
      await tx.user.upsert({
        where: { username: user.username },
        create: { ...profile, username: user.username, email: `${user.username}@inkwell.dev`, password: hashPassword(PASSWORD), is_public: true },
        update: profile,
      });
    }
    await tx.following.createMany({
      data: PERSONAS.flatMap((p) => p.follows.map((f) => ({ follower_username: p.user.username, followed_username: f }))),
      skipDuplicates: true,
    });
  });

  for (const [i, p] of PERSONAS.entries()) {
    await prisma.$transaction((tx) => seedPersona(tx, p, i), { timeout: 60_000 });
    console.log(`  ${p.user.username}: ${p.posts.length} posts, ${p.reviews.length} reviews, community "${p.community.title}"`);
  }
  console.log(`Done. Password for every persona: ${PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
