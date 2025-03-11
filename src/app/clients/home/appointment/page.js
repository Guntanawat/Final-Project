"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  position: z.number().min(1, { message: "Required" }),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  email: z.string().email({ message: "Invalid email" }),
  date_time: z.any().nullable(),
});

const TimeSlots = ({
  selectedDate,
  onSelectTime,
  bookedTimes,
  selectedTime,
}) => {
  const startTime = dayjs(selectedDate).set("hour", 9).set("minute", 0);
  const endTime = dayjs(selectedDate).set("hour", 20).set("minute", 30);
  const timeSlots = [];
  let currentTime = startTime;

  while (currentTime.isBefore(endTime)) {
    timeSlots.push(currentTime);
    currentTime = currentTime.add(30, "minute");
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {timeSlots.map((time, index) => {
        const formattedTime = time.format("HH:mm");
        const isBooked = bookedTimes?.includes(formattedTime);
        const isActive = selectedTime?.format("HH:mm") === formattedTime;

        return (
          <button
            key={index}
            className={`w-full py-2 rounded-md border transition-all ${
              isBooked
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isActive
                ? "bg-blue-600 text-white border-blue-600" // ✅ Active state
                : "bg-white text-gray-900 border-gray-300 hover:bg-blue-500 hover:text-white"
            }`}
            onClick={() => !isBooked && onSelectTime(time)}
            disabled={isBooked}
          >
            {formattedTime}
          </button>
        );
      })}
    </div>
  );
};

export default function AddEmployee() {
  const router = useRouter();
  const [listEmployees, setListEmployees] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  console.log("🚀 ~ AddEmployee ~ bookedTimes:", bookedTimes);
  const [selectedTime, setSelectedTime] = useState(null);
  console.log("🚀 ~ AddEmployee ~ selectedTime:", selectedTime);

  function getUserInfoFromToken() {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  }

  const userInfo = getUserInfoFromToken();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: userInfo?.email || "",
    },
  });

  const selectedBarber = watch("position");
  const selectedDate = watch("date_time");

  const fetchEmployeesList = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees`);
      if (response.ok) {
        const data = await response.json();
        setListEmployees(data);
      } else {
        throw new Error("Failed to fetch employee");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  useEffect(() => {
    fetchEmployeesList();
  }, []);

  const handleAddCustomer = async (payload) => {
    if (!selectedTime) {
      window.alert("กรุณาเลือกเวลานัดหมายก่อนทำการจอง");
      return;
    }

    try {
      const formattedTime = dayjs(selectedTime).format(
        "YYYY-MM-DDTHH:mm:ss[Z]"
      );

      await axios.post(`http://localhost:3000/api/appointments`, {
        ...payload,
        user_id: userInfo?.userId,
        date_time: formattedTime, // ✅ ใส่เวลานัดหมายเข้าไปใน payload
      });

      router.push("/clients/home");
    } catch (error) {
      window.alert("เวลานี้มีคนจองแล้วครับ");
      console.error("Error adding customer:", error);
    }
  };

  const fetchBookedTimes = async (barberId, date) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/appointments/booked?barberId=${barberId}&date=${date}`
      );
      console.log("🚀 ~ fetchBookedTimes ~ response:", response);

      if (response.status === 200) {
        const bookedData = response.data.map((appointment) =>
          moment(appointment.appointment_time).utc().format("HH:mm")
        );

        console.log("🚀 ~ fetchBookedTimes ~ bookedData:", bookedData);
        setBookedTimes(bookedData);
      }
    } catch (error) {
      console.error("Error fetching booked times:", error);
      setBookedTimes([]);
    }
  };

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      fetchBookedTimes(selectedBarber, selectedDate);
    }
  }, [selectedBarber, selectedDate]);
  return (
    <>
      <div className="sticky top-0 w-full shadow-sm h-[60px] flex items-center">
        <div className="p-[20px]">
          <Link
            href="/clients/home"
            className="text-[20px] font-bold cursor-pointer"
          >
            {"<-"}
          </Link>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <form
          className="w-full max-w-lg flex flex-col"
          onSubmit={handleSubmit(handleAddCustomer)}
        >
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-bold">Name</label>
            <input
              {...register("name")}
              className="w-full border rounded px-3 py-2"
              type="text"
              placeholder="Enter your name"
            />
            {errors.name?.message && (
              <p className="text-red-700">{errors.name?.message}</p>
            )}
          </div>

          {/* Barber Select */}
          <div>
            <label className="block text-gray-700 font-bold">
              เลือกช่าง Barber
            </label>
            <Select
              className="w-full"
              value={getValues("position")}
              onChange={(event) => setValue("position", event.target.value)}
            >
              {listEmployees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
            {errors.position?.message && (
              <p className="text-red-700">{errors.position?.message}</p>
            )}
          </div>

          {/* ถ้าเลือก Barber แล้ว ถึงจะเลือกวันได้ */}
          {selectedBarber && (
            <>
              <div>
                <label className="text-gray-700 font-bold">เลือกวัน</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  min={new Date().toISOString().split("T")[0]} // ป้องกันการเลือกวันก่อนหน้า
                  {...register("date_time")}
                />
              </div>

              {/* ถ้าเลือกวันแล้วถึงจะแสดง Time Slots */}
              {selectedDate && (
                <>
                  <label className="text-gray-700 font-bold">เลือกเวลา</label>
                  <TimeSlots
                    selectedDate={selectedDate}
                    onSelectTime={setSelectedTime}
                    bookedTimes={bookedTimes}
                    selectedTime={selectedTime}
                  />
                  <p className="text-center text-lg font-semibold mt-2">
                    เลือกเวลา:{" "}
                    {selectedTime ? selectedTime.format("HH:mm") : "-"}
                  </p>
                </>
              )}
            </>
          )}

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-bold">
              Phone number
            </label>
            <input
              {...register("phone_number")}
              className="w-full border rounded px-3 py-2"
              type="text"
              placeholder="Enter phone number"
            />
            {errors.phone_number?.message && (
              <p className="text-red-700">{errors.phone_number?.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-bold">Email</label>
            <input
              {...register("email")}
              className="w-full border rounded px-3 py-2"
              type="email"
              placeholder="Enter email"
              disabled={!!userInfo}
            />
            {errors.email?.message && (
              <p className="text-red-700">{errors.email?.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <Button type="submit" variant="outlined">
              จองคิว
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
