/*
  Warnings:

  - You are about to drop the column `tutorProfileId` on the `booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_studentId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_tutorId_fkey";

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "tutorProfileId";

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
