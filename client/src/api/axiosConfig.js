import axios from "axios";

// Create an instance of Axios
const api = axios.create({
  baseURL: "http://localhost:4000/api", // Backend API URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default api;
