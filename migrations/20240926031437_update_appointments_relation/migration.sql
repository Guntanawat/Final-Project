/*
  Warnings:

  - You are about to drop the column `role` on the `Employees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointments" DROP CONSTRAINT "Appointments_employee_id_fkey";

-- AlterTable
ALTER TABLE "Employees" DROP COLUMN "role";

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
