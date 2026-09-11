/*
  Warnings:

  - You are about to alter the column `metodo` on the `Pagamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `status` on the `Pagamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to drop the column `created` on the `Pedido` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bairro` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorFrete` to the `Entrega` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Entrega` ADD COLUMN `bairro` VARCHAR(191) NOT NULL,
    ADD COLUMN `cep` VARCHAR(191) NOT NULL,
    ADD COLUMN `codigoRastreio` VARCHAR(191) NULL,
    ADD COLUMN `complemento` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `estado` VARCHAR(191) NOT NULL,
    ADD COLUMN `numero` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('PENDENTE', 'PREPARANDO', 'ENVIADO', 'EM_TRANSITO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
    ADD COLUMN `transportadora` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `valorFrete` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Pagamento` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `transactionId` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `valor` DECIMAL(65, 30) NOT NULL,
    MODIFY `metodo` ENUM('PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO') NOT NULL,
    MODIFY `status` ENUM('PENDENTE', 'PROCESSANDO', 'APROVADO', 'RECUSADO', 'CANCELADO', 'ESTORNADO') NOT NULL;

-- AlterTable
ALTER TABLE `Pedido` DROP COLUMN `created`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    MODIFY `valor` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `categoriaId` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `sku` VARCHAR(191) NULL,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `price` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `cpf` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NULL,
    `recipientName` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `complement` VARCHAR(191) NULL,
    `neighborhood` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Address_userId_idx`(`userId`),
    INDEX `Address_zipCode_idx`(`zipCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cart_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItem` (
    `id` VARCHAR(191) NOT NULL,
    `cartId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CartItem_productId_idx`(`productId`),
    UNIQUE INDEX `CartItem_cartId_productId_key`(`cartId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Categoria_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemPedido` (
    `id` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `preco` DECIMAL(65, 30) NOT NULL,
    `pedidoId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `unitPrice` DECIMAL(65, 30) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ItemPedido_pedidoId_productId_key`(`pedidoId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Product_sku_key` ON `Product`(`sku`);

-- CreateIndex
CREATE UNIQUE INDEX `User_cpf_key` ON `User`(`cpf`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
