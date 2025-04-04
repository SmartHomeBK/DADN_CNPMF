import axios from "axios";
const token = JSON.parse(localStorage.getItem("accessToken"));
export const http = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 30000,
  headers: {
    authorization: `Bearer ${token}`,
  },
});
