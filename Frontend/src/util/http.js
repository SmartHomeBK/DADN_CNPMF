import axios from "axios";
const token = localStorage.getItem("UserToken");

console.log(
  "token in http: ",
  import.meta.env.VITE_BASE_URL,
  token,
  "https://smart-home-iot-backend.onrender.com/api"
);
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  timeout: 30000,
  headers: {
    authorization: `Bearer ${token}`,
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("UserToken");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
