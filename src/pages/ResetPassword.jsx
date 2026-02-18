import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../services/authService";

import {
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const enviar = async () => {
    setError("");
    setSuccess("");

    if (password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres");
    }

    if (password !== confirm) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      const response = await resetPassword(token, password);
      setSuccess("Contraseña actualizada correctamente");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar contraseña");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEF4F3",
      }}
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 4,
          boxShadow: "0px 10px 28px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* ===== HEADER ===== */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <LockResetIcon sx={{ color: "#6FA3A8", fontSize: 32 }} />
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: "#6FA3A8" }}
            >
              Restablecer contraseña
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Ingresa tu nueva contraseña para acceder nuevamente a la aplicación.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* ===== FORM ===== */}
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              type="password"
              label="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />

            <TextField
              type="password"
              label="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              fullWidth
            />

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={enviar}
              sx={{
                mt: 1,
                backgroundColor: "#6FA3A8",
                borderRadius: 3,
                py: 1.4,
                fontWeight: 700,
                letterSpacing: 0.5,
                "&:hover": {
                  backgroundColor: "#5C8F94",
                },
              }}
            >
              Cambiar contraseña
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
