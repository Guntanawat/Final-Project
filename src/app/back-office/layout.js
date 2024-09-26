"use client";
import "../globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function RootLayout({ children }) {
  const currentPath = usePathname();
  return (
    <html lang="en">
      <body>
        <div className="flex flex-row w-full">
          <nav
            className={`${
              currentPath === "/back-office/login" ? "hidden" : ""
            } flex flex-col bg-white gap-y-[4px] shadow-lg h-screen top-0 left-0 min-w-[240px] max-w-[320px] py-6 px-4 font-[sans-serif] overflow-auto flex-1`}
          >
            <ul>
              <li>
                <Link
                  href={"home-page"}
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
            <ul>
              <li>
                <Link
                  href={"customers"}
                  className={`text-black  ${
                    currentPath === "/back-office/customers"
                      ? "!text-blue-600 bg-blue-50"
                      : "hover:text-blue-600 hover:bg-blue-50"
                  } text-[15px] block  rounded px-4 py-2.5 transition-all`}
                >
                  Customers
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link
                  href={"employees"}
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
      </body>
    </html>
  );
}
