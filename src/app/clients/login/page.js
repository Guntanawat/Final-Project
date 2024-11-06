"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
// import Link from "next/link";
const LoginPage = () => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/clients/home");
    }
  });
  //   const router = useRouter();
  const login = async () => {
    try {
      const response = await axios.post("/api/login", { gmail, password });
      const { token } = response.data;

      // Store the token in localStorage or cookies
      localStorage.setItem("token", token);
      router.push("/clients/home");
      // Redirect to a page or update state
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="flex min-w-full min-h-screen max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Left Side - Image */}
      <div className="w-full bg-black h-[40px] fixed items-center justify-center">
        <Link href={"/clients/home"} className="bg-white rounded-md p-[12px]">
          Go to home page
        </Link>
      </div>
      <div className="w-1/2 bg-white flex justify-center items-center p-8">
        {/* เว้นว่างสำหรับใส่รูปภาพ */}
        <Image
          src="/loginlogo.svg"
          alt="Barber Shop Image"
          width={200}
          height={200}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 p-12 bg-[#9F9F9F] flex flex-col justify-center">
        <h2 className="text-4xl font-bold mb-6">Log in</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={gmail}
              onChange={(event) => setGmail(event.target.value)}
              placeholder="Username@gmail.com"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <button
            onClick={() => login()}
            type="button"
            className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            Log in
          </button>
          <p className="text-center text-sm text-gray-700 mt-4">
            New User?{" "}
            <Link
              id="login"
              href={"/clients/sign-up"}
              className="text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
    // </div>
  );
};

export default LoginPage;
