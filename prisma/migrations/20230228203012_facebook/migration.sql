-- CreateTable
CREATE TABLE "facebooks" (
    "id" TEXT NOT NULL,
    "facebook_user" TEXT NOT NULL,
    "facebook_password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "productsId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "facebooks_id_key" ON "facebooks"("id");

-- AddForeignKey
ALTER TABLE "facebooks" ADD CONSTRAINT "facebooks_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
