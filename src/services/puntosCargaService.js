import axios from "axios";

const API_URL = "http://localhost:3000/api/puntos-carga";

export const obtenerPuntosCarga = () => {
  return axios.get(API_URL);
};

export const crearPuntoCarga = (data) => {
  return axios.post(API_URL, data);
};
export const actualizarPuntoCarga = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const eliminarPuntoCarga = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};