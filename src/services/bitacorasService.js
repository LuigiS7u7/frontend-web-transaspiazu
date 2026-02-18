import axios from "axios";

const API_URL = "http://localhost:3000/api/bitacoras";

export const obtenerBitacoras = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const actualizarBitacora = async (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const eliminarBitacora = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
