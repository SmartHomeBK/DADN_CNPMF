import React from 'react';
import { Line } from 'react-chartjs-2';
import { BellRing, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
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

const Statistics = () => {
  const navigate = useNavigate();
  const months = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
  
  const temperatureData = {
    labels: months,
    datasets: [
      {
        label: 'Device1',
        data: [35, 38, 37, 35, 36, 34],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const humidityData = {
    labels: months,
    datasets: [
      {
        label: 'Device1',
        data: [60, 85, 75, 70, 65, 55],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Device2',
        data: [50, 75, 65, 60, 55, 45],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.4,
      },
    ],
  };

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
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors mt-4"
            >
              <span className="font-inter text-base text-[#21255a]">
                Statistic values
              </span>
            </button>
            <button
              onClick={() => navigate('/control-devices')}
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors mt-4"
            >
              <span className="font-inter text-base text-[#21255a]">
                Control Devices
              </span>
            </button>
            <button
              onClick={() => navigate('/scheduler')}
              className="w-[187px] h-[65px] bg-[#f5e7d4] rounded-2xl hover:bg-[#e5d7c4] transition-colors mt-4"
            >
              <span className="font-inter text-base text-[#21255a]">
                Scheduler
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-['Italianno'] text-[70px] text-black">Statistic values</h1>
            <div className="text-gray-600">
              <span className="inline-block">
                <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                16/01/2025 - nay
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="p-6 rounded-xl bg-[#E8F6F6] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/temperature-details')}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
                <h2 className="text-xl font-semibold ml-2">Temperature</h2>
              </div>
              <Line options={options} data={temperatureData} />
            </div>

            <div 
              className="p-6 rounded-xl bg-[#E8F6F6] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/humidity-details')}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
                </svg>
                <h2 className="text-xl font-semibold ml-2">Humidity</h2>
              </div>
              <Line options={options} data={humidityData} />
            </div>

            <div 
              className="p-6 rounded-xl bg-[#FFFBE8] shadow-sm md:col-span-2 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/light-intensity-details')}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-xl font-semibold ml-2">Light Intensity</h2>
              </div>
              <Line options={options} data={lightData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 