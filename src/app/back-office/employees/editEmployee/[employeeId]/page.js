"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
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
const names = ["Stylist", "Manager", "Cleaner"];

export default function AddEmployee() {
  const router = useRouter();
  const { employeeId } = useParams();
  const [personName, setPersonName] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    fetchEmployees();
  }, [employeeId]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/employees/${employeeId}`
      );
      if (response.ok) {
        const { employee } = await response.json();

        reset({
          name: employee.name,
          position: employee.position, // Ensure the position is set correctly
          phone_number: employee.phone_number,
          email: employee.email,
        });
      } else {
        throw new Error("Failed to fetch employee");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

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
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Name
              </label>
              <input
                {...register("name")}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Jane"
              />
              {errors.name?.message && (
                <p className="text-red-700">{errors.name?.message}</p>
              )}
            </div>
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Position
              </label>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                className="w-full"
                value={getValues("position") || ""} // Ensure value is updated
                onChange={(event) => {
                  setValue("position", event.target.value);
                }}
                input={<OutlinedInput label="Position" />}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
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
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Phone number
              </label>
              <input
                {...register("phone_number")}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
              />
              {errors.phone_number?.message && (
                <p className="text-red-700">{errors.phone_number?.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Email
              </label>
              <input
                {...register("email")}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="email"
                placeholder="email"
              />
              {errors.email?.message && (
                <p className="text-red-700">{errors.email?.message}</p>
              )}
            </div>
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Password
              </label>
              <input
                {...register("password")}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
