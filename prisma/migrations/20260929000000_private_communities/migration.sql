-- Existing communities stay public; new ones are private by default.
ALTER TABLE "Community" ADD COLUMN "is_private" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Community" ALTER COLUMN "is_private" SET DEFAULT true;

ALTER TABLE "CommunityMember" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'member';

ALTER TABLE "Notification" ADD COLUMN "community_id" TEXT;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
