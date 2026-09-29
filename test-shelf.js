// Checks the shelf against a running API (default http://localhost:3001): matching by
// title/author, statuses (want/reading/finished/re-read), removal and the book page.
// Registers a throwaway user and deletes it at the end. Run: node test-shelf.js [baseUrl]
require("dotenv/config");
const assert = require("assert");
const { PrismaClient } = require("@prisma/client");

const BASE = process.argv[2] || "http://localhost:3001";
const prisma = new PrismaClient();
const email = `shelf-${Date.now()}@test.dev`;
const BOOK = `Shelf Book ${Date.now()}`;
let token, username;

async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body && JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}
const push = (body) => call("PUT", "/me/reading", body).then((r) => r.body);
const shelf = async () => (await call("GET", `/users/${username}`)).body.profile.shelf;
const book = async (author = "") =>
  (await call("GET", `/books?title=${encodeURIComponent(BOOK)}&author=${encodeURIComponent(author)}`)).body.book;

async function main() {
  const session = await call("POST", "/auth/register", { email, password: "secret123" });
  assert.equal(session.status, 201, JSON.stringify(session.body));
  ({ token, username } = session.body);

  // Background sync (closing the book) never adds nor finishes a book.
  let r = await push({ book_title: BOOK, book_author: "Ann", progress: 10, background: true });
  assert.equal(r.entry, null);
  assert.equal((await shelf()).length, 0);

  // Quero ler: not "started" yet; the first real sync starts it.
  r = await push({ book_title: BOOK, book_author: "Ann", status: "want" });
  assert.deepEqual([r.entry.status, r.started], ["want", false]);
  assert.equal((await book("Ann")).my_entry.status, "want");
  r = await push({ book_title: `  ${BOOK.toUpperCase()} `, book_author: "ann", progress: 12 });
  assert.deepEqual([r.entry.status, r.entry.book_title, r.started], ["reading", BOOK, true], "same book despite case/spaces");

  // Same title, different author: a separate entry, and a separate book page.
  await push({ book_title: BOOK, book_author: "Bob", progress: 5 });
  assert.equal((await shelf()).length, 2);
  assert.equal((await book("Bob")).my_entry.book_author, "Bob");

  r = await push({ book_title: BOOK, book_author: "Ann", progress: 100, background: true });
  assert.deepEqual([r.entry.status, r.entry.progress, r.finished_now], ["reading", 99, false]);

  // Finishing sticks through plain syncs; an explicit "reading" is a re-read.
  r = await push({ book_title: BOOK, book_author: "Ann", status: "finished" });
  assert.equal(r.finished_now, true);
  r = await push({ book_title: BOOK, book_author: "Ann", progress: 40 });
  assert.deepEqual([r.entry.status, r.finished_now], ["finished", false]);
  r = await push({ book_title: BOOK, book_author: "Ann", status: "reading", progress: 0 });
  assert.deepEqual([r.entry.status, r.entry.progress], ["reading", 0]);
  assert.equal((await push({ book_title: BOOK, status: "bogus" })).error, "status must be want, reading or finished");

  // Removal.
  const q = (a) => `/me/reading?title=${encodeURIComponent(BOOK)}&author=${a}`;
  assert.equal((await call("DELETE", q("Bob"))).status, 204);
  assert.equal((await call("DELETE", q("Bob"))).status, 404);
  assert.deepEqual((await shelf()).map((e) => e.book_author), ["Ann"]);
  assert.equal((await book("Bob")).my_entry, null);
  console.log("ok: shelf");
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(async () => {
    if (username) await prisma.user.delete({ where: { username } }).catch(() => {});
    await prisma.$disconnect();
  });
