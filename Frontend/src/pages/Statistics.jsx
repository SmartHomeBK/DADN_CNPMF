import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { BellRing, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../util/http.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const navigate = useNavigate();

  const [temperatureHistory, setTemperatureHistory] = useState([28]);
  const [humidityHistory, setHumidityHistory] = useState([50]);
  const [lightHistory, setLightHistory] = useState([1]);

  const [labels, setLabels] = useState(["Start"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get("/env");
        const {
          temp: { value: tempValue },
          humid: { value: humidValue },
          light: { value: lightValue },
        } = result.data;

        const timeLabel = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setTemperatureHistory((prev) => [
          ...prev.slice(-9),
          parseFloat(tempValue),
        ]);
        setHumidityHistory((prev) => [
          ...prev.slice(-9),
          parseFloat(humidValue),
        ]);
        setLightHistory((prev) => [...prev.slice(-9), parseFloat(lightValue)]);
        setLabels((prev) => [...prev.slice(-9), timeLabel]);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const temperatureData = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatureHistory,
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const humidityData = {
    labels,
    datasets: [
      {
        label: "Humidity (%)",
        data: humidityHistory,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const lightData = {
    labels,
    datasets: [
      {
        label: "Light (lux)",
        data: lightHistory,
        borderColor: "rgb(255, 205, 86)",
        backgroundColor: "rgba(255, 205, 86, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-['Italianno'] text-[70px] text-black">
          Statistic values
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#E8F6F6] shadow-sm  hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
            <h2 className="text-xl font-semibold ml-2">Temperature</h2>
          </div>
          <Line options={options} data={temperatureData} />
        </div>

        <div className="p-6 rounded-xl bg-[#E8F6F6] shadow-sm  hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636"
              />
            </svg>
            <h2 className="text-xl font-semibold ml-2">Humidity</h2>
          </div>
          <Line options={options} data={humidityData} />
        </div>

        <div className="p-6 rounded-xl bg-[#FFFBE8] shadow-sm md:col-span-2  hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h2 className="text-xl font-semibold ml-2">Light Intensity</h2>
          </div>
          <Line options={options} data={lightData} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
