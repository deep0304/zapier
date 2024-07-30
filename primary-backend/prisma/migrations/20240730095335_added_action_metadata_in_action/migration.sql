/*
  Warnings:

  - You are about to drop the column `metadata` on the `Action` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "metadata",
ADD COLUMN     "actionMetadata" JSONB NOT NULL DEFAULT '{}';
