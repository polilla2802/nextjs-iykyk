/*
  Warnings:

  - Added the required column `membershipUrl` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "membershipUrl" STRING(1024) NOT NULL;
