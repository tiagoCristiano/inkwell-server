-- AlterTable
ALTER TABLE "Following" ADD COLUMN     "followed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "quoted_id" TEXT,
ALTER COLUMN "title" SET DEFAULT '';

-- CreateTable
CREATE TABLE "TopicLike" (
    "topic_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopicLike_pkey" PRIMARY KEY ("topic_id","username")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "comment_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("comment_id","username")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipient_username" TEXT NOT NULL,
    "actor_username" TEXT NOT NULL,
    "topic_id" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingEntry" (
    "username" TEXT NOT NULL,
    "book_title" TEXT NOT NULL,
    "book_author" TEXT NOT NULL DEFAULT '',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'reading',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingEntry_pkey" PRIMARY KEY ("username","book_title")
);

-- CreateIndex
CREATE INDEX "Notification_recipient_username_created_at_idx" ON "Notification"("recipient_username", "created_at");

-- CreateIndex
CREATE INDEX "ReadingEntry_book_title_idx" ON "ReadingEntry"("book_title");

-- CreateIndex
CREATE INDEX "Following_followed_username_idx" ON "Following"("followed_username");

-- CreateIndex
CREATE INDEX "Topic_book_title_idx" ON "Topic"("book_title");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_quoted_id_fkey" FOREIGN KEY ("quoted_id") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicLike" ADD CONSTRAINT "TopicLike_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicLike" ADD CONSTRAINT "TopicLike_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipient_username_fkey" FOREIGN KEY ("recipient_username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actor_username_fkey" FOREIGN KEY ("actor_username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingEntry" ADD CONSTRAINT "ReadingEntry_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
