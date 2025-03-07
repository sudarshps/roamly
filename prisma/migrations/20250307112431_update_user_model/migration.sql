-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image_url" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
