import axios from "axios";
import { BellRing, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../util/http.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const HomePage = ({
  date = "21 Feb 2023",
  weather = "Sunny",
  temperature = 31,
  humidity = 6,
  lightIntensity = 334,
}) => {
  const [environmentValues, setEnvironmentValues] = useState({
    humid: "",
    temperature: "",
    light: "",
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const result = await axiosInstance.get("/env");
      console.log("result in fetch env data: ", result);
      const { humid, temp, light } = result.data;
      setEnvironmentValues({
        humid: humid.value,
        temperature: temp.value,
        light: light.value,
      });
      const objectEnv = result.data;
      Object.keys(objectEnv).forEach((key) => {
        if (
          objectEnv[key].outOfRange != null &&
          objectEnv[key].outOfRange !== "NO"
        )
          toast.error(objectEnv[key].outOfRange);
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  console.log("bạn đang trong homepage!!!");
  useEffect(() => {
    fetchData();
    const intervalID = setInterval(fetchData, 10000); // Gọi lại mỗi 10 giây

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalID);
  }, []);
  return (
    <div className="w-full">
      {/* Weather Widget */}
      <div className="w-full h-[220px] bg-[#ebf8ff] rounded-lg px-[143px] flex items-center">
        <div className="flex items-center">
          <div className="flex items-center gap-12">
            <div className="w-[154px] h-[81px]">
              <img
                src="https://dashboard.codeparrot.ai/api/image/Z9kVsJIdzXb5OlZt/group.png"
                alt="weather"
                className=" w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-inter text-[10px] font-medium text-black">
                {date}
              </p>
              <p className="font-inter text-[14px] font-semibold text-black mt-4">
                {weather}
              </p>
            </div>
          </div>

          <div className="flex gap-24 items-center ml-32">
            <div className="text-center">
              <div className="flex items-start">
                <span className="font-poppins text-[42px] text-[#c43d3d] font-medium">
                  {environmentValues.temperature}
                </span>
                <div className="w-2 h-2 border-[1.5px] border-[#2c2c2c] rounded-full mt-3 ml-1"></div>
              </div>
              <p className="font-poppins text-xs font-semibold text-[#2c2c2c] mt-2">
                Temperature
              </p>
            </div>

            <div className="text-center">
              <p className="font-poppins text-[36px] text-[#1ea0e9] font-medium">
                {environmentValues.humid}%
              </p>
              <p className="font-poppins text-xs font-semibold text-[#2c2c2c] mt-2">
                Humidity
              </p>
            </div>

            <div className="text-center">
              <p className="font-poppins text-[36px] text-[#ecc94b] font-medium">
                {environmentValues.light} lux
              </p>
              <p className="font-poppins text-xs font-semibold text-[#2c2c2c] mt-2">
                Light Intensity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex items-center mt-7 gap-x-6 pl-10">
        <img
          src="https://dashboard.codeparrot.ai/api/image/Z9kVsJIdzXb5OlZt/image-1.png"
          alt="smart home preview"
          className="w-[652px] h-[366px] rounded-[20px] object-cover"
        />
        <h1 className="font-['Italianno'] text-[70px] text-black leading-[1.2] max-w-[300px]">
          Welcome to BKU's smarthome
        </h1>
      </div>
    </div>
  );
};

export default HomePage;
