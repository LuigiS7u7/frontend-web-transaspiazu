import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  useMediaQuery,
} from "@mui/material";

import { Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

import { loginRequest } from "../../services/authService";
import LogoPng from "../../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await loginRequest({
        usuario,
        password,
        tipo: "WEB",
      });

      console.log(" RESPUESTA LOGIN:", res.data);

      localStorage.setItem("user", JSON.stringify(res.data));

      console.log(" NAVEGANDO...");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(" ERROR FRONT:", err);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#EEF4F3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 1000,
          height: { xs: "auto", md: 520 },
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* PANEL IZQUIERDO */}
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "45%",
              height: "100%",
            }}
          >
            {/* SVG CURVA */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 520"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 H320 C260,120 260,400 320,520 H0 Z"
                fill="#6FA3A8 "
              />
            </svg>

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#F7FAFA",
              }}
            >
              <Typography
                sx={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  letterSpacing: 4,
                  fontWeight: 600,
                  opacity: 0.85,
                }}
              >
                Welcome
              </Typography>

              {/* LOGO */}
              <Box
                component="img"
                src={LogoPng}
                alt="Logo"
                sx={{
                  height: 230,
                  width: "auto",
                  mb: 2,
                  objectFit: "contain",

               
                  filter:
                    "drop-shadow(0px 6px 14px rgba(0,0,0,0.25)) contrast(1.05)",
                  opacity: 0.95,
                }}
              />

              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                TRANSASPIAZU S.A. <br></br>
                Compañia de transporte de carga pesada.
              </Typography>
            </Box>
          </Box>
        )}

        {/* FORMULARIO */}
        <Box
          sx={{
            ml: { xs: 0, md: "45%" },
            width: { xs: "100%", md: "55%" },
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 4, md: 6 },
          }}
        >
          <Box width="100%" maxWidth={320} textAlign="center">
            <Typography
              variant="h5"
              fontWeight={700}
              mb={4}
              color="#6FA3A8"
              letterSpacing={2}
            >
              LOGIN
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Username"
              variant="standard"
              fullWidth
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Person sx={{ color: "#6FA3A8" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              variant="standard"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 4 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              sx={{
                py: 1.4,
                borderRadius: 20,
                backgroundColor: "#FFD54f",
                color: "#2E3A3B",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#D8B85F",
                },
              }}
            >
              {loading ? "Validando..." : "Login"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
