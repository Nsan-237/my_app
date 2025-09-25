import { API_URL } from "@/constant";
import { getAuthToken } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request safely
axiosInstance.interceptors.request.use(
  (config) => {
    // WARNING: This will not work if token is not already in memory!
    getAuthToken().then((token) => {
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    });
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;