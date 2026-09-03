import axios from 'axios';

// Vite ke liye import.meta.env use hota hai. (CRA ke liye process.env.REACT_APP_API_URL likhein)
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Ab isko har API call mein likhne ki zaroorat nahi!
});

export default axiosInstance;