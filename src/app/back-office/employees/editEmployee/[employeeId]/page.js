"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  position: z.string().min(1, { message: "Required" }),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const names = ["Stylist", "Manager", "Cleanner"];
function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}
export default function AddEmployee() {
  const theme = useTheme();
  const router = useRouter();
  const { employeeId } = useParams();
  console.log("🚀 ~ AddEmployee ~ employeeId:", employeeId);
  const [personName, setPersonName] = useState([]);

  const handleAddCustomer = async (payload) => {
    try {
      await axios.put(
        `http://localhost:3000/api/employees/${employeeId}`,
        payload
      );
      router.push("/back-office/employees");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset, // ใช้ reset เพื่อรีเซ็ตค่า form ทั้งหมด
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    fetchEmployees();
  }, []); // เพิ่ม employeeId ใน dependency เพื่อให้ดึงข้อมูลใหม่เมื่อเปลี่ยน id

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/employees/${employeeId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const { employee } = await response.json(); // แปลง response เป็น JSON

        // ใช้ reset เพื่อเซ็ตค่า form ทั้งหมด
        reset({
          name: employee.name,
          position: employee.position,
          phone_number: employee.phone_number,
          email: employee.email,
        });
        // setPersonName(names);
      } else {
        throw new Error("Failed to fetch employee");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };
  console.log("getValues ; ", getValues());
  return (
    <>
      <div className="sticky top-0 w-full shadow-sm h-[60px] flex items-center">
        <div className="p-[20px]">
          <Link
            href={"/back-office/employees"}
            className="text-[20px] font-bold cursor-pointer"
          >
            {"<-"}
          </Link>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <form
          className="w-full max-w-lg flex flex-col"
          onSubmit={handleSubmit((d) => handleAddCustomer(d))}
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-first-name"
              >
                Name
              </label>
              <input
                {...register("name")}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Jane"
              />
              {errors.name?.message && (
                <p className="text-red-700">{errors.name?.message}</p>
              )}
            </div>
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-last-name"
              >
                Position
              </label>
              <Select
                // {...register("positin")}
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                className="w-full"
                // multiple
                value={getValues("position")}
                onChange={(event) => {
                  console.log("event : ", event.target.value);
                  setValue("position", event.target.value);
                }}
                input={<OutlinedInput label="Name" />}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, personName, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
              {errors.position?.message && (
                <p className="text-red-700">{errors.position?.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-password"
              >
                Phone number
              </label>
              <input
                {...register("phone_number")}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password"
                type="text"
                // placeholder="******************"
              />
              {errors.phone_number?.message && (
                <p className="text-red-700">{errors.phone_number?.message}</p>
              )}
              {/* <p className="text-gray-600 text-xs italic">
              Make it as long and as crazy as d like
            </p> */}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-city"
              >
                email
              </label>
              <input
                {...register("email")}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-city"
                type="email"
                placeholder="email"
              />
              {errors.email?.message && (
                <p className="text-red-700">{errors.email?.message}</p>
              )}
            </div>
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-city"
              >
                password
              </label>
              <input
                {...register("password")}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-city"
                type="password"
                placeholder="password"
              />
              {errors.password?.message && (
                <p className="text-red-700">{errors.password?.message}</p>
              )}
            </div>
            <div className="w-full h-full justify-end flex mt-4">
              <Button type="submit" variant="outlined">
                Primary
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
