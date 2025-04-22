import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentTime = new Date();
      const startTime = new Date(currentTime.getTime() - 1 * 60 * 1000);

      const formattedStartTime = startTime.toISOString();
      const formattedEndTime = currentTime.toISOString();

      try {
        const result = await axiosInstance.get("/env/range", {
          params: {
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          },
        });

        const { humid, temp, light } = result.data;

        const now = new Date();
        const newLabels = Array(temp.length)
          .fill(0)
          .map((_, i) => {
            const labelTime = new Date(
              now.getTime() - (temp.length - i - 1) * 60000
            );
            return labelTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          });

        setTemperatureHistory(temp);
        setHumidityHistory(humid);
        setLightHistory(light);
        setLabels(newLabels);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1 * 1000);
    return () => clearInterval(interval);
  }, []);

  const chartTemplate = (label, data, borderColor, backgroundColor) => ({
    labels,
    datasets: [
      {
        label,
        data,
        borderColor,
        backgroundColor,
        tension: 0.4,
      },
    ],
  });

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
      <h1 className="font-['Italianno'] text-[70px] text-black mb-8">
        Statistic values
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature */}
        <div className="p-6 rounded-xl bg-[#E8F6F6] shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            🌡️ Temperature
          </h2>
          <Line
            options={options}
            data={chartTemplate(
              "Temperature (°C)",
              temperatureHistory,
              "rgb(255, 159, 64)",
              "rgba(255, 159, 64, 0.5)"
            )}
          />
        </div>

        {/* Humidity */}
        <div className="p-6 rounded-xl bg-[#E8F6F6] shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            💧 Humidity
          </h2>
          <Line
            options={options}
            data={chartTemplate(
              "Humidity (%)",
              humidityHistory,
              "rgb(75, 192, 192)",
              "rgba(75, 192, 192, 0.5)"
            )}
          />
        </div>

        {/* Light Intensity */}
        <div className="p-6 rounded-xl bg-[#E8F6F6] shadow-sm hover:shadow-md transition-shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            💡 Light Intensity
          </h2>
          <Line
            options={options}
            data={chartTemplate(
              "Light (lux)",
              lightHistory,
              "rgb(255, 205, 86)",
              "rgba(255, 205, 86, 0.5)"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
