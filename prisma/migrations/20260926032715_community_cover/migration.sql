-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "cover_content_type" TEXT,
ADD COLUMN     "cover_data" BYTEA,
ADD COLUMN     "cover_updated_at" TIMESTAMP(3);
