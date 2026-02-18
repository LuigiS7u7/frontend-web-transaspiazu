import axios from "axios";

const API_URL = "http://localhost:3000/api/usuarios";

export const obtenerConductores = () => {
  return axios.get(`${API_URL}?rol=CONDUCTOR`);
  
};
