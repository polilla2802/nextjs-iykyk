/*
  Warnings:

  - Changed the type of `memberId` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "memberId";
ALTER TABLE "user" ADD COLUMN     "memberId" INT8 NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_memberId_key" ON "user"("memberId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
