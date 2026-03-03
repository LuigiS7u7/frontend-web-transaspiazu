import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import {
  obtenerBitacoras,
  eliminarBitacora,
} from "../../services/bitacorasService";

export default function BitacorasConsulta() {
  const [bitacoras, setBitacoras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
const [confirmarEliminar, setConfirmarEliminar] = useState({
  open: false,
  id: null,
});


const solicitarEliminar = (id) => {
  setConfirmarEliminar({ open: true, id });
};


const ejecutarEliminacion = async () => {
  try {
    await eliminarBitacora(confirmarEliminar.id);
    cargar();
    setConfirmarEliminar({ open: false, id: null });
    mostrarAlerta("success", "Bitacora Eliminada", "El registro ha sido removido correctamente.");
  } catch (error) {
    mostrarAlerta("error", "Error", "No se pudo eliminar la bitacora.");
  }
};
  const [modalAlert, setModalAlert] = useState({
    open: false,
    type: "success", 
    title: "",
    message: "",
  });
  /* =========================
     CARGAR BITÁCORAS
  ========================= */
  const cargar = async () => {
    try {
      const data = await obtenerBitacoras();
      setBitacoras(Array.isArray(data) ? data : []);
    } catch (error) {
      alert("Error al cargar bitácoras");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  /* =========================
     FILTRO POR CÉDULA O GUÍA
  ========================= */
  const bitacorasFiltradas = bitacoras.filter((b) => {
    if (!filtro) return true;

    return (
      b.conductor?.toLowerCase().includes(filtro.toLowerCase()) ||
      b.numero_guia?.toLowerCase().includes(filtro.toLowerCase())
    );
  });

  

  return (
    <div
      className="row justify-content-center mt-5"
      style={{ minHeight: "100vh" }}
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
              Consulta de Bitácoras
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* ===== BUSCADOR ===== */}
            <Stack
              direction="row"
              spacing={2}
              mb={4}
              alignItems="center"
              justifyContent="flex-end"
            >
              <TextField
                label="Buscar por número de guía"
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
                onClick={() => setFiltro(busqueda)}
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

            {/* ===== TABLA ===== */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#E8F3F1" }}>
                    {[
                      "Cédula",
                      "Nombre",
                      "N° Guía",
                      "Ruta",
                      "Precio",
                      "Fecha llegada",
                      "Hora llegada",
                      "Fecha salida",
                      "Hora salida",
                      "Foto",
                      "Acciones",
                    ].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {bitacorasFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        No se encontraron bitácoras
                      </TableCell>
                    </TableRow>
                  ) : (
                    bitacorasFiltradas.map((b) => (
                      <TableRow key={b.id} hover>
                         <TableCell>{b.cedula_conductor}</TableCell>
                          <TableCell>{b.nombre_conductor}</TableCell>
                         <TableCell>{b.numero_guia}</TableCell>
                          <TableCell>{b.ruta}</TableCell>

                        <TableCell>
    ${b.precio_viaje ? Number(b.precio_viaje).toFixed(2) : "0.00"}
                        </TableCell>


                        <TableCell>{b.fecha_llegada || "-"}</TableCell>
                        <TableCell>{b.hora_llegada || "-"}</TableCell>
                        <TableCell>{b.fecha_salida || "-"}</TableCell>
                        <TableCell>{b.hora_salida || "-"}</TableCell>

                        {/* FOTO */}
                        <TableCell>
                          {b.foto_guia ? (
                            <img
                              src={`http://localhost:3000/uploads/${b.foto_guia}`}
                              alt="Guía"
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 8,
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                window.open(
                                  `http://localhost:3000/uploads/${b.foto_guia}`,
                                  "_blank",
                                )
                              }
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        {/* ACCIONES */}
                        <TableCell>
                          <IconButton
                           sx={{ color: "#C85A3A" }}
                                onClick={() => solicitarEliminar(b.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
            Esta acción no se puede deshacer. La bitacora será borrado permanentemente.
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
