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
    const response = await fetch("http://localhost:3000/api/users");
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
                Joined At
              </th>
              {/* <th className="p-4 text-left text-xs font-semibold text-gray-800">
                Actions
              </th> */}
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
                    {moment(employee.created_at).format("YYYY-MM-DD")}
                  </td>
                  {/* <td className="p-4">
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
                  </td> */}
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
