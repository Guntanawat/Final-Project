"use client";
import "../globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { jwtDecode } from "jwt-decode";

export default function RootLayout({ children }) {
  const currentPath = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ ใช้ state เพื่อรอให้ localStorage โหลดเสร็จ

  useEffect(() => {
    const token = localStorage.getItem("employeeToken");

    if (!token) {
      router.push("/back-office/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("employeeToken");
      router.push("/back-office/login");
    } finally {
      setIsLoading(false); // ✅ บอกว่าโหลดเสร็จแล้ว
    }
  }, [router]);

  // ✅ ถ้ายังโหลด localStorage ไม่เสร็จ ให้แสดง Loading (กัน Redirect ก่อนโหลดเสร็จ)
  // if (isLoading) return <div>Loading...</div>;

  return (
    <html lang="en">
      <body>
        <div className="flex flex-row w-full">
          <nav
            className={`${
              currentPath === "/back-office/login" ? "hidden" : ""
            } flex flex-col bg-white gap-y-[4px] shadow-lg h-screen top-0 left-0 min-w-[240px] max-w-[320px] py-6 px-4 font-[sans-serif] overflow-auto flex-1`}
          >
            <div className="flex-1">
              <ul>
                <li>
                  <div className="flex gap-x-[20px] text-center items-center justify-center">
                    <Avatar /> {user?.name || ""}
                  </div>
                </li>
              </ul>
              <ul>
                <li>
                  <Link
                    href={"/back-office/home-page"}
                    className={`text-black  ${
                      currentPath === "/back-office/home-page"
                        ? "!text-blue-600 bg-blue-50"
                        : "hover:text-blue-600 hover:bg-blue-50"
                    } text-[15px] block  rounded px-4 py-2.5 transition-all`}
                  >
                    Home Page
                  </Link>
                </li>
              </ul>
              {user?.position === "admin" && (
                <ul>
                  <li>
                    <Link
                      href={"/back-office/users"}
                      className={`text-black  ${
                        currentPath === "/back-office/users"
                          ? "!text-blue-600 bg-blue-50"
                          : "hover:text-blue-600 hover:bg-blue-50"
                      } text-[15px] block  rounded px-4 py-2.5 transition-all`}
                    >
                      Users
                    </Link>
                  </li>
                </ul>
              )}
              {user?.position === "admin" && (
                <ul className="flex-1">
                  <li>
                    <Link
                      href={"/back-office/employees"}
                      className={`text-black  ${
                        currentPath === "/back-office/employees"
                          ? "!text-blue-600 bg-blue-50"
                          : "hover:text-blue-600 hover:bg-blue-50"
                      } text-[15px] block  rounded px-4 py-2.5 transition-all`}
                    >
                      Employees
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <ul>
              <li>
                <div
                  onClick={() => {
                    localStorage.clear();
                    router.push("/back-office/login");
                  }}
                  className={`text-black w-full cursor-pointer ${"hover:text-blue-600 hover:bg-blue-50"} text-[15px] block rounded px-4 py-2.5 transition-all`}
                >
                  Logout
                </div>
              </li>
            </ul>
          </nav>
          <div className="w-full">
            <div className="pl-[20px]">
              <h1 className="font-bold">
                {currentPath
                  .split("/")
                  [currentPath.split("/").length - 1].toLocaleUpperCase()}
              </h1>
            </div>
            {children}
          </div>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
