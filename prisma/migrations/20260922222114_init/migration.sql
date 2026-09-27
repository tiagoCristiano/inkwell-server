-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('masc', 'feminino', 'outro');

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "display_name" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "gender" "Gender",
    "age" INTEGER,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "avatar_data" BYTEA,
    "avatar_content_type" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "selftext" TEXT NOT NULL DEFAULT '',
    "book_title" TEXT,
    "book_author" TEXT,
    "hashtags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_username" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topic_id" TEXT NOT NULL,
    "author_username" TEXT NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Following" (
    "follower_username" TEXT NOT NULL,
    "followed_username" TEXT NOT NULL,
    "last_active" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Following_pkey" PRIMARY KEY ("follower_username","followed_username")
);

-- CreateIndex
CREATE INDEX "Topic_author_username_idx" ON "Topic"("author_username");

-- CreateIndex
CREATE INDEX "Comment_topic_id_idx" ON "Comment"("topic_id");

-- CreateIndex
CREATE INDEX "Comment_author_username_idx" ON "Comment"("author_username");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_author_username_fkey" FOREIGN KEY ("author_username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_author_username_fkey" FOREIGN KEY ("author_username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_follower_username_fkey" FOREIGN KEY ("follower_username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followed_username_fkey" FOREIGN KEY ("followed_username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
