"use client";
import { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
const Customers = () => {
  const [currentPath, setCurrentPath] = useState("home-page");
  const [employees, setEmployees] = useState([]);
  console.log("🚀 ~ Customers ~ employees:", employees);
  const fetchEmployees = async () => {
    const response = await fetch("http://localhost:3000/api/employees");
    if (response.ok) {
      // ตรวจสอบว่าคำขอสำเร็จหรือไม่
      const data = await response.json(); // แปลง response เป็น JSON
      setEmployees(data);
      // return data;
    } else {
      throw new Error("Failed to fetch employees");
    }
  };
  useEffect(() => {
    const getEmployees = async () => {
      try {
        await fetchEmployees();
        // setEmployees(employees);
        // console.log("fetchEmployees: ", employees); // จะแสดงข้อมูล JSON ที่ถูกต้อง
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    getEmployees(); // เรียกใช้งานฟังก์ชันที่เราสร้างเพื่อดึงข้อมูล
  }, []);
  const handleAddCustomer = () => {
    const payload = {
      name: "JoeyBoy",
      position: "Manager",
      phone_number: "1234567899",
      email: "johndoe@example2.com",
      password: "securepassword",
    };
    axios.post("http://localhost:3000/api/employees", payload);
  };
  const deleteEmployee = async (employeeId) => {
    const reponse = await axios.delete(
      `http://localhost:3000/api/employees/${employeeId}`
    );
    console.log("🚀 ~ deleteEmployee ~ reponse:", reponse);
    if (reponse.status === 200) {
      await fetchEmployees();
    } else {
      toast.error("Failed to delete the appointment.");
    }
  };
  return (
    <>
      <Link href="/back-office/employees/addEmployee">
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add Customer
        </button>
      </Link>
      <div className="font-sans overflow-x-auto h-screen w-full mx-[20px] flex items-start justify-center">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 whitespace-nowrap">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-gray-800">
                Name
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-800">
                Email
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-800">
                Role
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-800">
                Joined At
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-800">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="whitespace-nowrap">
            {employees.map((employee) => {
              console.log("🚀 ~ {employees.map ~ employee:", employee);
              return (
                <tr className="hover:bg-gray-50" key={employee.id}>
                  <td className="p-4 text-[15px] text-gray-800">
                    {employee.name}
                  </td>
                  <td className="p-4 text-[15px] text-gray-800">
                    {employee.email}
                  </td>
                  <td className="p-4 text-[15px] text-gray-800">
                    {employee.position}
                  </td>
                  <td className="p-4 text-[15px] text-gray-800">
                    {moment(employee.created_at).format("YYYY-MM-DD")}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/back-office/employees/editEmployee/${employee.id}`}
                    >
                      <button className="mr-4" title="Edit">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 fill-blue-500 hover:fill-blue-700"
                          viewBox="0 0 348.882 348.882"
                        >
                          <path
                            d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                            data-original="#000000"
                          />
                          <path
                            d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                            data-original="#000000"
                          />
                        </svg>
                      </button>
                    </Link>
                    <button
                      className="mr-4"
                      title="Delete"
                      onClick={() => deleteEmployee(employee.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 fill-red-500 hover:fill-red-700"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                          data-original="#000000"
                        />
                        <path
                          d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                          data-original="#000000"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Customers;
