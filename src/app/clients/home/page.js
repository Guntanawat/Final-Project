"use client";
import React from "react";
import Image from "next/image";
import logo from "./logo.svg";
import mainlogo from "./mainlogo.svg";
import { usePathname } from "next/navigation";
const BarberShopPage = () => {
  const router = usePathname();
  console.log("router : ", router);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}

          {/* <Logo /> */}
          <div className="flex items-center">
            {/* Placeholder for Logo Image */}
            <Image
              src={logo}
              alt="Black Crab Logo"
              className="h-10"
              width={64}
              height={54}
            />
            {/* <Logo /> */}
          </div>
          {/* Navigation */}
          <nav className="space-x-8 text-sm">
            <a
              href="#"
              className={`text-gray-800 hover:text-black ${
                router === "/clients/home" ? "text-[#7C4236]" : ""
              }`}
            >
              Home
            </a>
            <a href="#" className="text-gray-800 hover:text-black">
              Reserve
            </a>
            <a href="#" className="text-gray-800 hover:text-black">
              History
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Banner Section */}
        <section
          className="relative h-64 flex justify-center items-center mb-8 bg-cover bg-center bg-[url('/background.svg')]"
          //   style={{ backgroundImage: background }}
        >
          {/* Placeholder for Center Logo */}
          <Image
            src={mainlogo}
            width={720}
            height={620}
            alt="Center Logo"
            className="h-[240px]"
          />
        </section>

        {/* Barber Profiles Section */}
        <section className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-4">Barber</h2>
          <div className="flex justify-center space-x-6">
            {/* Barber 1 */}
            <div className="flex flex-col items-center">
              <Image
                src="/customer1.svg"
                alt="Barber 1"
                width={80}
                height={80}
                className="w-32 h-32 rounded-md mb-2"
              />
              <span>ช่างบอย</span>
            </div>
            {/* Barber 2 */}
            <div className="flex flex-col items-center">
              <Image
                src="/customer2.svg"
                alt="Barber 2"
                width={80}
                height={80}
                className="w-32 h-32 rounded-md mb-2"
              />
              <span>ช่างหญิง</span>
            </div>
            {/* Barber 3 */}
            <div className="flex flex-col items-center">
              <Image
                src="/customer3.svg"
                alt="Barber 3"
                width={80}
                height={80}
                className="w-32 h-32 rounded-md mb-2"
              />
              <span>ช่างเก่ง</span>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-4">Barber Schedule</h2>
          {/* Calendar Placeholder */}
          <div className="bg-gray-200 p-4 rounded-md">
            {/* Add Calendar Component */}
            {/* <Calendar bordered renderCell={renderCell} /> */}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4">
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-2">SUPPORT</h3>
            <ul className="space-y-1">
              <li>Reserve</li>
              <li>History</li>
            </ul>
          </div>
          {/* Subscribe */}
          <div>
            <h3 className="text-lg font-semibold mb-2">SUBSCRIBE</h3>
            <ul className="space-y-1">
              <li>Facebook: Blackcrab_Barber</li>
              <li>Instagram: Blackcrab_Barber</li>
              <li>Tiktok: Blackcrab_Barber</li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-2">CONTACT</h3>
            <p>Tel(TH): 092-653-7181</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BarberShopPage;
