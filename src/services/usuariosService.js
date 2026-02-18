import axios from "axios";

const API_URL = "http://localhost:3000/api/usuarios";

// Registrar usuario
export const crearUsuario = (data) => {
     console.log(" Enviando al backend:", data);
  return axios.post(API_URL, data);
};

// Obtener usuarios
export const obtenerUsuarios = (estado) => {
  return axios.get("http://localhost:3000/api/usuarios", {
    params: { estado },
  });
};


// Actualizar usuario
export const actualizarUsuario = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

// Eliminar usuario
export const eliminarUsuario = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
export const activarUsuario = (id) =>
  axios.put(`${API_URL}/activar/${id}`);