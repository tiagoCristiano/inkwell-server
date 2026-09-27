-- CreateTable
CREATE TABLE "CommunityMember" (
    "community_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityMember_pkey" PRIMARY KEY ("community_id","username")
);

-- CreateIndex
CREATE INDEX "CommunityMember_username_idx" ON "CommunityMember"("username");

-- AddForeignKey
ALTER TABLE "CommunityMember" ADD CONSTRAINT "CommunityMember_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMember" ADD CONSTRAINT "CommunityMember_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- Existing communities: their owners are members.
INSERT INTO "CommunityMember" ("community_id", "username")
SELECT "id", "owner_username" FROM "Community";
