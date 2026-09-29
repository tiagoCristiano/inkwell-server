-- New users start with a private profile.
ALTER TABLE "User" ALTER COLUMN "is_public" SET DEFAULT false;
