-- CreateTable
CREATE TABLE "Document" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "documentId" INT8 NOT NULL,
    "documentUrl" STRING(1024) NOT NULL,
    "membershipId" INT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_documentId_key" ON "Document"("documentId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
