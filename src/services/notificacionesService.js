import axios from "axios";

const API_URL = "http://localhost:3000/api/notificaciones";

export const crearNotificacion = (data) => {
  return axios.post(API_URL, data);
};

export const obtenerNotificaciones = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
export const obtenerDatosNotificacion = async (conductor_id, tipo) => {
  const res = await axios.get(`${API_URL}/datos`, {
    params: { conductor_id, tipo }
  });
  return res.data;
};




