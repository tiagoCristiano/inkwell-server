-- AlterTable
ALTER TABLE "User" ADD COLUMN "email" TEXT;

-- Backfill existing (seeded) users so they can log in by email: <username>@inkwell.dev
UPDATE "User" SET "email" = "username" || '@inkwell.dev';

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
