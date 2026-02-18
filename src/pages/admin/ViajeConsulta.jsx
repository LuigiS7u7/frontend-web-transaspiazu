import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
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
  TextField,
  Button,
  Box,
  MenuItem,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import { eliminarViaje } from "../../services/viajesService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ErrorIcon from "@mui/icons-material/Error";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";




const estadoColor = (estado) => {
  switch (estado) {
    case "ASIGNADO":
      return { bg: "#FFE5D9", color: "#C85A3A" };
    case "EN CURSO":
      return { bg: "#E0F2F1", color: "#2E7D6F" };
    case "FINALIZADO":
      return { bg: "#E8F5E9", color: "#1B5E20" };
    case "CANCELADO":
      return { bg: "#FDECEA", color: "#B71C1C" };
    default:
      return { bg: "#EEE", color: "#555" };
  }
};

const API_URL = "http://localhost:3000/api/viajes";

export default function ViajeConsulta() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [viajeEdit, setViajeEdit] = useState(null);
  const [busquedaCedula, setBusquedaCedula] = useState("");
  const [viajes, setViajes] = useState([]);
  const [filtro, setFiltro] = useState("");


const [confirmarEliminar, setConfirmarEliminar] = useState({
  open: false,
  id: null,
});

const [pagina, setPagina] = useState(1);
const [filasPorPagina, setFilasPorPagina] = useState(8);


const solicitarEliminar = (id) => {
  setConfirmarEliminar({ open: true, id });
};


const ejecutarEliminacion = async () => {
  try {
    await eliminarViaje(confirmarEliminar.id);
    cargarViajes();
    setConfirmarEliminar({ open: false, id: null });
  } catch (error) {
    console.error("ERROR DELETE:", error.response?.data || error.message);
    alert(
      error.response?.data?.message ||
      "Error al eliminar el viaje (ver consola)"
    );
  }
};




  /* ================= CARGAR VIAJES ================= */
  useEffect(() => {
    cargarViajes();
  }, []);

  const cargarViajes = async () => {
    const res = await axios.get(API_URL);
    setViajes(res.data);
  };

  /* ================= BUSCAR ================= */
  const buscar = () => setFiltro(busquedaCedula);

  /* ================= MODAL ================= */
  const abrirModal = (viaje) => {
    setViajeEdit({ ...viaje });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setViajeEdit(null);
  };

  const handleChange = (e) => {
    setViajeEdit({ ...viajeEdit, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    await axios.put(`${API_URL}/${viajeEdit.id}`, {
      fecha: viajeEdit.fecha,
      estado: viajeEdit.estado,
      precio: viajeEdit.precio,
      hora: viajeEdit.hora,
    });
    cargarViajes();
    cerrarModal();
  };


  /* ================= FILTRO ================= */
  const viajesFiltrados = viajes.filter((v) =>
    filtro ? v.cedula_conductor?.includes(filtro) : true,
  );
const totalPaginas = Math.ceil(
  viajesFiltrados.length / filasPorPagina
);

const viajesPaginados = viajesFiltrados.slice(
  (pagina - 1) * filasPorPagina,
  pagina * filasPorPagina
);

const desde = viajesFiltrados.length === 0
  ? 0
  : (pagina - 1) * filasPorPagina + 1;

const hasta = Math.min(
  pagina * filasPorPagina,
  viajesFiltrados.length
);


  return (
    <div
      className="row justify-content-center mt-5"
      style={{ backgroundColor: "#F4F5F7", minHeight: "100vh" }}
    >
      <div className="col-md-12 col-lg-11">
        <Card
          sx={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 10px 28px rgba(0,0,0,0.08)",
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: "#6FA3A8", letterSpacing: 1 }}
            >
              Consulta de Viajes
            </Typography>
            <Divider sx={{ my: 3 }} />

            {/* BUSCADOR */}
            <Stack
              direction="row"
              spacing={2}
              mb={4}
              alignItems="center"
              justifyContent="flex-end"
            >
              <TextField
                label="Buscar por cédula"
                value={busquedaCedula}
                onChange={(e) => setBusquedaCedula(e.target.value)}
                size="small"
                sx={{
                  width: 380,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                  },
                }}
              />

              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={buscar}
                sx={{
                  backgroundColor: "#6FA3A8",
                  px: 3,
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundColor: "#5C8F94",
                  },
                }}
              >
                Buscar
              </Button>
            </Stack>

            {/* TABLA */}
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#E8F3F1" }}>
                    {[
                      "Cédula",
                      "Conductor",
                      "Placa",
                      "Punto de carga",
                      "Ruta",
                      "Cliente",
                      "Teléfono",
                      "Fecha",
                      "Hora",
                      "Estado",
                      "Precio",
                      "Acciones",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{ fontWeight: 800, color: "#2E3A3B" }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {viajesPaginados.map((v) => {
                    const c = estadoColor(v.estado);
                    return (
                      <TableRow key={v.id}
                           sx={{
        "& .MuiTableCell-root": {
          fontSize: "1rem",
          fontWeight: 500,
        },
      }}>
                        <TableCell>{v.cedula_conductor}</TableCell>
                        <TableCell>{v.conductor}</TableCell>
                        <TableCell>{v.placa}</TableCell>
                        <TableCell>{v.punto_carga}</TableCell>
                        <TableCell>{v.ruta}</TableCell>
                        <TableCell>{v.cliente}</TableCell>
                        <TableCell>{v.telefono_cliente}</TableCell>
                        <TableCell>{v.fecha}</TableCell>
                        <TableCell>{v.hora}</TableCell>
                        <TableCell>
                          <Chip
                            label={v.estado}
                            sx={{ backgroundColor: c.bg, color: c.color }}
                          />
                        </TableCell>
                        <TableCell>${v.precio}</TableCell>
                        <TableCell>
                          <IconButton
                            sx={{ color: "#6FA3A8" }}
                            onClick={() => abrirModal(v)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => solicitarEliminar(v.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
    <b>{viajesFiltrados.length}</b> viajes
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
          minWidth: 80,
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
          </CardContent>
        </Card>
      </div>

      {/* MODAL */}
      <Dialog open={mostrarModal} onClose={cerrarModal} fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: "#6FA3A8" }}>
          Editar Viaje
        </DialogTitle>
        <DialogContent>
          {viajeEdit && (
            <Stack spacing={2} mt={2}>
              <TextField
                label="Conductor"
                value={viajeEdit.conductor}
                disabled
              />
              <TextField label="Placa" value={viajeEdit.placa} disabled />
              <TextField
                label="Punto de carga"
                value={viajeEdit.punto_carga}
                disabled
              />
              <TextField label="Ruta" value={viajeEdit.ruta} disabled />
              <TextField label="Cliente" value={viajeEdit.cliente} disabled />
              <TextField
                label="Teléfono"
                value={viajeEdit.telefono_cliente}
                disabled
              />
              <TextField
                label="Fecha"
                type="date"
                name="fecha"
                value={viajeEdit.fecha}
                onChange={handleChange}
              />
              <TextField
                label="Hora"
                type="time"
                name="hora"
                value={viajeEdit.hora}
                onChange={handleChange}
              />
              <TextField
                label="Precio"
                name="precio"
                value={viajeEdit.precio}
                onChange={handleChange}
              />
              <TextField
                select
                label="Estado"
                name="estado"
                value={viajeEdit.estado}
                onChange={handleChange}
              >
                {["ASIGNADO", "EN CURSO", "FINALIZADO", "CANCELADO"].map(
                  (e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal} startIcon={<CloseIcon />}>
            Cancelar
          </Button>
          <Button
            onClick={guardarCambios}
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{
              backgroundColor: "#6FA3A8",
              "&:hover": {
                backgroundColor: "#5C8F94",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
       {/* Modal de Confirmación */}
<Dialog
  open={confirmarEliminar.open}
  onClose={() => setConfirmarEliminar({ open: false, id: null })}
  PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
>
  <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <ErrorIcon sx={{ color: "#C85A3A", fontSize: 30 }} />
    <Typography variant="h6" fontWeight={800}>¿Confirmar eliminación?</Typography>
  </DialogTitle>
  
  <DialogContent>
    <Typography color="text.secondary">
      Esta acción no se puede deshacer. El viaje será borrado permanentemente.
    </Typography>
  </DialogContent>

  <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
    <Button 
      onClick={() => setConfirmarEliminar({ open: false, id: null })}
      sx={{ color: "#6B7C7D", fontWeight: 700 }}
    >
      Cancelar
    </Button>
    <Button
      variant="contained"
      onClick={ejecutarEliminacion}
      sx={{ 
        backgroundColor: "#C85A3A", 
        borderRadius: 2, 
        px: 4,
        "&:hover": { backgroundColor: "#A94438" } 
      }}
    >
      ELIMINAR
    </Button>
  </DialogActions>
</Dialog>


    </div>
  );
}
