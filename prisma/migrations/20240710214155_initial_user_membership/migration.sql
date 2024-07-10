-- CreateTable
CREATE TABLE "user" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "memberId" STRING(255) NOT NULL,
    "firebaseUid" STRING(255) NOT NULL,
    "name" STRING(255) NOT NULL,
    "email" STRING(255) NOT NULL,
    "phoneNumber" STRING(20),
    "gender" STRING(50),
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "type" STRING(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_memberId_key" ON "user"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "user_firebaseUid_key" ON "user"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_type_key" ON "Membership"("type");
