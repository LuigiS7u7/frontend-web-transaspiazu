import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Stack,
 

} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ErrorIcon from "@mui/icons-material/Error";
import RestoreIcon from "@mui/icons-material/Restore";

import {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  activarUsuario
} from "../../services/usuariosService";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";


export default function UsuarioConsulta() {
  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("1");

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
    await eliminarUsuario(confirmarEliminar.id);
    cargarUsuarios();
    setConfirmarEliminar({ open: false, id: null }); 
    mostrarAlerta("success", "Usuario Eliminado", "El registro ha sido removido correctamente.");
  } catch (error) {
    mostrarAlerta("error", "Error", "No se pudo eliminar el usuario.");
  }
};
 
  const cargarUsuarios = async () => {
    try {
      const res = await obtenerUsuarios(estadoFiltro);
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
      console.log("Filtro cambiado a:", estadoFiltro);
    cargarUsuarios();
  }, [estadoFiltro]);

  const filtrados = usuarios.filter((u) => u.cedula.includes(busqueda));

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


  const abrirModal = (usuario) => {
    setUsuarioEdit(usuario);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioEdit(null);
  };

  const handleChange = (e) => {
    setUsuarioEdit({
      ...usuarioEdit,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = async () => {
    try {
      await actualizarUsuario(usuarioEdit.id, usuarioEdit);
      cerrarModal();
      cargarUsuarios();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };



  const buscarUsuario = () => {
    
  };

  return (
    <div
      className="row justify-content-center mt-5"
      style={{ backgroundColor: "#F4F5F7", minHeight: "100vh" }}
    >
      <div className="col-md-12 col-lg-8">
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
              Consulta de Usuarios
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/*  BUSCADOR */}

            <Stack
              direction="row"
              spacing={2}
              mb={4}
              alignItems="center"
              justifyContent="flex-end"
            >
              <TextField
                label="Buscar por cédula"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
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
                onClick={buscarUsuario}
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
<TextField
  select
  label="Estado"
  value={estadoFiltro}
  onChange={(e) => setEstadoFiltro(e.target.value)}
  size="small"
  sx={{ width: 200 }}
>
  <MenuItem value="1">Activos</MenuItem>
  <MenuItem value="0">Inactivos</MenuItem>
  <MenuItem value="all">Todos</MenuItem>
</TextField>




            </Stack>

            {/* ===== TABLA ===== */}
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F1F7F8" }}>
                    {[
                      "Cédula",
                      "Nombre",
                      "Email",
                      "Teléfono",
                      "Rol",
                      "Acciones",
                    ].map((col) => (
                      <TableCell
                        key={col}
                        sx={{ fontWeight: 800, color: "#2E3A3B" }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {usuariosPaginados.map((u) => (
                    <TableRow key={u.id} hover
                         sx={{
        "& .MuiTableCell-root": {
          fontSize: "1rem",
          fontWeight: 500,
        },
      }}>
                      <TableCell>{u.cedula}</TableCell>
                      <TableCell>{u.nombre}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.telefono}</TableCell>

                      <TableCell>{u.rol}</TableCell>

                      <TableCell align="center">
                        <IconButton
                          sx={{ color: "#6FA3A8" }}
                          onClick={() => abrirModal(u)}
                        >
                          <EditIcon />
                        </IconButton>

                     {u.estado === 0 ? (
  <IconButton
    sx={{ color: "#2E7D32" }}
    onClick={async () => {
      await activarUsuario(u.id);
      cargarUsuarios();
    }}
  >
    <RestoreIcon />
  </IconButton>
) : (
  <IconButton
    sx={{ color: "#C85A3A" }}
    onClick={() => solicitarEliminar(u.id)}
  >
    <DeleteIcon />
  </IconButton>
)}

                      </TableCell>

                    </TableRow>
                  ))}
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
    <b>{filtrados.length}</b> usuarios
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
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmación Estilizado */}
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
      Esta acción no se puede deshacer. El usuario será borrado permanentemente.
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

      {/* ===== MODAL ===== */}
      <Dialog open={mostrarModal} onClose={cerrarModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, color: "#6FA3A8" }}>
          Editar Usuario
        </DialogTitle>

        <DialogContent>
          {usuarioEdit && (
            <Box className="d-flex flex-column gap-3 mt-2">
                 <TextField
                label="Nombre"
                name="nombre"
                value={usuarioEdit.nombre}
                
              />
              <TextField
                label="Email"
                name="email"
                value={usuarioEdit.email}
                onChange={handleChange}
              />

              <TextField
                label="Teléfono"
                name="telefono"
                value={usuarioEdit.telefono}
                onChange={handleChange}
              />

              <TextField
                select
                label="Rol"
                name="rol"
                value={usuarioEdit.rol}
                onChange={handleChange}
              >
                <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
                <MenuItem value="CONDUCTOR">Conductor</MenuItem>
                <MenuItem value="PROPETARIO">Propetario</MenuItem>
              </TextField>
            </Box>
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
    </div>
  );
}
