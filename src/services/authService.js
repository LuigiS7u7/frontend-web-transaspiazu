import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const loginRequest = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

/* ==============================
   OBTENER TODOS LOS USUARIOS LOGIN
============================== */
export const obtenerUsuariosLogin = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
export const resetPassword = (token, password) => {
  return axios.post(`${API_URL}/reset-password/${token}`, { password });
};

