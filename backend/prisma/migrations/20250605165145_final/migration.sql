/*
  Warnings:

  - You are about to drop the column `value` on the `Allocation` table. All the data in the column will be lost.
  - Added the required column `quotas` to the `Allocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Allocation` DROP COLUMN `value`,
    ADD COLUMN `quotas` INTEGER NOT NULL;
