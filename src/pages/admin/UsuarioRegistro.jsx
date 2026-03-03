import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  Divider,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  DialogContent,
} from "@mui/material";
import { useState } from "react";
import { crearUsuario } from "../../services/usuariosService";

import { Person, Email, Phone, Badge, Work, Save } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Grow from "@mui/material/Grow";
import CloseIcon from "@mui/icons-material/Close";

export default function UsuarioRegistro() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    cedula: "",
    rol: "",
  });

  const [modalAlert, setModalAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const mostrarAlerta = (type, title, message) => {
    setModalAlert({
      open: true,
      type,
      title,
      message,
    });
  };

  const cerrarAlerta = () => {
    setModalAlert({ ...modalAlert, open: false });
  };

  const handleSubmit = async () => {
    try {
      await crearUsuario(form);

      mostrarAlerta(
        "success",
        "Usuario registrado",
        "El usuario fue creado correctamente en el sistema.",
      );

      setForm({
        nombre: "",
        email: "",
        telefono: "",
        cedula: "",
        rol: "",
      });
    } catch (error) {
      mostrarAlerta(
        "error",
        "Error al registrar",
        error.response?.data?.message ||
          "No se pudo registrar el usuario. Intente nuevamente.",
      );
    }
  };

  return (
    <div
      className="row justify-content-center mt-5"
      style={{ backgroundColor: "#F4F5F7", minHeight: "100vh" }}
    >
      <div className="col-md-7 col-lg-8">
        <Card
          sx={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 10px 28px rgba(0,0,0,0.08)",
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* ===== TITULO ===== */}
            <Typography
              variant="h5"
              fontWeight={800}
              gutterBottom
              sx={{ color: "#6FA3A8", letterSpacing: 1 }}
            >
              Registrar Usuario
            </Typography>

            <Typography variant="subtitle1" sx={{ mb: 3, color: "#6B7C7D" }}>
              Complete la información del usuario
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {/* ===== FORMULARIO ===== */}
            <Box component="form" className="d-flex flex-column gap-4">
              <TextField
                label="Nombre completo"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#6FA3A8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Correo electrónico"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#6FA3A8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: "#6FA3A8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Cédula"
                name="cedula"
                value={form.cedula}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge sx={{ color: "#9C7A00" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                select
                label="Rol del usuario"
                name="rol"
                value={form.rol}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work sx={{ color: "#6FA3A8" }} />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Conductor">Conductor</MenuItem>
                <MenuItem value="Propetario">Propetario</MenuItem>
              </TextField>

              {/* ===== BOTÓN ===== */}
              <Box textAlign="right" mt={4}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: "#6FA3A8",
                    color: "#FFFFFF",
                    px: 4,
                    py: 1.2,
                    fontSize: "1rem",
                    fontWeight: 700,
                    borderRadius: 3,
                    "&:hover": {
                      backgroundColor: "#5C8F94",
                    },
                  }}
                >
                  Guardar Usuario
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Dialog
          TransitionComponent={Grow}
          transitionDuration={300}
          open={modalAlert.open}
          onClose={cerrarAlerta}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              px: 2,
            },
          }}
        >
          {/* ===== HEADER ===== */}
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 1,
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              {modalAlert.type === "success" ? (
                <CheckCircleIcon sx={{ fontSize: 36, color: "#2E7D32" }} />
              ) : (
                <ErrorIcon sx={{ fontSize: 36, color: "#C62828" }} />
              )}

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  color: modalAlert.type === "success" ? "#2E7D32" : "#C62828",
                }}
              >
                {modalAlert.title}
              </Typography>
            </Box>

            {/*  BOTÓN CERRAR */}
            <IconButton onClick={cerrarAlerta}>
              <CloseIcon sx={{ color: "#C62828", fontSize: 26 }} />
            </IconButton>
          </DialogTitle>

          {/* ===== CONTENIDO ===== */}
          <DialogContent sx={{ textAlign: "center", py: 3 }}>
            <Typography
              variant="body1"
              sx={{
                color: "#555",
                fontSize: "1.05rem",
                lineHeight: 1.6,
              }}
            >
              {modalAlert.message}
            </Typography>
          </DialogContent>

          {/* ===== FOOTER ===== */}
          <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={cerrarAlerta}
              sx={{
                minWidth: 160,
                borderRadius: 3,
                fontWeight: 700,
                backgroundColor:
                  modalAlert.type === "success" ? "#6FA3A8" : "#C85A3A",
                "&:hover": {
                  backgroundColor:
                    modalAlert.type === "success" ? "#5C8F94" : "#A94438",
                },
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
