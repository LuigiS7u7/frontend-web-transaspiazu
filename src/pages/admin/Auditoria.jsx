import { useEffect, useState } from "react";
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
  Box,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  obtenerAuditoria,
  obtenerUsuariosAuditoria,
} from "../../services/auditoriaService";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

/* ======================================================
   AUDITORÍA DEL SISTEMA – WEB
====================================================== */
export default function Auditoria() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [entidad, setEntidad] = useState("");
  const [operacion, setOperacion] = useState("");
  const [usuario, setUsuario] = useState("");
const [pagina, setPagina] = useState(1);
const [filasPorPagina, setFilasPorPagina] = useState(8);

  const [usuariosAuditoria, setUsuariosAuditoria] = useState([]);

  const cargarAuditoria = async (filtros = {}) => {
    setLoading(true);
    try {
      const data = await obtenerAuditoria(filtros);
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAuditoria();
    obtenerUsuariosAuditoria().then(setUsuariosAuditoria);
  }, []);

  const buscar = () => {
    cargarAuditoria({
      entidad,
      tipo_operacion: operacion,
      usuario,
    });
  };

  const limpiarFiltros = () => {
    setEntidad("");
    setOperacion("");
    setUsuario("");
    cargarAuditoria();
  };
const totalPaginas = Math.ceil(logs.length / filasPorPagina);

const logsPaginados = logs.slice(
  (pagina - 1) * filasPorPagina,
  pagina * filasPorPagina
);

const desde =
  logs.length === 0
    ? 0
    : (pagina - 1) * filasPorPagina + 1;

const hasta = Math.min(
  pagina * filasPorPagina,
  logs.length
);



  return (
    <Box
      sx={{
        backgroundColor: "#F4F5F7",
        minHeight: "100vh",
        py: 5,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 1250,
          borderRadius: 4,
          boxShadow: "0px 10px 28px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          {/* ===== TÍTULO ===== */}
          <Typography variant="h4" fontWeight={800} sx={{ color: "#6FA3A8" }}>
            Auditoría del Sistema
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={3}>
            Registro de cambios realizados en el sistema
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* ===== FILTROS ===== */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            mb={3}
            alignItems="center"
          >
       

            <TextField
              select
              label="Operación"
              value={operacion}
              onChange={(e) => setOperacion(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="CREAR">Crear</MenuItem>
              <MenuItem value="ACTUALIZAR">Actualizar</MenuItem>
              <MenuItem value="ELIMINAR">Eliminar</MenuItem>
            </TextField>

         

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={buscar}
              sx={{
                backgroundColor: "#6FA3A8",
                px: 3,
                borderRadius: "20px",
                "&:hover": { backgroundColor: "#5C8F94" },
              }}
            >
              Buscar
            </Button>

            <Button
              variant="outlined"
              onClick={limpiarFiltros}
              sx={{ borderRadius: "20px" }}
            >
              Limpiar
            </Button>

            <Button
              startIcon={<RefreshIcon />}
              onClick={() => cargarAuditoria()}
              sx={{ borderRadius: "20px" }}
            >
              Actualizar
            </Button>
          </Stack>

          {/* ===== TABLA ===== */}
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#E8F3F1" }}>
                <TableRow>
                  {[
                    "Entidad",
                    "ID",
                    "Campo",
                    "Valor Anterior",
                    "Valor Nuevo",
                    "Operación",
                    "Usuario",
                    "Fecha",
                  ].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 800 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No existen registros
                    </TableCell>
                  </TableRow>
                ) : (
                  logsPaginados.map((l) => (
                    <TableRow key={l.id} hover>
                      <TableCell>{l.entidad}</TableCell>
                      <TableCell>{l.identificador_entidad}</TableCell>
                      <TableCell>{l.campo_modificado}</TableCell>
                      <TableCell>{l.valor_anterior}</TableCell>
                      <TableCell>{l.valor_nuevo}</TableCell>
                      <TableCell>
                        <Chip
                          label={l.tipo_operacion}
                          color={
                            l.tipo_operacion === "CREAR"
                              ? "success"
                              : l.tipo_operacion === "ACTUALIZAR"
                              ? "warning"
                              : "error"
                          }
                        />
                      </TableCell>
                      <TableCell>{l.usuario_modificador}</TableCell>
                      <TableCell>
                        {new Date(l.fecha_modificacion).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
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
    <b>{logs.length}</b> registros
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
    </Box>
  );
}
