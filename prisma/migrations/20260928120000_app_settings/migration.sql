CREATE TABLE "AppSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "quotas_enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);
