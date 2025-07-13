-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductAssignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "ProductAssignment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductAssignment_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductAssignment" ("id", "productId", "quantity", "sellerId") SELECT "id", "productId", "quantity", "sellerId" FROM "ProductAssignment";
DROP TABLE "ProductAssignment";
ALTER TABLE "new_ProductAssignment" RENAME TO "ProductAssignment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
