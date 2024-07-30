/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documentId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentId` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_membershipId_fkey";

-- DropIndex
DROP INDEX "user_email_key";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "membershipId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "documentId" INT8 NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "dateOfBirth";
ALTER TABLE "user" DROP COLUMN "email";
ALTER TABLE "user" DROP COLUMN "gender";
ALTER TABLE "user" DROP COLUMN "phoneNumber";
ALTER TABLE "user" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;
ALTER TABLE "user" ALTER COLUMN "firebaseUid" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Membership_documentId_key" ON "Membership"("documentId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
