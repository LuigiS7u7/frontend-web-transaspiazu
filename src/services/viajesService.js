import axios from "axios";

const API_URL = "http://localhost:3000/api/viajes";

export const crearViaje = (data) => {
  return axios.post(API_URL, data);
};

export const obtenerViajes = () => {
  return axios.get(API_URL);
};

export const actualizarViaje = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const eliminarViaje = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};


