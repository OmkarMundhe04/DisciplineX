import axios from "axios";

const API = axios.create({
  baseURL: "https://disciplinex-1.onrender.com"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});

export default API;
