-- CreateTable
CREATE TABLE "BookCover" (
    "book_title" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "content_type" TEXT NOT NULL DEFAULT 'image/jpeg',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookCover_pkey" PRIMARY KEY ("book_title")
);
