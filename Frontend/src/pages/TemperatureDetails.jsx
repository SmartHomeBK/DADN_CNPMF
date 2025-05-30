import React from "react";
import { BellRing, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
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

const TemperatureDetails = () => {
  const navigate = useNavigate();
  const months = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];

  const temperatureData = {
    labels: months,
    datasets: [
      {
        label: "Device1",
        data: [35, 38, 37, 35, 36, 34],
        borderColor: "#FF9F40",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-bold text-black">Temperature details</h1>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600">16/01/2025 - nay</span>
          </div>
        </div>
      </div>

      {/* Temperature Stats */}
      <div className="bg-[#ebf8ff] rounded-xl p-8 mb-8">
        <div className="flex justify-around items-center">
          <div className="text-center">
            <p className="text-5xl font-bold text-red-500">25°</p>
            <p className="text-sm text-gray-600 mt-2">Lowest</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold text-red-500">31°</p>
            <p className="text-sm text-gray-600 mt-2">Highest</p>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold text-red-500">26.3°</p>
            <p className="text-sm text-gray-600 mt-2">Average</p>
          </div>
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="bg-[#ebf8ff] rounded-xl p-8">
        <div className="w-full h-[300px]">
          <Line options={options} data={temperatureData} />
        </div>
      </div>
    </div>
  );
};

export default TemperatureDetails;
