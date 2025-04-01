import axios from "axios";
const token = JSON.parse(localStorage.getItem("UserToken"));
console.log("token in http: ", token);
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  timeout: 30000,
  headers: {
    authorization: `Bearer ${token}`,
  },
});
