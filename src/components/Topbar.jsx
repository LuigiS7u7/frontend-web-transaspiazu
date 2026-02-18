import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Logo from "../assets/logotipo.jpg";

export default function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        borderBottom: "3px solid #6FA3A8",
        zIndex: 1100,
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          display: "flex",
          justifyContent: "space-between",
          px: 3,
        }}
      >
        {/* ===== LOGO ===== */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{ cursor: "pointer", minWidth: 0 }}
          onClick={() => navigate("/admin/dashboard")}
        >
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              height: 42,
              width: "auto",
              objectFit: "contain",
            }}
          />

          <Typography
            fontWeight={800}
            color="#2E3A3B"
            noWrap
            letterSpacing={0.5}
          >
            Sistema Administrativo
          </Typography>
        </Box>

        {/* ===== USUARIO ===== */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box textAlign="right">
            <Typography fontWeight={700} color="#2E3A3B" lineHeight={1.2}>
              {user?.nombre}
            </Typography>
            <Typography variant="caption" sx={{ color: "#6B7C7D" }}>
              {user?.rol === "ADMINISTRADOR" ? "Administrador" : "Usuario"}
            </Typography>
          </Box>

          <IconButton onClick={handleOpenMenu}>
            <Avatar
              sx={{
                bgcolor: "#6FA3A8",
                color: "#FFFFFF",
                fontWeight: 700,
              }}
            >
              {user?.nombre?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: 180,
              },
            }}
          >
            <MenuItem disabled sx={{ fontWeight: 600, color: "#2E3A3B" }}>
              {user?.nombre}
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#9C7A00",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#FFF7D6",
                },
              }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
