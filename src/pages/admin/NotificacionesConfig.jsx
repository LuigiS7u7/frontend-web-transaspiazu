import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  MenuItem,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  InputAdornment,
  Badge,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  crearNotificacion,
  obtenerNotificaciones,
  obtenerDatosNotificacion,
} from "../../services/notificacionesService";

import { obtenerConductores } from "../../services/conductoresService";
import { generarMensajeNotificacion } from "../../utils/notificacionesMensajes";

export default function NotificacionesConfig() {
  /* =======================
     ESTADOS
  ======================= */
    const [conductorSel, setConductorSel] = useState(null);
    const [conductorInput, setConductorInput] = useState("");
   
  const [conductores, setConductores] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesFiltradas, setNotificacionesFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("");

  const [form, setForm] = useState({
    conductor_id: null,
    cedula: "",
    conductor: "",
    descripcion_mensaje: "",
    estado_entrega: "",
    intervalo_horas: 24,
  });

  /* =======================
     CARGA INICIAL
  ======================= */
  const cargar = async () => {
    const resConductores = await obtenerConductores();
    setConductores(resConductores.data);

    const resNotificaciones = await obtenerNotificaciones();
    setNotificaciones(resNotificaciones);
    setNotificacionesFiltradas(resNotificaciones);
  };

  useEffect(() => {
    cargar();
  }, []);

  /* =======================
     CAMBIO DE TIPO
  ======================= */
  const onTipoChange = async (value) => {
    if (!form.conductor_id) return;

    let estado = "";
    if (value === "BITACORA") estado = "PENDIENTE";
    if (value === "PAGO") estado = "PAGADO";
    if (value === "VIAJE") estado = "FINALIZADO";

    const data = await obtenerDatosNotificacion(form.conductor_id, value);

    const mensaje = generarMensajeNotificacion({
      tipo: value,
      conductor: form.conductor,
      ruta: data?.ruta || "pendiente de asignación",
      numero_guia: data?.numero_guia,
      precio: data?.precio,
    });

    setTipo(value);
    setForm((prev) => ({
      ...prev,
      estado_entrega: estado,
      descripcion_mensaje: mensaje,
    }));
  };

  /* =======================
     GENERAR NOTIFICACIÓN
  ======================= */
  const generar = async () => {
    if (!form.conductor_id || !tipo) {
      alert("Seleccione conductor y tipo de notificación");
      return;
    }

    await crearNotificacion({
      conductor_id: form.conductor_id,
      tipo_mensaje: tipo,
      descripcion_mensaje: form.descripcion_mensaje,
      estado_entrega: form.estado_entrega,
      intervalo_horas: form.intervalo_horas,
    });

    setTipo("");
    setForm({
      conductor_id: null,
      cedula: "",
      conductor: "",
      descripcion_mensaje: "",
      estado_entrega: "",
      intervalo_horas: 24,
    });

    cargar();
  };
   const handleChange = (campo, valor) => {
      setForm({ ...form, [campo]: valor });
    };
    const filter = createFilterOptions();

  /* =======================
     BUSCADOR
  ======================= */
  const buscarNotificaciones = () => {
    const texto = busqueda.toLowerCase();

    const filtradas = notificaciones.filter(
      (n) =>
        n.conductor?.toLowerCase().includes(texto) ||
        n.tipo_mensaje?.toLowerCase().includes(texto) ||
        n.descripcion_mensaje?.toLowerCase().includes(texto),
    );

    setNotificacionesFiltradas(filtradas);
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    setNotificacionesFiltradas(notificaciones);
  };

  /* =======================
     UI
  ======================= */
  return (
    <Card
  sx={{
    m: 4,
    borderRadius: 4,
    boxShadow: "0px 10px 28px rgba(0,0,0,0.08)",
    backgroundColor: "#FFFFFF",
    maxWidth: 1090, 
    m: "40px auto",      
  }}
>
  <CardContent>
    <Typography
      variant="h4"
      fontWeight={800}
      gutterBottom
      sx={{ color: "#6FA3A8", letterSpacing: 1 }}
    >
      Configuración de Notificaciones
    </Typography>

    <Divider sx={{ my: 3 }} />

    {/* ===================== FORMULARIO ===================== */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
        mb: 4,
      }}
    >
                 <Autocomplete
                       options={conductores}
                       value={conductorSel}
                       inputValue={conductorInput}
                       onInputChange={(e, v) => setConductorInput(v)}
                       getOptionLabel={(o) => o.cedula}
                       isOptionEqualToValue={(o, v) => o.id === v.id}
                       filterOptions={(options, state) => {
                           const input = state.inputValue.toLowerCase();
     
       const filtered = options.filter(
         (o) =>
           o.cedula.toLowerCase().includes(input) ||
           o.nombre.toLowerCase().includes(input)
       );
     
       if (!state.inputValue) {
         return filtered.slice(0, 2);
       }
     
       return filtered;
                       }}
                       onChange={(e, v) => {
                         setConductorSel(v);
                         handleChange("conductor_id", v ? v.id : null);
                       }}
                       noOptionsText={
                         conductorInput
                           ? "No se encontraron conductores"
                           : "Escriba para buscar más conductores"
                       }
                       renderOption={(props, option) => (
                         <li {...props}>
                           <strong>{option.cedula}</strong> — {option.nombre}
                         </li>
                       )}
                       renderInput={(params) => (
                         <TextField
                           {...params}
                           label="Cédula del conductor"
                           placeholder="Buscar por cédula o nombre..."
                           fullWidth
                           InputProps={{
                             ...params.InputProps,
                             startAdornment: (
                               <InputAdornment position="start">
                                 <Badge sx={{ color: "#6FA3A8" }} />
                               </InputAdornment>
                             ),
                           }}
                         />
                       )}
                     />

      <TextField
        select
        label="Tipo de notificación"
        value={tipo}
        onChange={(e) => onTipoChange(e.target.value)}
        
      >
        <MenuItem value="BITACORA">Bitácora pendiente</MenuItem>
        <MenuItem value="PAGO">Pago realizado</MenuItem>
        <MenuItem value="VIAJE">Viaje finalizado</MenuItem>
      </TextField>

      <TextField
        type="number"
        label="Intervalo de recordatorio (horas)"
        value={form.intervalo_horas}
        onChange={(e) =>
          setForm({ ...form, intervalo_horas: e.target.value })
        }
       
      />

      <TextField
        label="Mensaje generado"
        multiline
        rows={3}
        value={form.descripcion_mensaje}
        InputProps={{ readOnly: true }}
       
      />
    </Box>

    <Box textAlign="right" mb={4}>
      <Button
        variant="contained"
        startIcon={<SendIcon />}
        onClick={generar}
        sx={{
          backgroundColor: "#6FA3A8",
          px: 4,
          
          "&:hover": {
            backgroundColor: "#5C8F94",
          },
        }}
      >
        Generar notificación
      </Button>
    </Box>

    <Divider sx={{ mb: 3 }} />

    {/* ===================== BUSCADOR ===================== */}
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <TextField
        label="Buscar notificaciones"
        placeholder="Conductor, tipo o mensaje"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && buscarNotificaciones()}
        sx={{
          width: 380,
          "& .MuiOutlinedInput-root": {
            borderRadius: "25px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        onClick={buscarNotificaciones}
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

      <Button
        variant="outlined"
        onClick={limpiarBusqueda}
        sx={{
          borderRadius: "20px",
          px: 3,
          color: "#6FA3A8",
          borderColor: "#6FA3A8",
          "&:hover": {
            borderColor: "#5C8F94",
            backgroundColor: "#EAF6F4",
          },
        }}
      >
        Limpiar
      </Button>
    </Box>

    {/* ===================== TABLA ===================== */}
    <TableContainer component={Paper} sx={{ borderRadius: 3 }} elevation={0}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#F1F7F8" }}>
            {["Conductor", "Tipo", "Mensaje", "Estado", "Fecha"].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 800, color: "#2E3A3B" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {notificacionesFiltradas.map((n) => (
            <TableRow key={n.id} hover>
              <TableCell>{n.conductor}</TableCell>
              <TableCell>{n.tipo_mensaje}</TableCell>
              <TableCell>{n.descripcion_mensaje}</TableCell>
              <TableCell>
                <Chip
                  label={n.estado_entrega}
                  color={
                    n.estado_entrega === "PAGADO"
                      ? "success"
                      : n.estado_entrega === "FINALIZADO"
                      ? "info"
                      : "warning"
                  }
                />
              </TableCell>
              <TableCell>
                {new Date(n.fecha_envio).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </CardContent>
</Card>

  );
}
