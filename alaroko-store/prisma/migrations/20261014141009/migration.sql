/*
  Warnings:

  - You are about to drop the column `preco` on the `ItemPedido` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `ItemPedido` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ItemPedido` DROP COLUMN `preco`,
    DROP COLUMN `quantidade`;
