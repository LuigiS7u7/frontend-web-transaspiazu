import axios from "axios";

const API_URL = "http://localhost:3000/api/clientes";

export const obtenerClientes = () => {
  return axios.get(API_URL);
};

export const crearCliente = (data) => {
  return axios.post(API_URL, data);
};
export const actualizarCliente = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const eliminarCliente = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};