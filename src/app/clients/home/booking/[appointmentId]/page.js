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
import dayjs from "dayjs";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  position: z.number().min(1, { message: "Required" }),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
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
  const theme = useTheme();
  const router = useRouter();
  const { appointmentId } = useParams();
  console.log("🚀 ~ AddEmployee ~ appointmentId:", appointmentId);
  const [personName, setPersonName] = useState([]);
  const [listEmployees, setListEmployees] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  console.log("🚀 ~ AddEmployee ~ bookedTimes:", bookedTimes);
  const [selectedTime, setSelectedTime] = useState(null);
  function getUserInfoFromToken() {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  }
  const userInfo = getUserInfoFromToken();
  const fetchEmployeesList = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json(); // แปลง response เป็น JSON
        setListEmployees(data);
        // setPersonName(names);
      } else {
        throw new Error("Failed to fetch employee");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };
  const handleAddCustomer = async (payload) => {
    if (!selectedTime) {
      window.alert("กรุณาเลือกเวลานัดหมายก่อนทำการจอง");
      return;
    }
    try {
      const formattedTime = dayjs(selectedTime).format(
        "YYYY-MM-DDTHH:mm:ss[Z]"
      );
      await axios.put(
        // `http://localhost:3000/api/appointments`,
        `http://localhost:3000/api/appointments/${appointmentId}`,
        { ...payload, user_id: userInfo?.userId, date_time: formattedTime }
      );
      router.push("/clients/home/booking");
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
    watch,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const selectedBarber = watch("position");
  const selectedDate = watch("date_time");
  useEffect(() => {
    fetchEmployees();
    fetchEmployeesList();
  }, []); // เพิ่ม appointmentId ใน dependency เพื่อให้ดึงข้อมูลใหม่เมื่อเปลี่ยน id

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/appointments/${appointmentId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const { appointment } = await response.json(); // แปลง response เป็น JSON
        console.log("🚀 ~ fetchEmployees ~ appointment:", appointment);

        // ใช้ reset เพื่อเซ็ตค่า form ทั้งหมด
        reset({
          name: appointment.name,
          position: appointment.employee_id,
          phone_number: appointment.phone_number,
        });
        // setPersonName(names);
      } else {
        throw new Error("Failed to fetch employee");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
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
  const selectedPositionId = watch("position");
  return (
    <>
      <div className="sticky top-0 w-full shadow-sm h-[60px] flex items-center">
        <div className="p-[20px]">
          <Link
            href={"/clients/home/booking"}
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
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                className="w-full"
                value={selectedPositionId || ""}
                onChange={(event) => {
                  setValue("position", event.target.value);
                }}
                input={<OutlinedInput label="Employee" />}
                MenuProps={MenuProps}
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
          </div>
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
