import axios from "axios";

const API_URL = "http://localhost:3000/api/financiero";

export const guardarEstadoFinanciero = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const obtenerEstadosFinancieros = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const actualizarEstadoFinanciero = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const eliminarEstadoFinanciero = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
