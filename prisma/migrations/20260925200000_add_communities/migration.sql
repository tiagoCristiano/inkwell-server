-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_username" TEXT NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN "community_id" TEXT;

-- CreateIndex
CREATE INDEX "Topic_community_id_idx" ON "Topic"("community_id");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_owner_username_fkey" FOREIGN KEY ("owner_username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
