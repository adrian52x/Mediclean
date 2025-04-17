-- AlterTable
ALTER TABLE "products" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;
