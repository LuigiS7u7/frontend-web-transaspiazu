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
  Tooltip,
  TableContainer,
  Paper,
  Chip,
  Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ErrorIcon from "@mui/icons-material/Error";
import {
  obtenerEstadosFinancieros,
  actualizarEstadoFinanciero,
  eliminarEstadoFinanciero,
} from "../../services/financieroService";

import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function FinancieroConsulta() {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroEdit, setRegistroEdit] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [nuevaFoto, setNuevaFoto] = useState(null);

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
    await eliminarEstadoFinanciero(confirmarEliminar.id);
    cargarRegistros();
    setConfirmarEliminar({ open: false, id: null });
    mostrarAlerta(
      "success",
      "Estado financiero eliminado",
      "El registro ha sido removido correctamente.",
      
    );
  } catch (error) {
    mostrarAlerta(
      "error",
      "Error",
      "No se pudo eliminar el estado financiero."
    );
  }
};

  /* ================= CARGAR ================= */
  const cargarRegistros = async () => {
    const data = await obtenerEstadosFinancieros();
    setRegistros(data);
  };

  useEffect(() => {
    cargarRegistros();
  }, []);

  /* ================= BUSCAR ================= */
  const buscar = () => setFiltro(busqueda);

  const filtrados = registros.filter((r) =>
    filtro ? r.cedula?.includes(filtro) : true,
  );
const totalPaginas = Math.ceil(
  filtrados.length / filasPorPagina
);

const registrosPaginados = filtrados.slice(
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

  /* ================= MODAL ================= */
  const abrirModal = (registro) => {
    setRegistroEdit({ ...registro });
    setNuevaFoto(null);
    setMostrarModal(true);
  };
    const [modalAlert, setModalAlert] = useState({
    open: false,
    type: "success", 
    title: "",
    message: "",
  });

  const cerrarModal = () => {
    setMostrarModal(false);
    setRegistroEdit(null);
    setNuevaFoto(null);
  };

  /* ================= GUARDAR ================= */
  const guardarCambios = async () => {
    try {
      const formData = new FormData();

      formData.append("fecha_pago", registroEdit.fecha_pago);
      formData.append("estado_pago", registroEdit.estado_pago);
      formData.append("precio", registroEdit.precio);
      formData.append("metodo_pago", registroEdit.metodo_pago);
      formData.append(
        "numero_metodo_pago",
        registroEdit.numero_metodo_pago || "",
      );

      if (nuevaFoto) {
        formData.append("foto_pago", nuevaFoto);
      }

      await actualizarEstadoFinanciero(registroEdit.id, formData);

      cerrarModal();
      cargarRegistros();
    } catch (error) {
      alert("Error al actualizar registro");
    }
  };



  return (
    <div
      className="row justify-content-center mt-5"
      style={{ minHeight: "100vh" }}
    >
      <div className="col-md-12 col-lg-9">
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
              Consulta Financiera
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      "Fecha",
                      "Cédula",
                      "Nombre",
                      "Guía",
                      "Estado",
                      "Método",
                      "N° Método",
                      "Comprobante",
                      "Precio",
                      "Acciones",
                    ].map((c) => (
                      <TableCell key={c} sx={{ fontWeight: 800 }}>
                        {c}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {registrosPaginados.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{r.fecha_pago}</TableCell>
                      <TableCell>{r.cedula}</TableCell>
                      <TableCell>{r.nombre_conductor}</TableCell>
                      <TableCell>{r.numero_guia}</TableCell>
                      <TableCell>
                        <Chip
                          label={r.estado_pago}
                          color={
                            r.estado_pago === "PAGADO" ? "success" : "error"
                          }
                        />
                      </TableCell>
                      <TableCell>{r.metodo_pago}</TableCell>
                      <TableCell>{r.numero_metodo_pago || "-"}</TableCell>
                      <TableCell>
                        {r.foto_pago ? (
                          <img
                            src={`http://192.168.100.119:3000/uploads/${r.foto_pago}`}
                            alt="comprobante"
                            width={50}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              window.open(
                                `http://192.168.100.119:3000/uploads/${r.foto_pago}`,
                                "_blank",
                              )
                            }
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>${r.precio}</TableCell>
                      <TableCell>
                        <IconButton sx={{ color: "#6FA3A8" }} onClick={() => abrirModal(r)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                        sx={{ color: "#C85A3A" }}
                        onClick={() => solicitarEliminar(r.id)}>
                          <DeleteIcon />
                        </IconButton>
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
    <b>{filtrados.length}</b> registros
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

      {/* MODAL */}
      <Dialog open={mostrarModal} onClose={cerrarModal} fullWidth maxWidth="sm">
        <DialogTitle fontWeight={800}>Editar Registro</DialogTitle>

        <DialogContent>
          {registroEdit && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              {/* SOLO LECTURA */}
              <TextField
                label="Fecha"
                value={registroEdit.fecha_pago || ""}
                onChange={(e) =>
                  setRegistroEdit({
                    ...registroEdit,
                    fecha_pago: e.target.value,
                  })
                }
              />
              <TextField
                label="Cédula"
                value={registroEdit.cedula}
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Guía"
                value={registroEdit.numero_guia || ""}
                onChange={(e) =>
                  setRegistroEdit({
                    ...registroEdit,
                    numero_guia: e.target.value,
                  })
                }
              />
              <TextField
                select
                label="Estado de pago"
                value={registroEdit.estado_pago}
                onChange={(e) =>
                  setRegistroEdit({
                    ...registroEdit,
                    estado_pago: e.target.value,
                  })
                }
              >
                <MenuItem value="PAGADO">PAGADO</MenuItem>
                <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
              </TextField>

              <TextField
                select
                label="Método de pago"
                value={registroEdit.metodo_pago}
                onChange={(e) =>
                  setRegistroEdit({
                    ...registroEdit,
                    metodo_pago: e.target.value,
                  })
                }
              >
                <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                <MenuItem value="CHEQUE">CHEQUE</MenuItem>
              </TextField>

              <TextField
                label="Número método de pago"
                value={registroEdit.numero_metodo_pago || ""}
                onChange={(e) =>
                  setRegistroEdit({
                    ...registroEdit,
                    numero_metodo_pago: e.target.value,
                  })
                }
              />

              <TextField
                label="Precio"
                type="number"
                value={registroEdit.precio}
                onChange={(e) =>
                  setRegistroEdit({ ...registroEdit, precio: e.target.value })
                }
              />

              {/* FOTO */}
              {registroEdit.foto_pago && (
                <img
                  src={`http://192.168.100.119:3000/uploads/${registroEdit.foto_pago}`}
                  alt="actual"
                  style={{ width: "100%", borderRadius: 10 }}
                />
              )}

              <Button component="label" variant="outlined">
                Cambiar comprobante
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNuevaFoto(e.target.files[0])}
                />
              </Button>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button startIcon={<CloseIcon />} onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={guardarCambios}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      

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
      Esta acción no se puede deshacer. El estado financiero será borrado permanentemente.
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
