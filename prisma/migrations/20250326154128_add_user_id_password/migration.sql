/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_password` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_user_id_key` ON `User`(`user_id`);
