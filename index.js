require("dotenv/config");
const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const JWT_SECRET = process.env.JWT_SECRET || "mock-secret-change-me"; // set JWT_SECRET in prod or anyone can forge admin tokens
const PORT = process.env.PORT || 3001;

// Image bytes are only loaded by the routes that serve them (omit: { cover_data: false }).
const prisma = new PrismaClient({ omit: { community: { cover_data: true } } });
const app = express();
app.use(express.json({ limit: "10mb" })); // avatars arrive as base64 in the JSON body

const ROLE_RANK = { user: 0, moderator: 1, admin: 2 };

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing bearer token" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Requires the caller's role rank to be at least minRole's rank.
function requireRole(minRole) {
  return (req, res, next) => {
    if (ROLE_RANK[req.user.role] >= ROLE_RANK[minRole]) {
      return next();
    }
    return res.status(403).json({ error: "Forbidden: insufficient role" });
  };
}

// Whether actorUsername may delete/edit content authored by targetUsername:
// - admins can moderate everyone, including other admins and moderators.
// - moderators can moderate regular users only (not admins, not other moderators).
// - everyone can always act on their own content.
function canModerate(actorRole, actorUsername, targetRole, targetUsername) {
  if (actorUsername === targetUsername) return true;
  if (actorRole === "admin") return true;
  if (actorRole === "moderator") return targetRole === "user";
  return false;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

// ponytail: plaintext fallback only for rows seeded before hashing; drop after a reseed.
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!hash) return password === stored;
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function issueSession(res, user, status = 200) {
  // ponytail: no expiry so the Kindle stays logged in; add refresh tokens + revocation for the real API.
  const token = jwt.sign({ sub: user.username, role: user.role }, JWT_SECRET);
  res.status(status).json({ token, username: user.username, role: user.role, can_create_moderator: user.role === "admin" });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

app.post("/auth/login", async (req, res) => {
  const email = (req.body?.email || "").trim().toLowerCase();
  const password = req.body?.password || "";
  if (!email || !password) {
    return res.status(400).json({ error: "Informe email e senha" });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ error: "Email ou senha inválidos" });
  }
  if (!user.password.includes(":")) {
    await prisma.user.update({ where: { username: user.username }, data: { password: hashPassword(password) } });
  }
  issueSession(res, user);
});

// Shared by self-service sign-up and admin-created moderators. The @handle is derived
// from the email's local part (made unique with a numeric suffix); the user can change
// their display name later in the profile. Returns { user } or { status, error }.
async function createAccount(rawEmail, password, role) {
  const email = (rawEmail || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { status: 400, error: "Email inválido" };
  }
  if ((password || "").length < MIN_PASSWORD_LENGTH) {
    return { status: 400, error: `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres` };
  }
  if (await prisma.user.findUnique({ where: { email } })) {
    return { status: 409, error: "Já existe uma conta com esse email" };
  }
  const base = email.split("@")[0].replace(/[^a-z0-9_]/g, "").slice(0, 20) || "leitor";
  let username = base;
  for (let n = 2; await prisma.user.findUnique({ where: { username } }); n++) {
    username = `${base}${n}`;
  }
  const user = await prisma.user.create({
    data: { username, email, password: hashPassword(password), role, display_name: username },
  });
  return { user };
}

app.post("/auth/register", async (req, res) => {
  const { user, status, error } = await createAccount(req.body?.email, req.body?.password, "user");
  if (error) return res.status(status).json({ error });
  issueSession(res, user, 201);
});

// Admin-only: create a new moderator account.
app.post("/admin/users", authMiddleware, requireRole("admin"), async (req, res) => {
  const { user, status, error } = await createAccount(req.body?.email, req.body?.password, "moderator");
  if (error) return res.status(status).json({ error });
  res.status(201).json({ username: user.username, role: user.role });
});

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

// avatar_content_type is set together with avatar_data, so it tells us whether there's
// an avatar without loading the image bytes for every author in a feed page.
const AUTHOR_SELECT = { username: true, display_name: true, avatar_content_type: true, role: true, premium: true };

// Role label shown next to the handle; null for plain users. The plugin only prints it.
const ROLE_BADGE = { admin: "admin", moderator: "moderador" };

function avatarUrl(req, username, hasAvatar) {
  if (!hasAvatar) return null;
  return `${req.protocol}://${req.get("host")}/avatars/${encodeURIComponent(username)}`;
}

function avatarUrlFor(req, user) {
  return user ? avatarUrl(req, user.username, user.avatar_content_type || user.avatar_data) : null;
}

function userCard(req, user, extra = {}) {
  return {
    username: user.username,
    display_name: user.display_name,
    bio: user.bio,
    avatar_url: avatarUrlFor(req, user),
    ...extra,
  };
}

const EXCERPT_LEN = 280;
const excerpt = (text) => (text.length > EXCERPT_LEN ? `${text.slice(0, EXCERPT_LEN)}…` : text);

// Everything a feed card needs, including whether the caller liked it.
function summaryInclude(me) {
  return {
    _count: { select: { comments: true, likes: true } },
    likes: { where: { username: me }, select: { username: true } },
    author: { select: AUTHOR_SELECT },
    community: { select: { id: true, title: true, owner_username: true } },
    quoted: { include: { author: { select: AUTHOR_SELECT } } },
  };
}

function topicSummary(req, t) {
  return {
    id: t.id,
    title: t.title,
    selftext: excerpt(t.selftext),
    author: t.author_username,
    author_display_name: t.author?.display_name,
    author_avatar_url: avatarUrlFor(req, t.author),
    author_premium: t.author?.premium === true, // supporters get a crown on their avatar
    book_title: t.book_title,
    book_author: t.book_author,
    hashtags: t.hashtags,
    rating: t.rating,
    num_comments: t._count.comments,
    num_likes: t._count.likes,
    liked: t.likes.length > 0,
    created_at: t.created_at.toISOString(),
    community: t.community ? { id: t.community.id, title: t.community.title, owner: t.community.owner_username } : null,
    quoted: t.quoted
      ? {
          id: t.quoted.id,
          author: t.quoted.author_username,
          author_display_name: t.quoted.author?.display_name,
          title: t.quoted.title,
          selftext: excerpt(t.quoted.selftext),
        }
      : null,
  };
}

function fullInclude(me) {
  return {
    ...summaryInclude(me),
    comments: {
      orderBy: { created_at: "asc" },
      include: {
        author: { select: AUTHOR_SELECT },
        _count: { select: { likes: true } },
        likes: { where: { username: me }, select: { username: true } },
      },
    },
  };
}

// can_delete flags tell the plugin which "Apagar" buttons to draw; the DELETE routes re-check.
function serializeTopic(req, t) {
  const { sub, role } = req.user;
  const isCommunityOwner = t.community?.owner_username === sub;
  return {
    ...topicSummary(req, t),
    selftext: t.selftext,
    can_delete: isCommunityOwner || canModerate(role, sub, t.author?.role, t.author_username),
    comments: t.comments.map((c) => ({
      can_delete: canModerate(role, sub, c.author?.role, c.author_username),
      id: c.id,
      parent_id: c.parent_id,
      author: c.author_username,
      author_display_name: c.author?.display_name,
      body: c.body,
      num_likes: c._count.likes,
      liked: c.likes.length > 0,
      created_at: c.created_at.toISOString(),
    })),
  };
}

function coverUrl(req, title) {
  return `${req.protocol}://${req.get("host")}/covers?title=${encodeURIComponent(title)}`;
}

// Sets book_cover_url on each topic whose book has an uploaded cover (one query per page).
async function attachCovers(req, topics) {
  const titles = [...new Set(topics.map((t) => t.book_title).filter(Boolean))];
  if (titles.length === 0) return topics;
  const covers = await prisma.bookCover.findMany({ where: { book_title: { in: titles } }, select: { book_title: true } });
  const has = new Set(covers.map((c) => c.book_title));
  for (const t of topics) t.book_cover_url = has.has(t.book_title) ? coverUrl(req, t.book_title) : null;
  return topics;
}

async function loadFullTopic(req, id) {
  const topic = await prisma.topic.findUnique({ where: { id }, include: fullInclude(req.user.sub) });
  return topic && (await attachCovers(req, [serializeTopic(req, topic)]))[0];
}

// Private authors' posts/reviews are only visible to themselves and their followers.
// Community posts follow the community instead: everyone for public ones, members for private ones.
async function visiblePosts(me, where) {
  const allowed = [...(await followedUsernames(me)), me];
  return {
    AND: [where, {
      OR: [
        { community: { OR: [{ is_private: false }, { members: { some: { username: me, status: "member" } } }] } },
        { community_id: null, OR: [{ author: { is_public: true } }, { author_username: { in: allowed } }] },
      ],
    }],
  };
}

async function listSummaries(req, where, { skip, take } = {}) {
  const topics = await prisma.topic.findMany({
    where: await visiblePosts(req.user.sub, where),
    skip,
    take,
    orderBy: { created_at: "desc" },
    include: summaryInclude(req.user.sub),
  });
  return attachCovers(req, topics.map((t) => topicSummary(req, t)));
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

async function notify(recipient, actor, type, topicId = null, communityId = null) {
  if (!recipient || recipient === actor) return;
  await prisma.notification.create({
    data: { recipient_username: recipient, actor_username: actor, type, topic_id: topicId, community_id: communityId },
  });
}

// "@alice" in a post/comment notifies alice (if she exists). skip = already notified otherwise.
async function notifyMentions(text, actor, topicId, skip = []) {
  const names = [...new Set([...(text || "").matchAll(/@([a-z0-9_]+)/gi)].map((m) => m[1].toLowerCase()))]
    .filter((n) => !skip.includes(n));
  if (names.length === 0) return;
  const users = await prisma.user.findMany({ where: { username: { in: names } }, select: { username: true } });
  for (const u of users) await notify(u.username, actor, "mention", topicId);
}

const unreadCount = (username) => prisma.notification.count({ where: { recipient_username: username, read: false } });

// ---------------------------------------------------------------------------
// Topics / feed
// ---------------------------------------------------------------------------

async function followedUsernames(username) {
  const rows = await prisma.following.findMany({
    where: { follower_username: username },
    select: { followed_username: true },
  });
  return rows.map((r) => r.followed_username);
}

// feed=following: posts by people you follow (plus your own); feed=reviews: every resenha; anything else: everyone.
app.get("/topics", authMiddleware, async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 2, 1), 50);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
  const where = { community_id: null };
  if (req.query.feed === "following") {
    where.author_username = { in: [...(await followedUsernames(req.user.sub)), req.user.sub] };
  } else if (req.query.feed === "reviews") {
    where.rating = { not: null };
  }
  const [topics, total, unread] = await Promise.all([
    listSummaries(req, where, { skip: offset, take: limit }),
    prisma.topic.count({ where: await visiblePosts(req.user.sub, where) }),
    unreadCount(req.user.sub),
  ]);
  res.json({ topics, offset, limit, total, has_more: offset + topics.length < total, unread_notifications: unread });
});

// q: "@alice" = by author, "#tag" = by hashtag, anything else = text in title/body.
app.get("/topics/search", authMiddleware, async (req, res) => {
  const raw = (req.query.q || "").trim();
  let where;
  if (raw.startsWith("@")) {
    where = { author_username: { startsWith: raw.slice(1).toLowerCase(), mode: "insensitive" } };
  } else if (raw.startsWith("#")) {
    where = { hashtags: { has: raw.slice(1).toLowerCase() } };
  } else {
    where = {
      OR: [
        { title: { contains: raw, mode: "insensitive" } },
        { selftext: { contains: raw, mode: "insensitive" } },
        { book_title: { contains: raw, mode: "insensitive" } },
      ],
    };
  }
  res.json({ topics: await listSummaries(req, where, { take: 50 }) });
});

app.get("/topics/:id", authMiddleware, async (req, res) => {
  const visible = await prisma.topic.count({ where: await visiblePosts(req.user.sub, { id: req.params.id }) });
  const topic = visible && (await loadFullTopic(req, req.params.id));
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  res.json({ topic });
});

app.post("/topics/:id/comments", authMiddleware, async (req, res) => {
  const topic = await prisma.topic.findUnique({ where: { id: req.params.id } });
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  const { body, parent_id } = req.body || {};
  if (!body) {
    return res.status(400).json({ error: "body is required" });
  }
  let parent = null;
  if (parent_id != null) {
    parent = await prisma.comment.findFirst({ where: { id: parent_id, topic_id: topic.id } });
    if (!parent) {
      return res.status(400).json({ error: "parent_id does not exist on this topic" });
    }
  }
  // Replies are one level deep (social style): a reply to a reply hangs off the top-level comment.
  const rootId = parent ? parent.parent_id ?? parent.id : null;
  await prisma.comment.create({
    data: { body, parent_id: rootId, author_username: req.user.sub, topic_id: topic.id },
  });
  await notify(topic.author_username, req.user.sub, "comment", topic.id);
  if (parent && parent.author_username !== topic.author_username) {
    await notify(parent.author_username, req.user.sub, "reply", topic.id);
  }
  await notifyMentions(body, req.user.sub, topic.id, [topic.author_username, parent?.author_username]);
  res.status(201).json({ topic: await loadFullTopic(req, topic.id) });
});

app.delete("/topics/:id", authMiddleware, async (req, res) => {
  const topic = await prisma.topic.findUnique({ where: { id: req.params.id }, include: { community: true } });
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  const author = await prisma.user.findUnique({ where: { username: topic.author_username } });
  const isCommunityOwner = topic.community?.owner_username === req.user.sub;
  if (!isCommunityOwner && !canModerate(req.user.role, req.user.sub, author.role, topic.author_username)) {
    return res.status(403).json({ error: "Forbidden: cannot moderate this author" });
  }
  await prisma.topic.delete({ where: { id: topic.id } });
  res.status(204).end();
});

app.put("/topics/:id", authMiddleware, async (req, res) => {
  const topic = await prisma.topic.findUnique({ where: { id: req.params.id } });
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  const author = await prisma.user.findUnique({ where: { username: topic.author_username } });
  if (!canModerate(req.user.role, req.user.sub, author.role, topic.author_username)) {
    return res.status(403).json({ error: "Forbidden: cannot edit this author's content" });
  }
  const { title, selftext } = req.body || {};
  await prisma.topic.update({
    where: { id: topic.id },
    data: {
      ...(typeof title === "string" ? { title } : {}),
      ...(typeof selftext === "string" ? { selftext } : {}),
    },
  });
  res.json({ topic: await loadFullTopic(req, topic.id) });
});

app.delete("/topics/:id/comments/:commentId", authMiddleware, async (req, res) => {
  const topic = await prisma.topic.findUnique({ where: { id: req.params.id } });
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  const commentId = parseInt(req.params.commentId, 10);
  const comment = await prisma.comment.findFirst({ where: { id: commentId, topic_id: topic.id } });
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }
  const author = await prisma.user.findUnique({ where: { username: comment.author_username } });
  if (!canModerate(req.user.role, req.user.sub, author.role, comment.author_username)) {
    return res.status(403).json({ error: "Forbidden: cannot moderate this author" });
  }
  // onDelete: Cascade on Comment.parent_id handles cascading to replies (and their replies).
  await prisma.comment.delete({ where: { id: commentId } });
  res.json({ topic: await loadFullTopic(req, topic.id) });
});

// A post needs at least some text (title is optional now), or to be a quote of another post.
// ---------------------------------------------------------------------------
// Plans: free users have quotas, premium users (User.premium) have none.
// The API is the only place these rules live; clients just show the error message.
// ---------------------------------------------------------------------------

const FREE_LIMITS = {
  feedPostsPerDay: 3, // posts outside communities (incl. reviews and quotes), rolling 24h; reading posts don't count
  communities: 1, // communities owned
  topicsPerCommunity: 1, // topics created inside each community
};
const DAY_MS = 24 * 60 * 60 * 1000;

// Usage is free; supporters (a US$1 donation to help keep the server running) get a month
// without limits. Keyed by the client's Accept-Language (en default, pt_BR).
const SUPPORT = {
  en: " Want more? Donate US$1 to help keep the Inkwell server running and become a supporter: no limits for 1 month.",
  pt_BR: " Quer mais? Doe US$1 para ajudar a manter o servidor do Inkwell e vire apoiador: sem limites por 1 mês.",
};
const QUOTA_MESSAGES = {
  en: {
    topicsPerCommunity: (n) => `You can create ${n} topic per community.`,
    feedPostsPerDay: (n) => `You've reached today's limit of ${n} posts.`,
    communities: (n) => `You can create ${n} community.`,
  },
  pt_BR: {
    topicsPerCommunity: (n) => `Você pode criar ${n} tópico por comunidade.`,
    feedPostsPerDay: (n) => `Você atingiu o limite de ${n} posts por dia.`,
    communities: (n) => `Você pode criar ${n} comunidade.`,
  },
};

// 402 (not 403) so clients show the message instead of a generic "forbidden".
// Carries only the limit that was hit; the text is built per request language in sendQuotaError.
class QuotaError extends Error {
  constructor(limit) {
    super(limit);
    this.limit = limit;
  }
}

// Runs fn(tx) holding a per-user lock, so concurrent requests can't both pass a quota
// check before either one's insert lands. The lock is released when the transaction ends.
function withUserLock(username, fn) {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${username}))`;
    return fn(tx);
  });
}

function planUser(tx, username) {
  return tx.user.findUnique({ where: { username }, select: { premium: true, post_quota_reset_at: true } });
}

// Feed posts counted against the free daily quota: the last 24h, but only since the last
// admin reset (POST /admin/reset-post-quotas). Shared by enforcement and GET /me/plan.
function feedPostsUsed(tx, username, user) {
  const dayAgo = new Date(Date.now() - DAY_MS);
  const since = user.post_quota_reset_at > dayAgo ? user.post_quota_reset_at : dayAgo;
  return tx.topic.count({
    where: { author_username: username, community_id: null, reading_event: null, created_at: { gt: since } },
  });
}

// Admin switch (web panel): when off, nobody hits a free-plan limit. Missing row = on.
async function quotasEnabled(tx) {
  const settings = await tx.appSettings.findUnique({ where: { id: 1 } });
  return settings?.quotas_enabled ?? true;
}

async function assertCanPost(tx, username, communityId) {
  const user = await planUser(tx, username);
  if (user.premium || !(await quotasEnabled(tx))) return;
  if (communityId) {
    const count = await tx.topic.count({ where: { author_username: username, community_id: communityId } });
    if (count >= FREE_LIMITS.topicsPerCommunity) {
      throw new QuotaError("topicsPerCommunity");
    }
    return;
  }
  if ((await feedPostsUsed(tx, username, user)) >= FREE_LIMITS.feedPostsPerDay) {
    throw new QuotaError("feedPostsPerDay");
  }
}

async function assertCanCreateCommunity(tx, username) {
  if ((await planUser(tx, username)).premium || !(await quotasEnabled(tx))) return;
  if ((await tx.community.count({ where: { owner_username: username } })) >= FREE_LIMITS.communities) {
    throw new QuotaError("communities");
  }
}

// The caller's plan, the free-plan limits and how much of them is used, for the plans screen.
app.get("/me/plan", authMiddleware, async (req, res) => {
  const username = req.user.sub;
  const user = await planUser(prisma, username);
  const [feed_posts_today, communities] = await Promise.all([
    feedPostsUsed(prisma, username, user),
    prisma.community.count({ where: { owner_username: username } }),
  ]);
  res.json({
    premium: user.premium,
    free_limits: {
      feed_posts_per_day: FREE_LIMITS.feedPostsPerDay,
      communities: FREE_LIMITS.communities,
      topics_per_community: FREE_LIMITS.topicsPerCommunity,
    },
    usage: { feed_posts_today, communities },
  });
});

app.get("/admin/settings", authMiddleware, requireRole("admin"), async (req, res) => {
  res.json({ quotas_enabled: await quotasEnabled(prisma) });
});

app.put("/admin/settings", authMiddleware, requireRole("admin"), async (req, res) => {
  const quotas_enabled = req.body?.quotas_enabled;
  if (typeof quotas_enabled !== "boolean") {
    return res.status(400).json({ error: "quotas_enabled (boolean) is required" });
  }
  await prisma.appSettings.upsert({ where: { id: 1 }, create: { quotas_enabled }, update: { quotas_enabled } });
  res.json({ quotas_enabled });
});

// Gives every user a fresh daily feed-post balance (posts before now stop counting).
app.post("/admin/reset-post-quotas", authMiddleware, requireRole("admin"), async (req, res) => {
  const { count } = await prisma.user.updateMany({ data: { post_quota_reset_at: new Date() } });
  res.json({ users: count });
});

// Automatic reading posts, written here (not by the client) so a quota-free post can't
// carry arbitrary content. lang is the client's UI language.
const READING_POSTS = {
  en: { started: "I started reading %s.", finished: "I finished reading %s.", by: "%s, by %s", tag: { started: "reading", finished: "read" } },
  pt_BR: { started: "Comecei a ler %s.", finished: "Terminei de ler %s.", by: "%s, de %s", tag: { started: "lendo", finished: "lido" } },
};

// Validates a reading post against the user's shelf and returns { fields } or { error }.
// Allowed once per book and event: "started" needs the book on the shelf, "finished" needs it finished.
async function readingPost(tx, username, book_title, book_author, event, lang) {
  const texts = READING_POSTS[lang] || READING_POSTS.en;
  if (!texts[event]) return { error: "reading_event must be started or finished" };
  const entry = await findShelfEntry(tx, username, book_title, book_author);
  if (!entry || entry.status === "want" || (event === "finished" && entry.status !== "finished")) {
    return { error: "Livro não está na sua estante com esse status" };
  }
  book_title = entry.book_title;
  if (await tx.topic.count({ where: { author_username: username, book_title: { equals: book_title, mode: "insensitive" }, reading_event: event } })) {
    return { error: "Essa leitura já foi compartilhada" };
  }
  const book = entry.book_author ? texts.by.replace("%s", book_title).replace("%s", entry.book_author) : book_title;
  return {
    fields: {
      selftext: texts[event].replace("%s", book),
      book_title,
      book_author: entry.book_author || null,
      hashtags: [texts.tag[event]],
      reading_event: event,
    },
  };
}

// cover: { data: "<base64>", content_type } extracted by the plugin from the open ebook.
async function saveBookCover(book_title, cover) {
  if (!book_title || typeof cover?.data !== "string" || !cover.data) return;
  const data = Buffer.from(cover.data, "base64");
  if (data.length === 0) return;
  const content_type = cover.content_type || "image/jpeg";
  await prisma.bookCover.upsert({
    where: { book_title },
    create: { book_title, data, content_type },
    update: { data, content_type },
  });
}

// Body: { reading_event, book_title, book_author, lang, cover }. Anything else the client sends is ignored.
async function createReadingPost(req, res) {
  const book_title = normBook(req.body.book_title);
  if (!book_title) return res.status(400).json({ error: "book_title is required" });
  // Same per-user lock as the quotas: two racing requests can't both share one event.
  const result = await withUserLock(req.user.sub, async (tx) => {
    const built = await readingPost(tx, req.user.sub, book_title, req.body.book_author, req.body.reading_event, req.body.lang);
    if (built.error) return built;
    return { topic: await tx.topic.create({ data: { ...built.fields, author_username: req.user.sub } }) };
  });
  if (result.error) return res.status(400).json({ error: result.error });
  await saveBookCover(result.topic.book_title, req.body.cover);
  res.status(201).json({ topic: await loadFullTopic(req, result.topic.id) });
}

function sendQuotaError(req, res, err) {
  if (!(err instanceof QuotaError)) throw err;
  const lang = req.get("Accept-Language") === "pt_BR" ? "pt_BR" : "en";
  const error = QUOTA_MESSAGES[lang][err.limit](FREE_LIMITS[err.limit]) + SUPPORT[lang];
  res.status(402).json({ error, code: "premium_required" });
}

app.post("/topics", authMiddleware, async (req, res) => {
  if (req.body?.reading_event != null) return createReadingPost(req, res);
  const { title, selftext, book_title, book_author, hashtags, community_id, quoted_id, cover, rating } = req.body || {};
  if (!title && !selftext && !quoted_id) {
    return res.status(400).json({ error: "Escreva algo para publicar" });
  }
  if (rating != null) {
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ error: "A nota deve ser de 0 a 5" });
    }
    if (!title || !selftext || !book_title) {
      return res.status(400).json({ error: "Resenha precisa de livro, título e texto" });
    }
  }
  if (community_id != null) {
    if (!(await prisma.community.findUnique({ where: { id: community_id } }))) {
      return res.status(400).json({ error: "community_id does not exist" });
    }
    const member = await prisma.communityMember.findUnique({
      where: { community_id_username: { community_id, username: req.user.sub } },
    });
    if (member?.status !== "member") {
      return res.status(403).json({ error: "Participe da comunidade para postar nela" });
    }
  }
  const quoted = quoted_id ? await prisma.topic.findUnique({ where: { id: quoted_id } }) : null;
  if (quoted_id && !quoted) {
    return res.status(400).json({ error: "quoted_id does not exist" });
  }
  let topic;
  try {
    topic = await withUserLock(req.user.sub, async (tx) => {
      await assertCanPost(tx, req.user.sub, community_id || null);
      return tx.topic.create({
        data: {
          title: title || "",
          selftext: selftext || "",
          book_title: book_title || quoted?.book_title || null,
          book_author: book_author || quoted?.book_author || null,
          hashtags: Array.isArray(hashtags) ? hashtags.map((h) => String(h).toLowerCase()) : [],
          author_username: req.user.sub,
          community_id: community_id || null,
          quoted_id: quoted?.id || null,
          rating: rating ?? null,
        },
      });
    });
  } catch (err) {
    return sendQuotaError(req, res, err);
  }
  await saveBookCover(topic.book_title, cover);
  if (quoted) await notify(quoted.author_username, req.user.sub, "quote", topic.id);
  await notifyMentions(`${title || ""} ${selftext || ""}`, req.user.sub, topic.id, [quoted?.author_username]);
  res.status(201).json({ topic: await loadFullTopic(req, topic.id) });
});

// ---------------------------------------------------------------------------
// Likes
// ---------------------------------------------------------------------------

// Idempotent like/unlike; returns the fresh count so the client can just redraw.
async function setLike(model, where, data, liking) {
  if (!liking) {
    await model.deleteMany({ where: data });
    return false;
  }
  const existing = await model.findUnique({ where });
  if (!existing) await model.create({ data });
  return !existing; // newly liked
}

for (const method of ["post", "delete"]) {
  app[method]("/topics/:id/like", authMiddleware, async (req, res) => {
    const topic = await prisma.topic.findUnique({ where: { id: req.params.id } });
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    const data = { topic_id: topic.id, username: req.user.sub };
    const isNew = await setLike(prisma.topicLike, { topic_id_username: data }, data, method === "post");
    if (isNew) await notify(topic.author_username, req.user.sub, "like", topic.id);
    const num_likes = await prisma.topicLike.count({ where: { topic_id: topic.id } });
    res.json({ liked: method === "post", num_likes });
  });

  app[method]("/comments/:id/like", authMiddleware, async (req, res) => {
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(req.params.id, 10) || 0 } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    const data = { comment_id: comment.id, username: req.user.sub };
    const isNew = await setLike(prisma.commentLike, { comment_id_username: data }, data, method === "post");
    if (isNew) await notify(comment.author_username, req.user.sub, "comment_like", comment.topic_id);
    const num_likes = await prisma.commentLike.count({ where: { comment_id: comment.id } });
    res.json({ liked: method === "post", num_likes });
  });
}

// ---------------------------------------------------------------------------
// Communities
// ---------------------------------------------------------------------------

// Expects c loaded with communityInclude(username).
function communitySummary(req, c) {
  const status = c.members[0]?.status; // the caller's: member | pending | undefined
  const isMember = status === "member";
  const isOwner = c.owner_username === req.user.sub;
  return {
    id: c.id,
    cover_url: c.cover_updated_at
      ? `${req.protocol}://${req.get("host")}/communities/${c.id}/cover?v=${c.cover_updated_at.getTime()}`
      : null,
    title: c.title,
    description: c.description,
    owner: c.owner_username,
    num_topics: c._count.topics,
    num_members: c._count.members,
    is_private: c.is_private,
    is_member: isMember,
    is_pending: status === "pending",
    can_see_posts: !c.is_private || isMember,
    can_manage: isOwner, // cover, privacy, join requests
    can_edit_cover: isOwner,
    can_leave: isMember && !isOwner,
    can_post: isMember,
    created_at: c.created_at.toISOString(),
  };
}

// Counts, plus the caller's own membership row (if any) for is_member / is_pending.
function communityInclude(username) {
  return {
    _count: { select: { topics: true, members: { where: { status: "member" } } } },
    members: { where: { username }, select: { status: true } },
  };
}

// Loads a community for an owner-only action; sends the error and returns null otherwise.
async function ownedCommunity(req, res) {
  const community = await prisma.community.findUnique({ where: { id: req.params.id } });
  if (!community) {
    res.status(404).json({ error: "Comunidade não encontrada" });
  } else if (community.owner_username !== req.user.sub) {
    res.status(403).json({ error: "Só o dono da comunidade pode fazer isso" });
  } else {
    return community;
  }
  return null;
}

// ponytail: no pagination, add offset/limit like /topics once there are many communities.
app.get("/communities", authMiddleware, async (req, res) => {
  const communities = await prisma.community.findMany({
    orderBy: { title: "asc" },
    include: communityInclude(req.user.sub),
  });
  res.json({ communities: communities.map((c) => communitySummary(req, c)) });
});

app.post("/communities", authMiddleware, async (req, res) => {
  const title = (req.body?.title || "").trim();
  const description = (req.body?.description || "").trim();
  if (!title) {
    return res.status(400).json({ error: "Informe o título da comunidade" });
  }
  let community;
  try {
    community = await withUserLock(req.user.sub, async (tx) => {
      await assertCanCreateCommunity(tx, req.user.sub);
      return tx.community.create({
        data: {
          title,
          description,
          owner_username: req.user.sub,
          members: { create: { username: req.user.sub } },
        },
        include: communityInclude(req.user.sub),
      });
    });
  } catch (err) {
    return sendQuotaError(req, res, err);
  }
  res.status(201).json({ community: { ...communitySummary(req, community), topics: [] } });
});

app.get("/communities/:id", authMiddleware, async (req, res) => {
  const community = await prisma.community.findUnique({
    where: { id: req.params.id },
    include: communityInclude(req.user.sub),
  });
  if (!community) {
    return res.status(404).json({ error: "Comunidade não encontrada" });
  }
  const summary = communitySummary(req, community);
  const [topics, requests] = await Promise.all([
    summary.can_see_posts ? listSummaries(req, { community_id: community.id }) : [],
    summary.can_manage
      ? prisma.communityMember.findMany({
          where: { community_id: community.id, status: "pending" },
          orderBy: { joined_at: "asc" },
          include: { user: { select: AUTHOR_SELECT } },
        })
      : [],
  ]);
  res.json({
    community: {
      ...summary,
      topics,
      // Owner only: people waiting for approval.
      requests: requests.map((r) => ({
        username: r.username,
        display_name: r.user.display_name,
        avatar_url: avatarUrlFor(req, r.user),
        requested_at: r.joined_at.toISOString(),
      })),
    },
  });
});

// Owner-only. Body: { is_private }. Turning a community public lets everyone waiting in.
app.put("/communities/:id/privacy", authMiddleware, async (req, res) => {
  const community = await ownedCommunity(req, res);
  if (!community) return;
  if (typeof req.body?.is_private !== "boolean") {
    return res.status(400).json({ error: "is_private (boolean) is required" });
  }
  const [updated] = await prisma.$transaction([
    prisma.community.update({ where: { id: community.id }, data: { is_private: req.body.is_private } }),
    ...(req.body.is_private
      ? []
      : [prisma.communityMember.updateMany({ where: { community_id: community.id, status: "pending" }, data: { status: "member" } })]),
  ]);
  const full = await prisma.community.findUnique({ where: { id: updated.id }, include: communityInclude(req.user.sub) });
  res.json({ community: communitySummary(req, full) });
});

// Owner-only: approve (POST) or refuse (DELETE) a pending join request.
app.post("/communities/:id/requests/:username", authMiddleware, async (req, res) => {
  const community = await ownedCommunity(req, res);
  if (!community) return;
  const { count } = await prisma.communityMember.updateMany({
    where: { community_id: community.id, username: req.params.username, status: "pending" },
    data: { status: "member", joined_at: new Date() },
  });
  if (!count) return res.status(404).json({ error: "Pedido não encontrado" });
  await notify(req.params.username, req.user.sub, "community_approved", null, community.id);
  res.status(204).end();
});

app.delete("/communities/:id/requests/:username", authMiddleware, async (req, res) => {
  const community = await ownedCommunity(req, res);
  if (!community) return;
  const { count } = await prisma.communityMember.deleteMany({
    where: { community_id: community.id, username: req.params.username, status: "pending" },
  });
  if (!count) return res.status(404).json({ error: "Pedido não encontrado" });
  res.status(204).end();
});

// Owner-only. Body: { data: "<base64>", content_type }. Replaces any existing cover.
app.put("/communities/:id/cover", authMiddleware, async (req, res) => {
  const community = await prisma.community.findUnique({ where: { id: req.params.id } });
  if (!community) {
    return res.status(404).json({ error: "Comunidade não encontrada" });
  }
  if (community.owner_username !== req.user.sub) {
    return res.status(403).json({ error: "Só o dono pode trocar a capa" });
  }
  const { data, content_type } = req.body || {};
  const buffer = typeof data === "string" ? Buffer.from(data, "base64") : Buffer.alloc(0);
  if (buffer.length === 0) {
    return res.status(400).json({ error: "data (base64) is required" });
  }
  const updated = await prisma.community.update({
    where: { id: community.id },
    data: { cover_data: buffer, cover_content_type: content_type || "image/jpeg", cover_updated_at: new Date() },
    include: communityInclude(req.user.sub),
  });
  res.json({ community: communitySummary(req, updated) });
});

// Public like avatars and book covers: the plugin's image downloader sends no token.
app.get("/communities/:id/cover", async (req, res) => {
  const community = await prisma.community.findUnique({ where: { id: req.params.id }, omit: { cover_data: false } });
  if (!community?.cover_data) {
    return res.status(404).json({ error: "No cover" });
  }
  res.set("Content-Type", community.cover_content_type || "image/jpeg");
  res.send(community.cover_data);
});

// Join. Public communities let you straight in; private ones record a request (status
// "pending") and notify the owner. Returns { status: "member" | "pending" }.
app.post("/communities/:id/members", authMiddleware, async (req, res) => {
  const where = { community_id_username: { community_id: req.params.id, username: req.user.sub } };
  const community = await prisma.community.findUnique({ where: { id: req.params.id } });
  if (!community) {
    return res.status(404).json({ error: "Comunidade não encontrada" });
  }
  const existing = await prisma.communityMember.findUnique({ where });
  if (existing) return res.json({ status: existing.status });
  const status = community.is_private ? "pending" : "member";
  await prisma.communityMember.create({ data: { ...where.community_id_username, status } });
  if (status === "pending") {
    await notify(community.owner_username, req.user.sub, "community_request", null, community.id);
  }
  res.json({ status });
});

// Leave, or cancel a pending request. The owner can't leave their own community (it would be left without an owner member).
app.delete("/communities/:id/members", authMiddleware, async (req, res) => {
  const community = await prisma.community.findUnique({ where: { id: req.params.id } });
  if (!community) {
    return res.status(404).json({ error: "Comunidade não encontrada" });
  }
  if (community.owner_username === req.user.sub) {
    return res.status(400).json({ error: "O dono não pode sair da própria comunidade" });
  }
  await prisma.communityMember.deleteMany({ where: { community_id: req.params.id, username: req.user.sub } });
  res.status(204).end();
});

// ---------------------------------------------------------------------------
// Me
// ---------------------------------------------------------------------------

app.get("/me/posts", authMiddleware, async (req, res) => {
  res.json({ posts: await listSummaries(req, { author_username: req.user.sub }) });
});

function ownProfile(req, user) {
  return {
    username: user.username,
    role: user.role,
    badge: ROLE_BADGE[user.role] || null,
    display_name: user.display_name,
    bio: user.bio,
    gender: user.gender,
    age: user.age,
    is_public: user.is_public,
    avatar_url: avatarUrlFor(req, user),
  };
}

app.get("/me/profile", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { username: req.user.sub } });
  res.json({ profile: ownProfile(req, user) });
});

app.put("/me/profile", authMiddleware, async (req, res) => {
  const { display_name, bio, gender, age, is_public } = req.body || {};
  if (age != null && (!Number.isInteger(age) || age <= 18)) {
    return res.status(400).json({ error: "Idade deve ser um número inteiro maior que 18" });
  }
  const user = await prisma.user.update({
    where: { username: req.user.sub },
    data: {
      ...(typeof display_name === "string" ? { display_name } : {}),
      ...(typeof bio === "string" ? { bio } : {}),
      ...(gender === "masc" || gender === "feminino" || gender === "outro" ? { gender } : {}),
      ...(typeof age === "number" ? { age } : {}),
      ...(typeof is_public === "boolean" ? { is_public } : {}),
    },
  });
  res.json({ profile: ownProfile(req, user) });
});

// Body: { data: "<base64>", content_type: "image/jpeg" }. Replaces any existing avatar.
app.put("/me/avatar", authMiddleware, async (req, res) => {
  const { data, content_type } = req.body || {};
  if (typeof data !== "string" || !data) {
    return res.status(400).json({ error: "data (base64) is required" });
  }
  let buffer;
  try {
    buffer = Buffer.from(data, "base64");
  } catch (err) {
    return res.status(400).json({ error: "data is not valid base64" });
  }
  if (buffer.length === 0) {
    return res.status(400).json({ error: "decoded image is empty" });
  }
  const user = await prisma.user.update({
    where: { username: req.user.sub },
    data: { avatar_data: buffer, avatar_content_type: content_type || "image/jpeg" },
  });
  res.json({ avatar_url: avatarUrlFor(req, user) });
});

app.get("/me/notifications", authMiddleware, async (req, res) => {
  const rows = await prisma.notification.findMany({
    where: { recipient_username: req.user.sub },
    orderBy: { created_at: "desc" },
    take: 50,
    include: {
      actor: { select: AUTHOR_SELECT },
      topic: { select: { title: true, selftext: true } },
      community: { select: { title: true } },
    },
  });
  res.json({
    unread: rows.filter((n) => !n.read).length,
    notifications: rows.map((n) => ({
      id: n.id,
      type: n.type,
      read: n.read,
      actor: n.actor_username,
      actor_display_name: n.actor.display_name,
      actor_avatar_url: avatarUrlFor(req, n.actor),
      topic_id: n.topic_id,
      topic_excerpt: n.topic ? (n.topic.title || n.topic.selftext).slice(0, 80) : null,
      community_id: n.community_id,
      community_title: n.community?.title || null,
      created_at: n.created_at.toISOString(),
    })),
  });
});

app.post("/me/notifications/read", authMiddleware, async (req, res) => {
  await prisma.notification.updateMany({ where: { recipient_username: req.user.sub, read: false }, data: { read: true } });
  res.status(204).end();
});

// Book titles/authors are compared ignoring case and extra spaces, so "Dom  casmurro" and
// "Dom Casmurro" are one book. ponytail: no edition matching (subtitles, translations); needs a catalog/ISBN.
const normBook = (s) => (typeof s === "string" ? s : "").trim().replace(/\s+/g, " ");

// The user's shelf entry for a book: same title, and same author unless either side is blank.
async function findShelfEntry(db, username, book_title, book_author) {
  const author = normBook(book_author).toLowerCase();
  const entries = await db.readingEntry.findMany({
    where: { username, book_title: { equals: normBook(book_title), mode: "insensitive" } },
  });
  return entries.find((e) => e.book_author.toLowerCase() === author)
    || entries.find((e) => !author || !e.book_author)
    || null;
}

const SHELF_STATUSES = ["want", "reading", "finished"];

// Body: { book_title, book_author, progress (0-100), status?, background? }. Without status
// (the plugin's automatic sync) the book is "reading" until 100%, and a finished book stays
// finished. background (sync on closing the book, no share prompt possible) only updates
// progress of books already on the shelf and never finishes one, so it can't use up the
// one-time started/finished events.
// An explicit status is the user's choice and wins: "want" (quero ler), "reading" (re-read
// from progress), "finished". Returns the entry plus what changed, so the plugin can offer
// the "começou"/"terminou" post exactly once.
app.put("/me/reading", authMiddleware, async (req, res) => {
  const book_title = normBook(req.body?.book_title);
  if (!book_title) return res.status(400).json({ error: "book_title is required" });
  const status = req.body?.status;
  if (status != null && !SHELF_STATUSES.includes(status)) {
    return res.status(400).json({ error: "status must be want, reading or finished" });
  }
  const background = req.body?.background === true;
  const progress = Math.min(Math.max(parseInt(req.body?.progress, 10) || 0, 0), background ? 99 : 100);
  const username = req.user.sub;
  const previous = await findShelfEntry(prisma, username, book_title, req.body?.book_author);
  if (background && (!previous || previous.status === "want" || status != null)) {
    return res.json({ entry: previous && serializeReading(previous), started: false, finished_now: false });
  }
  const next = status === "want" ? "want"
    : status === "finished" || progress >= 100 || (!status && previous?.status === "finished") ? "finished"
    : "reading";
  const data = {
    book_author: previous?.book_author || normBook(req.body?.book_author),
    progress: next === "finished" ? 100 : next === "want" ? 0 : progress,
    status: next,
  };
  let entry;
  if (previous) {
    const key = { username, book_title: previous.book_title, book_author: previous.book_author };
    entry = await prisma.readingEntry.update({ where: { username_book_title_book_author: key }, data });
  } else {
    // Reuse the spelling other readers already have, so everyone lands on the same book page.
    const known = await prisma.readingEntry.findFirst({
      where: { book_title: { equals: book_title, mode: "insensitive" } },
      select: { book_title: true },
    });
    entry = await prisma.readingEntry.create({ data: { username, book_title: known?.book_title || book_title, ...data } });
  }
  res.json({
    entry: serializeReading(entry),
    started: next !== "want" && (!previous || previous.status === "want"),
    finished_now: next === "finished" && previous?.status !== "finished",
  });
});

// Query: title, author. Removes the book from the user's shelf (their posts stay).
app.delete("/me/reading", authMiddleware, async (req, res) => {
  const entry = await findShelfEntry(prisma, req.user.sub, req.query.title, req.query.author);
  if (!entry) return res.status(404).json({ error: "Livro não está na sua estante" });
  await prisma.readingEntry.delete({
    where: { username_book_title_book_author: { username: entry.username, book_title: entry.book_title, book_author: entry.book_author } },
  });
  res.status(204).end();
});

function serializeReading(e) {
  return {
    book_title: e.book_title,
    book_author: e.book_author,
    progress: e.progress,
    status: e.status,
    updated_at: e.updated_at.toISOString(),
  };
}

// Who to follow: people reading the same books first, then the most-followed.
app.get("/me/suggestions", authMiddleware, async (req, res) => {
  const me = req.user.sub;
  const exclude = new Set([me, ...(await followedUsernames(me))]);
  const myBooks = (await prisma.readingEntry.findMany({ where: { username: me }, select: { book_title: true } }))
    .map((r) => r.book_title);

  const picked = new Map(); // username -> reason
  if (myBooks.length > 0) {
    const sameBook = await prisma.readingEntry.findMany({
      where: { book_title: { in: myBooks }, username: { notIn: [...exclude] }, user: { is_public: true } },
      orderBy: { updated_at: "desc" },
      take: 20,
    });
    for (const r of sameBook) if (!picked.has(r.username)) picked.set(r.username, `Também leu ${r.book_title}`);
  }
  const popular = await prisma.following.groupBy({
    by: ["followed_username"],
    where: { followed_username: { notIn: [...exclude] }, followed: { is_public: true } },
    _count: { follower_username: true },
    orderBy: { _count: { follower_username: "desc" } },
    take: 10,
  });
  for (const p of popular) if (!picked.has(p.followed_username)) picked.set(p.followed_username, "Popular no Inkwell");
  if (picked.size < 10) {
    const recent = await prisma.topic.findMany({
      where: { author_username: { notIn: [...exclude, ...picked.keys()] }, author: { is_public: true } },
      orderBy: { created_at: "desc" },
      distinct: ["author_username"],
      select: { author_username: true },
      take: 10 - picked.size,
    });
    for (const r of recent) picked.set(r.author_username, "Postou recentemente");
  }

  const users = await prisma.user.findMany({ where: { username: { in: [...picked.keys()] } } });
  const byName = new Map(users.map((u) => [u.username, u]));
  res.json({
    users: [...picked]
      .filter(([username]) => byName.has(username))
      .slice(0, 10)
      .map(([username, reason]) => userCard(req, byName.get(username), { reason, followed_by_me: false })),
  });
});

// ---------------------------------------------------------------------------
// Users / follow
// ---------------------------------------------------------------------------

// Public like avatars: the plugin's image downloader sends no token.
app.get("/covers", async (req, res) => {
  const cover = await prisma.bookCover.findUnique({ where: { book_title: String(req.query.title || "") } });
  if (!cover) return res.status(404).json({ error: "No cover" });
  res.set("Content-Type", cover.content_type);
  res.send(cover.data);
});

app.get("/avatars/:username", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!user || !user.avatar_data) {
    return res.status(404).json({ error: "No avatar set" });
  }
  res.set("Content-Type", user.avatar_content_type || "image/jpeg");
  res.send(user.avatar_data);
});

for (const method of ["post", "delete"]) {
  app[method]("/users/:username/follow", authMiddleware, async (req, res) => {
    const target = req.params.username;
    if (target === req.user.sub) return res.status(400).json({ error: "Você não pode seguir a si mesmo" });
    if (!(await prisma.user.findUnique({ where: { username: target } }))) {
      return res.status(404).json({ error: "User not found" });
    }
    const data = { follower_username: req.user.sub, followed_username: target };
    if (method === "delete") {
      await prisma.following.deleteMany({ where: data });
    } else if (!(await prisma.following.findUnique({ where: { follower_username_followed_username: data } }))) {
      await prisma.following.create({ data });
      await notify(target, req.user.sub, "follow");
    }
    const num_followers = await prisma.following.count({ where: { followed_username: target } });
    res.json({ following: method === "post", num_followers });
  });
}

// People lists (followers / following) with whether the caller follows each one.
async function peopleList(req, usernames, extraByName = {}) {
  const [users, mine] = await Promise.all([
    prisma.user.findMany({ where: { username: { in: usernames } } }),
    followedUsernames(req.user.sub),
  ]);
  const byName = new Map(users.map((u) => [u.username, u]));
  return usernames
    .filter((u) => byName.has(u))
    .map((u) => userCard(req, byName.get(u), { followed_by_me: mine.includes(u), ...extraByName[u] }));
}

app.get("/users/:username/followers", authMiddleware, async (req, res) => {
  const rows = await prisma.following.findMany({
    where: { followed_username: req.params.username },
    orderBy: { followed_at: "desc" },
  });
  res.json({ users: await peopleList(req, rows.map((r) => r.follower_username)) });
});

async function followingList(req, username) {
  const rows = await prisma.following.findMany({
    where: { follower_username: username },
    orderBy: { followed_at: "desc" },
  });
  const extra = Object.fromEntries(rows.map((r) => [r.followed_username, { last_active: r.last_active }]));
  return peopleList(req, rows.map((r) => r.followed_username), extra);
}

app.get("/users/:username/following", authMiddleware, async (req, res) => {
  res.json({ users: await followingList(req, req.params.username) });
});

app.get("/me/following", authMiddleware, async (req, res) => {
  res.json({ following: await followingList(req, req.user.sub) });
});

// Public profile: bio, counters, follow state, shelf and the latest posts.
app.get("/users/:username", authMiddleware, async (req, res) => {
  const username = req.params.username;
  const me = req.user.sub;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const [num_posts, num_followers, num_following, followRow, followsMeRow, recent_posts, readings] = await Promise.all([
    prisma.topic.count({ where: { author_username: username } }),
    prisma.following.count({ where: { followed_username: username } }),
    prisma.following.count({ where: { follower_username: username } }),
    prisma.following.findUnique({ where: { follower_username_followed_username: { follower_username: me, followed_username: username } } }),
    prisma.following.findUnique({ where: { follower_username_followed_username: { follower_username: username, followed_username: me } } }),
    listSummaries(req, { author_username: username }, { take: 20 }),
    // ponytail: whole shelf in the profile payload; paginate if shelves reach thousands of books.
    prisma.readingEntry.findMany({ where: { username }, orderBy: { updated_at: "desc" } }),
  ]);

  const isPublic = user.is_public !== false;
  // Private profiles only show their shelf to themselves and their followers.
  const showShelf = isPublic || username === me || !!followRow;
  const shelf = showShelf ? readings.map(serializeReading) : [];
  res.json({
    profile: {
      username: user.username,
      display_name: user.display_name,
      bio: user.bio,
      role: user.role,
      badge: ROLE_BADGE[user.role] || null,
      avatar_url: avatarUrlFor(req, user),
      is_public: isPublic,
      gender: isPublic ? user.gender : null,
      age: isPublic ? user.age : null,
      num_posts,
      num_followers,
      num_following,
      followed_by_me: !!followRow,
      follows_me: !!followsMeRow,
      reading_now: shelf.find((r) => r.status === "reading") || null,
      shelf,
      recent_posts,
    },
  });
});

// ---------------------------------------------------------------------------
// Books / trending
// ---------------------------------------------------------------------------

// Book page: everyone who has it on their shelf, plus every post about it, plus the
// viewer's own shelf entry (my_entry). Query: title, author (optional; tells apart
// different books with the same title — blank authors match any).
app.get("/books", authMiddleware, async (req, res) => {
  const title = normBook(req.query.title);
  if (!title) return res.status(400).json({ error: "title is required" });
  const me = req.user.sub;
  const author = normBook(req.query.author);
  const byAuthor = (blank) => (author ? { OR: [{ book_author: { equals: author, mode: "insensitive" } }, ...blank] } : {});
  const [entries, topics, mine] = await Promise.all([
    prisma.readingEntry.findMany({
      where: {
        book_title: { equals: title, mode: "insensitive" },
        ...byAuthor([{ book_author: "" }]),
        AND: { OR: [{ user: { is_public: true } }, { username: { in: [...(await followedUsernames(me)), me] } }] },
      },
      orderBy: { updated_at: "desc" },
      include: { user: { select: AUTHOR_SELECT } },
      take: 50,
    }),
    listSummaries(req, { book_title: { equals: title, mode: "insensitive" }, ...byAuthor([{ book_author: null }, { book_author: "" }]) }, { take: 50 }),
    findShelfEntry(prisma, me, title, author),
  ]);
  const bookAuthor = author || entries.find((e) => e.book_author)?.book_author || topics.find((t) => t.book_author)?.book_author || "";
  const bookTitle = entries[0]?.book_title || topics[0]?.book_title || title;
  const cover = await prisma.bookCover.findUnique({ where: { book_title: bookTitle }, select: { book_title: true } });
  res.json({
    book: {
      title: bookTitle,
      author: bookAuthor,
      cover_url: cover ? coverUrl(req, bookTitle) : null,
      my_entry: mine ? serializeReading(mine) : null,
      readers: entries.map((e) => ({
        username: e.username,
        display_name: e.user.display_name,
        avatar_url: avatarUrlFor(req, e.user),
        status: e.status,
        progress: e.progress,
      })),
      topics,
    },
  });
});

app.get("/trending", authMiddleware, async (req, res) => {
  // ponytail: fixed 7-day window over all posts; precompute if the Topic table gets huge.
  const [hashtags, books] = await Promise.all([
    prisma.$queryRaw`
      SELECT tag, COUNT(*)::int AS count FROM "Topic", unnest(hashtags) AS tag
      WHERE created_at > now() - interval '7 days'
      GROUP BY tag ORDER BY count DESC LIMIT 8`,
    prisma.$queryRaw`
      SELECT book_title AS title, MAX(book_author) AS author, COUNT(*)::int AS count FROM (
        SELECT book_title, book_author FROM "Topic" WHERE book_title IS NOT NULL AND created_at > now() - interval '30 days'
        UNION ALL
        SELECT book_title, book_author FROM "ReadingEntry" WHERE updated_at > now() - interval '30 days'
      ) b GROUP BY book_title ORDER BY count DESC LIMIT 5`,
  ]);
  res.json({ hashtags, books });
});

// ---- DB admin panel: generic CRUD over every Prisma model, driven by the DMMF ----
// ponytail: Bytes columns (avatars/covers) are hidden, not editable; add upload fields if needed.
const { Prisma } = require("@prisma/client");
const DB_MODELS = Object.fromEntries(Prisma.dmmf.datamodel.models.map((m) => {
  const fields = m.fields.filter((f) => f.kind !== "object" && f.type !== "Bytes");
  const key = m.primaryKey?.fields || fields.filter((f) => f.isId).map((f) => f.name);
  return [m.name, { name: m.name, delegate: m.name[0].toLowerCase() + m.name.slice(1), fields, key }];
}));
const DB_ENUMS = Object.fromEntries(Prisma.dmmf.datamodel.enums.map((e) => [e.name, e.values.map((v) => v.name)]));
const dbAdmin = [authMiddleware, requireRole("admin")];

function dbModel(req, res) {
  const model = DB_MODELS[req.params.model];
  if (!model) res.status(404).json({ error: "Unknown model" });
  return model;
}

// Only scalar columns pass through; User.password is hashed and left untouched when blank.
function dbData(model, body = {}) {
  const data = {};
  for (const f of model.fields) {
    if (!(f.name in body)) continue;
    if (model.name === "User" && f.name === "password") {
      if (body.password) data.password = hashPassword(body.password);
    } else {
      data[f.name] = body[f.name];
    }
  }
  return data;
}

function dbWhere(model, keyValues = {}) {
  const pick = Object.fromEntries(model.key.map((k) => [k, keyValues[k]]));
  return model.key.length === 1 ? pick : { [model.key.join("_")]: pick };
}

function dbSelect(model) {
  return Object.fromEntries(model.fields.map((f) => [f.name, !(model.name === "User" && f.name === "password")]));
}

function dbError(res, err) {
  res.status(400).json({ error: err.message.split("\n").filter(Boolean).pop() });
}

app.get("/db/schema", dbAdmin, (req, res) => {
  res.json({ models: Object.values(DB_MODELS).map(({ delegate, ...m }) => m), enums: DB_ENUMS });
});

app.get("/db/:model", dbAdmin, async (req, res) => {
  const model = dbModel(req, res);
  if (!model) return;
  const q = (req.query.q || "").trim();
  const strings = model.fields.filter((f) => f.type === "String" && !f.isList && f.name !== "password");
  const where = q ? { OR: strings.map((f) => ({ [f.name]: { contains: q, mode: "insensitive" } })) } : {};
  const skip = Math.max(0, parseInt(req.query.skip, 10) || 0);
  const take = Math.min(200, parseInt(req.query.take, 10) || 50);
  try {
    const delegate = prisma[model.delegate];
    const [rows, total] = await Promise.all([
      delegate.findMany({ where, skip, take, select: dbSelect(model), orderBy: model.key.map((k) => ({ [k]: "asc" })) }),
      delegate.count({ where }),
    ]);
    res.json({ rows, total });
  } catch (err) {
    dbError(res, err);
  }
});

app.post("/db/:model", dbAdmin, async (req, res) => {
  const model = dbModel(req, res);
  if (!model) return;
  try {
    res.status(201).json(await prisma[model.delegate].create({ data: dbData(model, req.body), select: dbSelect(model) }));
  } catch (err) {
    dbError(res, err);
  }
});

// Rows are addressed by their primary-key values in the body, since some keys are composite.
app.put("/db/:model", dbAdmin, async (req, res) => {
  const model = dbModel(req, res);
  if (!model) return;
  try {
    res.json(await prisma[model.delegate].update({
      where: dbWhere(model, req.body?.key), data: dbData(model, req.body?.data), select: dbSelect(model),
    }));
  } catch (err) {
    dbError(res, err);
  }
});

app.delete("/db/:model", dbAdmin, async (req, res) => {
  const model = dbModel(req, res);
  if (!model) return;
  try {
    await prisma[model.delegate].delete({ where: dbWhere(model, req.body?.key) });
    res.status(204).end();
  } catch (err) {
    dbError(res, err);
  }
});

// Built Solid admin panel (mock-server/admin): `cd admin && npm run build`, then open /panel.
app.use("/panel", express.static(require("path").join(__dirname, "admin/dist")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mock forum API listening on http://0.0.0.0:${PORT}`);
});
