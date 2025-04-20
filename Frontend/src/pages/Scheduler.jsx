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
import { axiosInstance } from "../util/http";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
          {getIcon(schedule.deviceType)}
          <div>
            <h3 className="text-lg font-semibold">{schedule.deviceName}</h3>
            <p className="text-xs text-gray-500">
              Device ID: {schedule.deviceId}
            </p>
            <p className="text-sm text-gray-500">Turn {schedule.action}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(schedule.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {getConditionIcon(schedule.conditionType)}
        <span className="text-sm">
          {schedule.conditionType === "time"
            ? `At ${schedule.timeValue}`
            : `When ${schedule.conditionType} ${schedule.operator} ${
                schedule.value
              }${
                schedule.conditionType === "temperature"
                  ? "°C"
                  : schedule.conditionType === "humidity"
                  ? "%"
                  : schedule.conditionType === "light"
                  ? " lux"
                  : ""
              }`}
        </span>
      </div>
    </div>
  );
};

const AddScheduleModal = ({ isOpen, onClose, onAdd }) => {
  const [deviceNames, setDeviceNames] = useState([]);
  const [schedule, setSchedule] = useState({
    deviceName: "",
    deviceType: "light",
    action: "on",
    conditionType: "time",
    operator: ">=",
    value: "",
    timeValue: "12:00",
  });

  useEffect(() => {
    if (isOpen) {
      const fetchDeviceNames = async () => {
        try {
          const res = await axiosInstance.get("/devices");
          const allDevices = res.data;

          const uniqueNames = [...new Set(allDevices.map((d) => d.name))];
          setDeviceNames(uniqueNames);
        } catch (err) {
          console.error("Lỗi khi lấy tên thiết bị:", err);
          toast.error("Có lỗi khi lấy danh sách thiết bị!");
        }
      };

      fetchDeviceNames();
    }
  }, [isOpen]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const deviceId = `${schedule.deviceType}_${Date.now()}`;
    const scheduleId = `schedule_${Date.now()}`;
    onAdd({
      ...schedule,
      id: scheduleId,
      deviceId: deviceId,
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
                {deviceNames.length > 0 ? (
                  deviceNames.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
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
                <option value="on">Turn On</option>
                <option value="off">Turn Off</option>
              </select>
            </div>

            <div>
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
            </div>

            {schedule.conditionType === "time" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={schedule.timeValue}
                  onChange={(e) =>
                    setSchedule({ ...schedule, timeValue: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operator
                  </label>
                  <select
                    value={schedule.operator}
                    onChange={(e) =>
                      setSchedule({ ...schedule, operator: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value=">=">Greater than or equal to</option>
                    <option value="<=">Less than or equal to</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value
                  </label>
                  <input
                    type="number"
                    value={schedule.value}
                    onChange={(e) =>
                      setSchedule({ ...schedule, value: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${schedule.conditionType} value`}
                    required
                  />
                </div>
              </>
            )}
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

  const handleAddSchedule = (newSchedule) => {
    setSchedules([...schedules, newSchedule]);
  };

  const handleDeleteSchedule = (scheduleId) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
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
            key={schedule.id}
            schedule={schedule}
            onDelete={handleDeleteSchedule}
          />
        ))}
      </div>
      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSchedule}
      />
    </div>
  );
};

export default Scheduler;
