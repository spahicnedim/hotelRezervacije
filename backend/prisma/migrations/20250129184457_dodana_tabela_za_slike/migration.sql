-- CreateTable
CREATE TABLE "room_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "room_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "room_images" ADD CONSTRAINT "room_images_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
