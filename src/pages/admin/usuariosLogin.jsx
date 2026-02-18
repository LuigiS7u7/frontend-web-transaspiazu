import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Chip,
  Stack,
  InputAdornment,
  Grow,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import WorkIcon from "@mui/icons-material/Work";
import BadgeIcon from "@mui/icons-material/Badge";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { createFilterOptions } from "@mui/material/Autocomplete";

// SERVICIOS
import {
  obtenerUsuariosLogin,
  crearUsuarioLogin,
  actualizarUsuarioLogin,
  eliminarUsuarioLogin,
} from "../../services/usuariosLoginService";
import { obtenerUsuarios } from "../../services/usuariosService";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const filter = createFilterOptions();

// ================= HELPERS =================
const generarPassword = (length = 10) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const all = upper + lower + numbers + symbols;

  let password =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  return password.split("").sort(() => 0.5 - Math.random()).join("");
};

const evaluarPassword = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Muy débil", color: "#C62828", value: 25 };
  if (score === 3) return { label: "Débil", color: "#EF6C00", value: 45 };
  if (score === 4) return { label: "Media", color: "#F9A825", value: 70 };
  return { label: "Fuerte", color: "#2E7D32", value: 100 };
};

export default function UsuariosLogin() {
  /* ================= ESTADOS ================= */
  const [usuariosLogin, setUsuariosLogin] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState({ open: false, id: null });
  const [modalAlert, setModalAlert] = useState({ open: false, type: "success", title: "", message: "" });

  const [pagina, setPagina] = useState(1);
const [filasPorPagina, setFilasPorPagina] = useState(8);

  const [form, setForm] = useState({
    usuario: "",
    password: "",
    rol: "",
    usuario_id: null,
    estado: "ACTIVO",
  });
  const [conductorSel, setConductorSel] = useState(null);
  const [cedulaSeleccionada, setCedulaSeleccionada] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);

  /* ================= CARGAR DATA ================= */
  const cargarTodo = useCallback(async () => {
    try {
      const resLogin = await obtenerUsuariosLogin();
      const resUsuarios = await obtenerUsuarios();
      
     
      setUsuariosLogin(resLogin.data || resLogin || []);
      setUsuarios(resUsuarios.data || resUsuarios || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }, []);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  /* ================= ALERTAS ================= */
  const mostrarAlerta = (type, title, message) => {
    setModalAlert({ open: true, type, title, message });
  };
  const cerrarAlerta = () => setModalAlert({ ...modalAlert, open: false });

  /* ================= GUARDAR NUEVO ================= */
  const guardar = async () => {
    try {
      if (!form.usuario || !form.password || !form.usuario_id) {
        mostrarAlerta("error", "Campos incompletos", "Por favor, llene todos los campos.");
        return;
      }
      if (form.password !== confirmPassword) {
        mostrarAlerta("error", "Contraseñas incorrectas", "Las contraseñas no coinciden.");
        return;
      }

      await crearUsuarioLogin(form);
      mostrarAlerta("success", "Éxito", "Usuario de acceso creado correctamente.");
      
      // Limpiar Formulario
      setForm({ usuario: "", password: "", rol: "", usuario_id: null, estado: "ACTIVO" });
      setConductorSel(null);
      setCedulaSeleccionada("");
      setConfirmPassword("");
      setPasswordStrength(null);
      cargarTodo(); 
    } catch (error) {
      mostrarAlerta("error", "Error", error.response?.data?.message || "No se pudo crear el acceso.");
    }
  };

  
  const abrirModal = (u) => {
    setUsuarioEdit({ ...u }); 
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioEdit(null);
  };

  const guardarEdicion = async () => {
    try {
      
      await actualizarUsuarioLogin(usuarioEdit.id, { 
        estado: usuarioEdit.estado,
        rol: usuarioEdit.rol 
      });
      
      await cargarTodo(); 
      cerrarModal();
      mostrarAlerta("success", "Actualizado", "El registro se actualizó correctamente.");
    } catch (error) {
      console.error(error);
      mostrarAlerta("error", "Error", "No se pudo actualizar el usuario.");
    }
  };

  /* ================= ELIMINACIÓN ================= */
  const solicitarEliminar = (id) => setConfirmarEliminar({ open: true, id });

  const ejecutarEliminacion = async () => {
    try {
      await eliminarUsuarioLogin(confirmarEliminar.id);
      setConfirmarEliminar({ open: false, id: null });
      mostrarAlerta("success", "Eliminado", "Acceso eliminado con éxito.");
      cargarTodo();
    } catch (error) {
      setConfirmarEliminar({ open: false, id: null });
      mostrarAlerta("error", "Error", "Error al intentar eliminar.");
    }
  };

  /* ================= FILTRO ================= */
  const filtrados = usuariosLogin.filter((u) =>
    u.usuario.toLowerCase().includes(filtro.toLowerCase())
  );
const totalPaginas = Math.ceil(
  filtrados.length / filasPorPagina
);

const usuariosPaginados = filtrados.slice(
  (pagina - 1) * filasPorPagina,
  pagina * filasPorPagina
);

const desde =
  filtrados.length === 0
    ? 0
    : (pagina - 1) * filasPorPagina + 1;

const hasta = Math.min(
  pagina * filasPorPagina,
  filtrados.length
);

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, backgroundColor: "#F4F5F7", minHeight: "100vh" }}>
      <Card sx={{ borderRadius: 4, boxShadow: "0px 10px 28px rgba(0,0,0,0.08)", maxWidth: "1200px", margin: "0 auto" }}>
        <CardContent>
          <Typography variant="h5" fontWeight={800} sx={{ color: "#6FA3A8", mb: 0.5 }}>
            Usuarios de Login
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7C7D", mb: 3 }}>
            Gestión centralizada de credenciales y roles
          </Typography>
          
          <Divider sx={{ mb: 4 }} />


          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#6FA3A8", mb: 3 }}>
              Registrar nuevo acceso
            </Typography>
            
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 3 }}>
              <Autocomplete
                options={usuarios}
                value={conductorSel}
                getOptionLabel={(o) => `${o.cedula} - ${o.nombre}`}
                filterOptions={(options, state) => { const filtered = filter(options, state); if (!state.inputValue) { return filtered.slice(0, 2); } return filtered; }}
                onChange={(e, v) => {
                  setConductorSel(v);
                  setCedulaSeleccionada(v?.cedula || "");
                  setForm({
                    ...form,
                    usuario: v?.cedula || "",
                    usuario_id: v?.id || null,
                    rol: v?.rol?.toUpperCase() === "CONDUCTOR" ? "CONDUCTOR" : "ADMINISTRADOR",
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Seleccionar Persona" placeholder="Cédula o Nombre" />
                )}
              />

              <TextField label="Cédula (Usuario)" value={cedulaSeleccionada} disabled />

              <TextField 
                label="Rol Asignado" 
                value={form.rol} 
                disabled 
                InputProps={{ startAdornment: <WorkIcon sx={{ color: "#6FA3A8", mr: 1 }} /> }}
              />

              <TextField 
                label="Contraseña" 
                type="password" 
                value={form.password} 
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setPasswordStrength(evaluarPassword(e.target.value));
                }}
                InputProps={{
                  endAdornment: (
                    <Button size="small" onClick={() => {
                      const p = generarPassword();
                      setForm({...form, password: p}); setConfirmPassword(p); setPasswordStrength(evaluarPassword(p));
                    }}>Generar</Button>
                  )
                }}
              />

              <TextField 
                label="Confirmar Contraseña" 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<SaveIcon />} 
                  onClick={guardar} 
                  sx={{ bgcolor: "#6FA3A8", height: "56px", fontWeight: 700 }}
                >
                  Guardar Acceso
                </Button>
              </Box>
            </Box>

            {passwordStrength && (
              <Box sx={{ mt: 1, maxWidth: "300px" }}>
                <Box sx={{ height: 4, bgcolor: "#EEE", borderRadius: 2, overflow: "hidden" }}>
                  <Box sx={{ width: `${passwordStrength.value}%`, height: "100%", bgcolor: passwordStrength.color }} />
                </Box>
                <Typography variant="caption" sx={{ color: passwordStrength.color, fontWeight: 700 }}>Seguridad: {passwordStrength.label}</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 4 }} />


          <Box>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#6FA3A8" }}>
                Accesos Registrados
              </Typography>
              <TextField 
                size="small" 
                placeholder="Buscar por usuario..." 
                onChange={(e) => setFiltro(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon sx={{ color: "#6FA3A8", mr: 1 }} /> }}
                sx={{ width: { xs: "100%", sm: "300px" }, "& .MuiOutlinedInput-root": { borderRadius: 10 } }}
              />
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E8F3F1", borderRadius: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: "#F1F7F8" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Usuario (Cédula)</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Rol</TableCell>
                   
                    <TableCell sx={{ fontWeight: 800 }}>Estado</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtrados.length > 0 ? usuariosPaginados.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.usuario}</TableCell>
                      <TableCell><Chip label={u.rol} size="small" sx={{ fontWeight: 600 }} /></TableCell>
             
                      <TableCell>
                        <Chip 
                          label={u.estado} 
                          size="small" 
                          color={u.estado === "ACTIVO" ? "success" : "error"} 
                          variant="contained" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar Estado">
                          <IconButton onClick={() => abrirModal(u)} sx={{ color: "#6FA3A8" }}><EditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar Acceso">
                          <IconButton onClick={() => solicitarEliminar(u.id)} sx={{ color: "#C85A3A" }}><DeleteIcon /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: "gray" }}>No se encontraron registros.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 3,
    flexWrap: "wrap",
    gap: 2,
  }}
>
  {/* INFO */}
  <Typography sx={{ color: "#707E94", fontWeight: 500 }}>
    Mostrando <b>{desde}</b>–<b>{hasta}</b> de{" "}
    <b>{filtrados.length}</b> accesos
  </Typography>

  {/* CONTROLES */}
  <Stack direction="row" spacing={2} alignItems="center">
    <FormControl size="small">
      <Select
        value={filasPorPagina}
        onChange={(e) => {
          setFilasPorPagina(e.target.value);
          setPagina(1);
        }}
        sx={{
          borderRadius: 2,
          minWidth: 90,
          "& fieldset": { borderColor: "#E0E0E0" },
        }}
      >
        {[5, 8, 10, 20].map((n) => (
          <MenuItem key={n} value={n}>
            {n} / pág
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Pagination
      count={totalPaginas}
      page={pagina}
      onChange={(e, value) => setPagina(value)}
      shape="rounded"
      size="large"
      sx={{
        "& .MuiPaginationItem-root": {
          fontWeight: 600,
          borderRadius: 2,
        },
        "& .Mui-selected": {
          backgroundColor: "#6FA3A8 !important",
          color: "#fff",
          boxShadow: "0 3px 10px rgba(111,163,168,0.35)",
        },
      }}
    />
  </Stack>
</Box>

            </TableContainer>
          </Box>
        </CardContent>
      </Card>

      {/* MODAL EDITAR */}
      <Dialog open={mostrarModal} onClose={cerrarModal} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800, color: "#6FA3A8" }}>Modificar Acceso</DialogTitle>
        <DialogContent>
          {usuarioEdit && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField label="Usuario" value={usuarioEdit.usuario} disabled fullWidth />
              <TextField 
                select 
                label="Estado del Acceso" 
                value={usuarioEdit.estado} 
                onChange={(e) => setUsuarioEdit({ ...usuarioEdit, estado: e.target.value })} 
                fullWidth
              >
                <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                <MenuItem value="INACTIVO">INACTIVO</MenuItem>
              </TextField>
              <TextField 
                select 
                label="Rol" 
                value={usuarioEdit.rol} 
                onChange={(e) => setUsuarioEdit({ ...usuarioEdit, rol: e.target.value })} 
                fullWidth
              >
                <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
                <MenuItem value="CONDUCTOR">CONDUCTOR</MenuItem>
              </TextField>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={cerrarModal} color="inherit">Cancelar</Button>
          <Button onClick={guardarEdicion} variant="contained" sx={{ bgcolor: "#6FA3A8" }}>Guardar Cambios</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL CONFIRMACIÓN ELIMINAR */}
      <Dialog open={confirmarEliminar.open} onClose={() => setConfirmarEliminar({ open: false, id: null })}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ErrorIcon color="error" /> ¿Eliminar acceso definitivamente?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">Esta acción borrará las credenciales de este usuario. No podrá volver a entrar al sistema a menos que se cree un nuevo registro.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmarEliminar({ open: false, id: null })}>Cancelar</Button>
          <Button onClick={ejecutarEliminacion} variant="contained" sx={{ bgcolor: "#C85A3A" }}>Sí, Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* ALERTAS */}
      <Dialog open={modalAlert.open} onClose={cerrarAlerta} TransitionComponent={Grow}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {modalAlert.type === "success" ? <CheckCircleIcon sx={{ color: "#2E7D32" }} /> : <ErrorIcon sx={{ color: "#C62828" }} />}
          <Typography variant="h6" fontWeight={800}>{modalAlert.title}</Typography>
        </DialogTitle>
        <DialogContent><Typography>{modalAlert.message}</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={cerrarAlerta} variant="contained" fullWidth sx={{ bgcolor: modalAlert.type === "success" ? "#6FA3A8" : "#C85A3A" }}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}