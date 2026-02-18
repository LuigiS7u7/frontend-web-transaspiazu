import axios from "axios";

const API_URL = "http://localhost:3000/api/auditoria";


export const obtenerAuditoria = async (filtros = {}) => {
  const res = await axios.get("http://localhost:3000/api/auditoria", {
    params: filtros,
  });
  return res.data;
};
export const obtenerUsuariosAuditoria = async () => {
  const res = await axios.get("http://localhost:3000/api/auditoria/usuarios");
  return res.data;
};
