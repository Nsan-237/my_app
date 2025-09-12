import { API_URL } from "@/constant";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json' // Assuming getAuthToken is an async function
    },
});

export default axiosInstance;