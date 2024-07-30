-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_documentId_fkey";

-- AlterTable
ALTER TABLE "Membership" ALTER COLUMN "documentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
