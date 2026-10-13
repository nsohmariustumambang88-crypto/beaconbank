/*
  Warnings:

  - Added the required column `accountNumberEnc` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Withdrawal" ADD COLUMN     "accountNumberEnc" TEXT NOT NULL;
