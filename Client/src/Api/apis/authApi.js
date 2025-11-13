// src/Api/AuthAPIs.js
import api from "../api";


// 🔹 Login user
export const loginUser = async (credentials) => {
  const res = await api.post(`user/login`, credentials);
  return res.data;
};

