// Small, text-heavy seed: the 3 fixed test accounts, 2 long posts each, a few long
// comments (with one reply) per post, follows between them and one community.
// Wipes everything first. Run with `npm run seed`.
require("dotenv/config");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Same "salt:hash" format as hashPassword in index.js.
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

// Log in as <username>@inkwell.dev (the plugin's quick-login buttons use these).
const USERS = [
  { username: "admin", password: "admin123", role: "admin", display_name: "Admin", bio: "Mantenedor do Inkwell. Leio ficção científica no ônibus e clássicos no fim de semana.", gender: "masc", age: 34, is_public: true },
  { username: "moderador", password: "mod123", role: "moderator", display_name: "Moderador", bio: "Ajuda a manter a ordem por aqui. Fã de poesia e de edições comentadas.", gender: "masc", age: 29, is_public: true },
  { username: "usuario", password: "user123", role: "user", display_name: "Usuário", bio: "Só um leitor comum, tentando vencer a pilha de livros na mesa de cabeceira.", gender: "feminino", age: 22, is_public: false },
];

const P = {
  a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla, vestibulum id ligula porta felis euismod semper.",
  b: "Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor, etiam porta sem malesuada magna mollis euismod, nulla vitae elit libero, a pharetra augue.",
  c: "Sed posuere consectetur est at lobortis. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
  d: "Donec id elit non mi porta gravida at eget metus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nulla vitae elit libero, a pharetra augue. Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes.",
};

// Each post: 3 top-level comments by the other users; the first one gets a reply from the author.
const POSTS = [
  {
    author: "admin",
    title: "Relendo Dom Casmurro depois de quinze anos: o que muda quando a gente amadurece junto com o livro",
    book_title: "Dom Casmurro",
    book_author: "Machado de Assis",
    hashtags: ["classicos", "releitura", "machado"],
    selftext: `${P.a}\n\n${P.b} O texto integral está em domínio público no Domínio Público: http://www.dominiopublico.gov.br/download/texto/bv000114.pdf\n\n${P.c}\n\n${P.d}`,
  },
  {
    author: "admin",
    title: "Guia completo: configurando o KOReader no Kindle para leitura noturna sem cansar a vista",
    hashtags: ["koreader", "kindle", "dica"],
    selftext: `${P.b}\n\n${P.c} A documentação oficial explica cada opção de refresh: https://koreader.rocks/user_guide/\n\n${P.a}\n\n${P.d} Os plugins que uso estão listados em https://github.com/koreader/koreader/wiki`,
  },
  {
    author: "moderador",
    title: "Drummond, Cecília e Pessoa: por que a poesia rende tanto em tela de tinta eletrônica",
    book_title: "Mensagem",
    book_author: "Fernando Pessoa",
    hashtags: ["poesia", "leitura"],
    selftext: `${P.c}\n\n${P.a}\n\n${P.d} Recomendo a edição digital gratuita em https://www.gutenberg.org/ebooks/search/?query=pessoa\n\n${P.b}`,
    community: "poesia",
  },
  {
    author: "moderador",
    title: "Regras da casa, moderação e como manter as discussões sobre livros civilizadas e sem spoilers",
    hashtags: ["comunidade", "regras"],
    selftext: `${P.d}\n\n${P.b}\n\n${P.a} Em caso de dúvida, marque o spoiler e deixe um aviso no início do post.\n\n${P.c}`,
  },
  {
    author: "usuario",
    title: "Terminei Duna e preciso falar sobre o final: a ecologia de Arrakis como personagem principal",
    book_title: "Duna",
    book_author: "Frank Herbert",
    hashtags: ["ficcaocientifica", "resenha"],
    selftext: `${P.a}\n\n${P.d}\n\n${P.c} Achei esta análise excelente: https://pt.wikipedia.org/wiki/Duna_(livro)\n\n${P.b}`,
  },
  {
    author: "usuario",
    title: "Minha pilha de leitura para o próximo semestre e um pedido de recomendações de vocês",
    hashtags: ["tbr", "livros"],
    selftext: `${P.b}\n\n${P.a}\n\n${P.d}\n\n${P.c}`,
  },
];

const COMMENTS = [
  `${P.a} ${P.c}`,
  `${P.b} Tem um texto ótimo sobre isso em https://www.bbc.com/portuguese — vale a leitura. ${P.d}`,
  `${P.c} ${P.a}`,
];
const REPLY = `${P.d} Obrigado pelo comentário! ${P.b}`;

async function main() {
  console.log("Clearing existing data...");
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Notification", "TopicLike", "CommentLike", "ReadingEntry", "Comment", "Following", "CommunityMember", "Community", "Topic", "User" RESTART IDENTITY CASCADE',
  );

  console.log(`Seeding ${USERS.length} users...`);
  await prisma.user.createMany({
    data: USERS.map((u) => ({ ...u, email: `${u.username}@inkwell.dev`, password: hashPassword(u.password) })),
  });

  await prisma.following.createMany({
    data: [
      { follower_username: "admin", followed_username: "moderador" },
      { follower_username: "moderador", followed_username: "admin" },
      { follower_username: "usuario", followed_username: "admin" },
    ],
  });

  const community = await prisma.community.create({
    data: {
      id: "seed-community-poesia",
      title: "Poesia",
      description: "Drummond, Cecília, Pessoa. Poste o verso que te pegou hoje.",
      owner_username: "moderador",
      members: { create: USERS.map((u) => ({ username: u.username })) },
    },
  });

  console.log(`Seeding ${POSTS.length} posts with comments...`);
  for (const [i, post] of POSTS.entries()) {
    const { community: slug, author, ...data } = post;
    const created_at = new Date(Date.now() - (i + 1) * 5 * 3600 * 1000);
    const topic = await prisma.topic.create({
      data: { ...data, community_id: slug ? community.id : null, author_username: author, created_at },
    });
    const others = USERS.map((u) => u.username).filter((u) => u !== post.author);
    const comments = await prisma.comment.createManyAndReturn({
      data: COMMENTS.map((body, k) => ({
        body,
        topic_id: topic.id,
        author_username: others[k % others.length],
        created_at: new Date(created_at.getTime() + (k + 1) * 600 * 1000),
      })),
    });
    await prisma.comment.create({
      data: {
        body: `@${comments[0].author_username} ${REPLY}`,
        topic_id: topic.id,
        parent_id: comments[0].id,
        author_username: post.author,
        created_at: new Date(comments[0].created_at.getTime() + 300 * 1000),
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
