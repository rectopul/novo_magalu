-- CreateTable
CREATE TABLE "LinkPayment" (
    "id" TEXT NOT NULL,
    "productsId" TEXT NOT NULL,
    "link" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkPayment_id_key" ON "LinkPayment"("id");

-- AddForeignKey
ALTER TABLE "LinkPayment" ADD CONSTRAINT "LinkPayment_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
