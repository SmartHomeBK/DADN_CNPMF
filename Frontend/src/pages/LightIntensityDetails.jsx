import React from 'react';
import { BellRing, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LightIntensityDetails = () => {
  const navigate = useNavigate();
  const months = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];

  const lightData = {
    labels: months,
    datasets: [
      {
        label: 'Device1',
        data: [400, 600, 550, 500, 450, 400],
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Device2',
        data: [350, 550, 500, 450, 400, 350],
        borderColor: 'rgb(201, 203, 207)',
        backgroundColor: 'rgba(201, 203, 207, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 800,
        ticks: {
          stepSize: 200,
        },
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="w-full h-[104px] bg-[#d09696] flex justify-between items-center px-8">
        <div className="w-[158px] h-[158px] relative top-[2.5rem]">
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z9kVsJIdzXb5OlZt/mask-gro.png"
            alt="Smart Home Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-6">
          <button className="w-10 h-10 hover:opacity-80 transition-opacity">
            <BellRing className="w-8 h-8" />
          </button>
          <button className="w-10 h-10 hover:opacity-80 transition-opacity bg-slate-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="left-0 top-[10px] w-[227px] h-[calc(100vh-104px)] bg-[#d09696]">
          <div className="px-5 pt-[100px]">
            <button 
              onClick={() => navigate('/')}
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors"
            >
              <span className="font-inter text-base text-[#21255a]">
                Home
              </span>
            </button>
            <button
              onClick={() => navigate('/statistics')}
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors mt-4"
            >
              <span className="font-inter text-base text-[#21255a]">
                Statistic values
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-bold text-black">Light Intensity details</h1>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-600">16/01/2025 - nay</span>
              </div>
            </div>
          </div>

          {/* Light Intensity Stats */}
          <div className="bg-[#FFFBE8] rounded-xl p-8 mb-8">
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-5xl font-bold text-yellow-500">350</p>
                <p className="text-sm text-gray-600 mt-2">Lowest</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-yellow-500">600</p>
                <p className="text-sm text-gray-600 mt-2">Highest</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-yellow-500">475</p>
                <p className="text-sm text-gray-600 mt-2">Average</p>
              </div>
            </div>
          </div>

          {/* Light Intensity Chart */}
          <div className="bg-[#FFFBE8] rounded-xl p-8">
            <div className="w-full h-[300px]">
              <Line options={options} data={lightData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightIntensityDetails; 