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
import { useRouter } from "next/navigation";
const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export default function AddEmployee() {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const router = useRouter();

  const handleAddCustomer = async (payload) => {
    console.log("🚀 ~ handleAddCustomer ~ payload:", payload);
    // const payload = {
    //   name: "JoeyBoy",
    //   position: "Manager",
    //   phone_number: "1234567899",
    //   email: "johndoe@example2.com",
    //   password: "securepassword",
    // };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/sign-up",
        payload
      );
      router.push("http://localhost:3000/clients/login");
    } catch (error) {
      console.log("🚀 ~ handleAddCustomer ~ error:", error);
      alert("เมลนี้มีแล้ว");
    }
    // router.push("/back-office/employees");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });
  console.log("getValues ; ", getValues());
  return (
    <>
      <div className="sticky top-0 w-full shadow-sm h-[60px] flex items-center">
        <div className="p-[20px]">
          <Link
            href={"/clients/login"}
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
