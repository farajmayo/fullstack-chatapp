import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:8002/api" : "/api", // Replace with your backend API URL
    withCredentials: true, //
})