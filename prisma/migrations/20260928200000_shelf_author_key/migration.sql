ALTER TABLE "ReadingEntry" DROP CONSTRAINT "ReadingEntry_pkey",
ADD CONSTRAINT "ReadingEntry_pkey" PRIMARY KEY ("username", "book_title", "book_author");
