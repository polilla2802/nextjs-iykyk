/*
  Warnings:

  - You are about to drop the column `documentId` on the `Document` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Document_documentId_key";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "documentId";
