import { Link, useLocation } from "react-router-dom";
import { Box, Typography, Divider } from "@mui/material";

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  const linkStyle = (path) => ({
    color: location.pathname.includes(path) ? "#9C7A00" : "#2E3A3B",
    backgroundColor: location.pathname.includes(path)
      ? "#FFF7D6"
      : "transparent",
    textDecoration: "none",
    display: "block",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: 600,
    marginTop: 6,
    transition: "all 0.25s ease",
  });

  return (
    <Box
      className="sidebar"
      sx={{
        width: 260,
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E0E0E0",
        p: 3,
      }}
    >
      {/* ===== TITULO ===== */}
      <Typography
        variant="h6"
        align="center"
        fontWeight={800}
        sx={{ color: "#6FA3A8", mb: 2, letterSpacing: 1 }}
      >
        Panel Admin
      </Typography>

      <Divider sx={{ mb: 1 }} />

      {/* ===== USUARIOS ===== */}
      <Typography variant="caption" sx={{ color: "#6B7C7D", fontWeight: 700 }}>
        USUARIOS
      </Typography>

      <Link
        to="/admin/dashboard/usuarios/registro"
        style={linkStyle("usuarios/registro")}
      >
        Registrar
      </Link>

      <Link
        to="/admin/dashboard/usuarios/consulta"
        style={linkStyle("usuarios/consulta")}
      >
        Consultar
      </Link>

      <Link
        to="/admin/dashboard/usuarios/login"
        style={linkStyle("usuarios/login")}
      >
        Usuarios de Acceso
      </Link>

      <Divider sx={{ my: 1 }} />

      {/* ===== VIAJES ===== */}
      <Typography variant="caption" sx={{ color: "#6B7C7D", fontWeight: 700 }}>
        VIAJES
      </Typography>

      <Link
        to="/admin/dashboard/viajes/registro"
        style={linkStyle("viajes/registro")}
      >
        Registrar
      </Link>

      <Link
        to="/admin/dashboard/viajes/consulta"
        style={linkStyle("viajes/consulta")}
      >
        Consultar
      </Link>

      <Link
        to="/admin/dashboard/catalogos/consulta"
        style={linkStyle("catalogos/consulta")}
      >
        Parámetros
      </Link>

      <Divider sx={{ my: 1 }} />

      {/* ===== FINANZAS ===== */}
      <Typography variant="caption" sx={{ color: "#6B7C7D", fontWeight: 700 }}>
        FINANZAS
      </Typography>

      <Link
        to="/admin/dashboard/finanzas/registro"
        style={linkStyle("finanzas/registro")}
      >
        Registrar
      </Link>

      <Link
        to="/admin/dashboard/finanzas/consulta"
        style={linkStyle("finanzas/consulta")}
      >
        Consultar
      </Link>

      <Divider sx={{ my: 1 }} />

      {/* ===== BITÁCORAS ===== */}
      <Typography variant="caption" sx={{ color: "#6B7C7D", fontWeight: 700 }}>
        BITÁCORAS
      </Typography>

      <Link
        to="/admin/dashboard/bitacoras/consulta"
        style={linkStyle("bitacoras/consulta")}
      >
        Consultar
      </Link>

      <Divider sx={{ my: 1 }} />

      {/* ===== NOTIFICACIONES ===== */}
      <Typography variant="caption" sx={{ color: "#6B7C7D", fontWeight: 700 }}>
        NOTIFICACIONES
      </Typography>

      <Link
        to="/admin/dashboard/notificaciones/configuracion"
        style={linkStyle("notificaciones/configuracion")}
      >
        Configuración
      </Link>

      <Link
        to="/admin/dashboard/notificaciones/auditoria"
        style={linkStyle("notificaciones/auditoria")}
      >
        Auditoría
      </Link>
    </Box>
  );
}
