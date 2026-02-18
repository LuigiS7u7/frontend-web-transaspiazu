import { Routes, Route } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Container,
  Grid,
  Paper,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";


import UsuarioRegistro from "./UsuarioRegistro";
import UsuarioConsulta from "./UsuarioConsulta";
import ViajeRegistro from "./ViajeRegistro";
import ViajeConsulta from "./ViajeConsulta";
import FinancieroRegistro from "./FinancieroRegistro";
import FinancieroConsulta from "./FinancieroConsulta";
import NotificacionesConfig from "./NotificacionesConfig";
import Auditoria from "./Auditoria";
import UsuariosLogin from "./usuariosLogin";
import BitacorasConsulta from "./BitacorasConsulta";
import CatalogosConsulta from "./CatalogosConsulta";

/* ================= CONFIG ================= */
const SIDEBAR_WIDTH = 250;

/* ================= ESTILOS MEJORADOS ================= */
const cardStyle = (color) => ({
  width: 380,
  maxWidth: "100%",
  height: "100%",
  borderRadius: 5,
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(224, 224, 224, 0.6)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
  },
  overflow: "hidden",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "6px",
    backgroundColor: color,
  },
});

const iconBoxStyle = (color) => ({
  width: 50,
  height: 50,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: `${color}15`, 
  color: color,
});

export default function Dashboard() {
  /* ================= DATA ================= */
  const usuariosData = [
    { name: "Activos", value: 97 },
    { name: "Inactivos", value: 31 },
  ];

  const viajesData = [
    { name: "Realizados", value: 342 },
    { name: "En curso", value: 12 },
  ];

  const finanzasData = [
    { name: "Ingresos", value: 18450 },
    { name: "Gastos", value: 9720 },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F4F5F7" }}>
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          pl: `${SIDEBAR_WIDTH}px`,
          
        }}
      >
        <Topbar />

        <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
          <Container maxWidth={false} sx={{ width: "100%", py: 6 }}>
            <Routes>
              <Route
                index
                element={
                  <>
                    <Box sx={{ mb: 5 }}>
                      <Typography variant="h4" fontWeight={900} color="#1A2027" sx={{ letterSpacing: "-0.5px" }}>
                        Resumen General
                      </Typography>
                      <Typography variant="body1" color="#707E94">
                        Panel de control y métricas operativas
                      </Typography>
                    </Box>

                    <Grid container spacing={4} justifyContent="center">
                      {/* ===== CARD USUARIOS ===== */}
                      <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                        <Card sx={cardStyle("#6FA3A8")}>
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box>
                                <Typography variant="overline" fontWeight={700} color="#707E94">
                                  GESTIÓN DE PERSONAL
                                </Typography>
                                <Typography variant="h6" fontWeight={800} color="#2E3A3B" sx={{ mt: -0.5 }}>
                                  Usuarios
                                </Typography>
                              </Box>
                              <Box sx={iconBoxStyle("#6FA3A8")}>
                                <PeopleIcon fontSize="medium" />
                              </Box>
                            </Stack>

                            <Box sx={{ mt: 3, mb: 1 }}>
                              <Typography variant="h3" fontWeight={900} color="#1A2027">
                                128
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <TrendingUpIcon sx={{ fontSize: 16, color: "#16A34A" }} />
                                <Typography variant="caption" fontWeight={700} color="#16A34A">
                                  +12% este mes
                                </Typography>
                              </Stack>
                            </Box>

                            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={usuariosData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#707E94" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#707E94" }} />
                                <Tooltip cursor={{ fill: "#F8F9FB" }} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                                <Bar dataKey="value" fill="#6FA3A8" radius={[4, 4, 0, 0]} barSize={40} />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* ===== CARD VIAJES ===== */}
                      <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                        <Card sx={cardStyle("#2E7D6F")}>
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box>
                                <Typography variant="overline" fontWeight={700} color="#707E94">
                                  LOGÍSTICA
                                </Typography>
                                <Typography variant="h6" fontWeight={800} color="#2E3A3B" sx={{ mt: -0.5 }}>
                                  Viajes
                                </Typography>
                              </Box>
                              <Box sx={iconBoxStyle("#2E7D6F")}>
                                <LocalShippingIcon fontSize="medium" />
                              </Box>
                            </Stack>

                            <Box sx={{ mt: 3, mb: 1 }}>
                              <Typography variant="h3" fontWeight={900} color="#1A2027">
                                354
                              </Typography>
                              <Typography variant="caption" fontWeight={600} color="#707E94">
                                Flota activa actual
                              </Typography>
                            </Box>

                            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={viajesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#707E94" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#707E94" }} />
                                <Tooltip cursor={{ fill: "#F8F9FB" }} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                                <Bar dataKey="value" fill="#2E7D6F" radius={[4, 4, 0, 0]} barSize={40} />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* ===== CARD FINANZAS ===== */}
                      <Grid item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                        <Card sx={cardStyle("#9C7A00")}>
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box>
                                <Typography variant="overline" fontWeight={700} color="#707E94">
                                  CONTABILIDAD
                                </Typography>
                                <Typography variant="h6" fontWeight={800} color="#2E3A3B" sx={{ mt: -0.5 }}>
                                  Finanzas
                                </Typography>
                              </Box>
                              <Box sx={iconBoxStyle("#9C7A00")}>
                                <MonetizationOnIcon fontSize="medium" />
                              </Box>
                            </Stack>

                            <Box sx={{ mt: 3, mb: 1 }}>
                              <Typography variant="h4" fontWeight={900} color="#1A2027">
                                $ 18,450.00
                              </Typography>
                              <Typography variant="caption" fontWeight={600} color="#707E94">
                                Balance total ingresos
                              </Typography>
                            </Box>

                            <Divider sx={{ my: 3, borderStyle: "dashed" }} />

                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={finanzasData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#707E94" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#707E94" }} />
                                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#9C7A00"
                                  strokeWidth={4}
                                  dot={{ r: 6, fill: "#9C7A00", strokeWidth: 2, stroke: "#fff" }}
                                  activeDot={{ r: 8 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </>
                }
              />

              {/* Las rutas se mantienen exactamente igual */}
              <Route path="usuarios/registro" element={<UsuarioRegistro />} />
              <Route path="usuarios/consulta" element={<UsuarioConsulta />} />
              <Route path="viajes/registro" element={<ViajeRegistro />} />
              <Route path="viajes/consulta" element={<ViajeConsulta />} />
              <Route path="finanzas/registro" element={<FinancieroRegistro />} />
              <Route path="finanzas/consulta" element={<FinancieroConsulta />} />
              <Route path="notificaciones/configuracion" element={<NotificacionesConfig />} />
              <Route path="notificaciones/auditoria" element={<Auditoria />} />
              <Route path="usuarios/login" element={<UsuariosLogin />} />
              <Route path="bitacoras/consulta" element={<BitacorasConsulta />} />
              <Route path="catalogos/consulta" element={<CatalogosConsulta />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}