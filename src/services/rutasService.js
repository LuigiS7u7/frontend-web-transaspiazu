import axios from "axios";

const API_URL = "http://localhost:3000/api/rutas";

export const obtenerRutas = () => {
  return axios.get(API_URL);
};

export const crearRuta = (data) => {
  return axios.post(API_URL, data);
};
export const actualizarRuta = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const eliminarRuta = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};