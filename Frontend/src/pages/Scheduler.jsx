import React, { useState, useEffect } from "react";
import {
  BellRing,
  User,
  Plus,
  Clock,
  Trash2,
  Sun,
  Fan,
  Thermometer,
  Droplets,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosInstance } from "../util/http";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ScheduleCard = ({ schedule, onDelete }) => {
  const getIcon = (deviceType) => {
    switch (deviceType) {
      case "light":
        return <Sun className="w-6 h-6" />;
      case "fan":
        return <Fan className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getConditionIcon = (conditionType) => {
    switch (conditionType) {
      case "temperature":
        return <Thermometer className="w-5 h-5 text-red-500" />;
      case "humidity":
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case "light":
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case "time":
        return <Clock className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {getIcon(schedule.device.type)}
          <div>
            <h3 className="text-lg font-semibold">{schedule.device.name}</h3>
            <p className="text-xs text-gray-500">
              Device ID: {schedule.device._id}
            </p>
            <p className="text-sm text-gray-500">
              Turn {schedule.action === true ? "On" : "Off"}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(schedule._id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {getConditionIcon(schedule.conditionType)}
        <span className="text-sm">At {schedule.start_time}</span>
      </div>
    </div>
  );
};

const AddScheduleModal = ({ isOpen, onClose, onAdd, device }) => {
  const [schedule, setSchedule] = useState({
    deviceName: "",
    action: "1",
    timeValue: new Date(),
  });
  console.log(
    "schedule: ",
    schedule,
    schedule.timeValue?.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd({
      deviceId: schedule.deviceName,
      start_time: schedule.timeValue.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      action: schedule.action,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[500px]">
        <h2 className="text-2xl font-bold mb-4">Add New Schedule</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Name
              </label>
              <select
                value={schedule.deviceName}
                onChange={(e) =>
                  setSchedule({ ...schedule, deviceName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Select a device
                </option>
                {device.length > 0 ? (
                  device.map((d, index) => (
                    <option key={index} value={d._id}>
                      {d.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No devices available
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <select
                value={schedule.action}
                onChange={(e) =>
                  setSchedule({ ...schedule, action: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Turn On</option>
                <option value="0">Turn Off</option>
              </select>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition Type
              </label>
              <select
                value={schedule.conditionType}
                onChange={(e) =>
                  setSchedule({ ...schedule, conditionType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="time">Time</option>
                <option value="temperature">Temperature</option>
                <option value="humidity">Humidity</option>
                <option value="light">Light Intensity</option>
              </select>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              {/* <input
                type="time"
                min="01:00"
                max="23:59"
                value={schedule.timeValue}
                onChange={(e) =>
                  setSchedule({ ...schedule, timeValue: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              /> */}
              <DatePicker
                selected={schedule.timeValue}
                onChange={(date) =>
                  setSchedule({ ...schedule, timeValue: date })
                }
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={1}
                timeFormat="HH:mm"
                dateFormat="HH:mm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Scheduler = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [device, setDevice] = useState([]);
  const fetchDevice = async () => {
    return await axiosInstance.get("/devices");
  };

  const fetchScheduler = async () => {
    return await axiosInstance.get("/schedules");
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [deviceData, scheduleData] = await Promise.all([
          fetchDevice(),
          fetchScheduler(),
        ]);

        console.log("Device:", deviceData);
        console.log("Schedule:", scheduleData);

        setDevice(deviceData.data);
        setSchedules(scheduleData.data); // nếu BE trả về { schedules: [...] }
      } catch (err) {
        console.log("Error in fetchAll:", err);
      }
    };

    fetchAll();
  }, []);
  const handleAddSchedule = async (newSchedule) => {
    try {
      const res = await axiosInstance.post("/schedules/", newSchedule);
      console.log("res in handleAddSchedule: ", res);
      toast.success(res.data.message);
      setSchedules((prev) => [...prev, res.data.returnValue]);
    } catch (error) {
      console.log("error in handleAddSchedule: ", error);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const res = await axiosInstance.delete(`/schedules/${scheduleId}`);
      console.log("xóa thành công: ", res);
      setSchedules(schedules.filter((schedule) => schedule._id !== scheduleId));
      toast.success(res.data.message);
    } catch (error) {
      console.log("error in handleDeleteSchedule: ", error);
    }
  };

  return (
    <div className="w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-['Italianno'] text-[70px] text-black">
          Device Scheduler
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((schedule) => (
          <ScheduleCard
            key={schedule._id}
            schedule={schedule}
            onDelete={handleDeleteSchedule}
          />
        ))}
      </div>
      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSchedule}
        device={device}
      />
    </div>
  );
};

export default Scheduler;
