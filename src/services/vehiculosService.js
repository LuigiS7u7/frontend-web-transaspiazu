import axios from "axios";

const API_URL = "http://localhost:3000/api/vehiculos";

export const obtenerVehiculos = () => {
  return axios.get(API_URL);
};

export const crearVehiculo = (data) => {
  return axios.post(API_URL, data);
};
export const actualizarVehiculo = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const eliminarVehiculo = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};