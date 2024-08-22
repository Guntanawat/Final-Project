/*
  Warnings:

  - You are about to drop the column `user_id` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `name` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_employee_id_fkey";

-- DropIndex
DROP INDEX "Employee_phone_number_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "user_id",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
