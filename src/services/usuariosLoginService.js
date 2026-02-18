import axios from "axios";

const API_URL = "http://localhost:3000/api/auth-usuarios";

/* ==============================
   OBTENER TODOS LOS USUARIOS LOGIN
============================== */
export const obtenerUsuariosLogin = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

/* ==============================
   CREAR USUARIO LOGIN
============================== */
export const crearUsuarioLogin = async (data) => {
  /*
    data = {
      usuario,
      password,
      rol,
      usuario_id,
      estado
    }
  */
  const res = await axios.post(API_URL, data);
  return res.data;
};

/* ==============================
   ACTUALIZAR USUARIO LOGIN
============================== */
export const actualizarUsuarioLogin = async (id, data) => {
  /*
    data = {
      usuario,
      rol,
      estado
    }
  */
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

/* ==============================
   ELIMINAR USUARIO LOGIN
============================== */
export const eliminarUsuarioLogin = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
