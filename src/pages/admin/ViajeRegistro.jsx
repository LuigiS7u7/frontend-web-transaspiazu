import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  InputAdornment,
  MenuItem,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import Grow from "@mui/material/Grow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import {
  Badge,
  DirectionsCar,
  Place,
  Person,
  AttachMoney,
  Flag,
  Save,
  Add,
} from "@mui/icons-material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";

import { crearViaje } from "../../services/viajesService";
import { obtenerConductores } from "../../services/conductoresService";
import {
  obtenerVehiculos,
  crearVehiculo,
} from "../../services/vehiculosService";
import { obtenerClientes, crearCliente } from "../../services/clientesService";
import {
  obtenerPuntosCarga,
  crearPuntoCarga,
} from "../../services/puntosCargaService";
import { obtenerRutas, crearRuta } from "../../services/rutasService";

// ===== FORMATTERS =====
const formatearPlaca = (valor) => {
  if (!valor) return null;

  const limpio = valor.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (limpio.length !== 7) return null;

  const letras = limpio.slice(0, 3);
  const numeros = limpio.slice(3, 7);

  if (!/^[A-Z]{3}$/.test(letras)) return null;
  if (!/^[0-9]{4}$/.test(numeros)) return null;

  return `${letras}-${numeros}`;
};

const formatearNombre = (valor) => {
  if (!valor) return null;

  return valor.trim().toUpperCase().replace(/\s+/g, " ");
};

const formatearRuta = (valor) => {
  if (!valor) return null;

  return valor
    .trim()
    .toUpperCase()
    .replace(/[^A-Z\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default function ViajeRegistro() {
  /* ================= ESTADOS PRINCIPALES ================= */
  const [form, setForm] = useState({
    conductor_id: null,
    vehiculo_id: null,
    cliente_id: null,
    punto_carga_id: null,
    ruta_id: null,
    precio: "",
    fecha: null,
    hora: null,
    estado: "ASIGNADO",
  });
  const [modalAlert, setModalAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const mostrarAlerta = (type, title, message) => {
    setModalAlert({ open: true, type, title, message });
  };

  const cerrarAlerta = () => {
    setModalAlert({ ...modalAlert, open: false });
  };

  const [conductorSel, setConductorSel] = useState(null);
  const [conductorInput, setConductorInput] = useState("");
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [puntosCarga, setPuntosCarga] = useState([]);
  const [rutas, setRutas] = useState([]);

  const [direccionCarga, setDireccionCarga] = useState("");
  const [referenciaCarga, setReferenciaCarga] = useState("");
  const [ciudadCarga, setCiudadCarga] = useState("");
  const [provinciaCarga, setProvinciaCarga] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");

  /* ================= MODALES ================= */
  const [openVehiculo, setOpenVehiculo] = useState(false);
  const [openCliente, setOpenCliente] = useState(false);
  const [openPunto, setOpenPunto] = useState(false);
  const [openRuta, setOpenRuta] = useState(false);

  /* ================= FORM MODALES ================= */
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ placa: "", marca: "", propietario: "" });
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
  });
  const [nuevoPunto, setNuevoPunto] = useState({ 
    nombre: "", 
    direccion: "",
    referencia: "",
    ciudad: "",
    provincia: "", });
  const [nuevaRuta, setNuevaRuta] = useState({
  nombre: "",
  origen_direccion: "",
  destino_direccion: "",
  descripcion: "",
});

  const [vehiculoSel, setVehiculoSel] = useState(null);
  const [clienteSel, setClienteSel] = useState(null);
  const [puntoSel, setPuntoSel] = useState(null);
  const [rutaSel, setRutaSel] = useState(null);

  const handleChange = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };
  const filter = createFilterOptions();

  const [vehiculoInput, setVehiculoInput] = useState("");
  const [clienteInput, setClienteInput] = useState("");
  const [puntoCargaInput, setPuntoCargaInput] = useState("");
  const [rutaInput, setRutaInput] = useState("");
  /* ================= CARGAR DATA ================= */
  useEffect(() => {
    const cargar = async () => {
      setConductores((await obtenerConductores()).data);
      setVehiculos((await obtenerVehiculos()).data);
      setClientes((await obtenerClientes()).data);
      setPuntosCarga((await obtenerPuntosCarga()).data);
      setRutas((await obtenerRutas()).data);
    };
    cargar();
  }, []);

  

  /* ================= GUARDAR VIAJE ================= */
  const guardarViaje = async () => {
    try {
      console.log("FORM:", form);

      if (
        !form.conductor_id ||
        !form.vehiculo_id ||
        !form.cliente_id ||
        !form.punto_carga_id ||
        !form.ruta_id ||
        !form.fecha ||
        !form.hora
      ) {
        console.log("FORM:", form);

        mostrarAlerta(
          "error",
          "Datos incompletos",
          "Complete todos los campos obligatorios para registrar el viaje.",
        );
        return;
      }

      await crearViaje({
        ...form,
        fecha: dayjs(form.fecha).format("YYYY-MM-DD"),
        hora: dayjs(form.hora).format("HH:mm:ss"),
      });

      mostrarAlerta(
        "success",
        "Viaje registrado",
        "El viaje fue creado correctamente en el sistema.",
      );
    } catch {
      mostrarAlerta(
        "error",
        "Error al registrar",
        "No se pudo registrar el viaje. Intente nuevamente.",
      );
    }
  };

  /* ================= CREAR DESDE MODALES ================= */
  const crearVehiculoModal = async () => {
    const placaFormateada = formatearPlaca(nuevoVehiculo.placa);

    if (!placaFormateada) {
      mostrarAlerta(
        "error",
        "Placa inválida",
        "La placa debe tener el formato AAA-1234.",
      );
      return;
    }

    const payload = {
      ...nuevoVehiculo,
      placa: placaFormateada,
    };

    const res = await crearVehiculo(payload);

    setVehiculos([...vehiculos, res.data]);
    setVehiculoSel(res.data);
    setVehiculoInput(res.data.placa);
    setForm({ ...form, vehiculo_id: res.data.id });

    setOpenVehiculo(false);
    setNuevoVehiculo({ placa: "", marca: "", propietario: "" });
  };

  const crearClienteModal = async () => {
    const res = await crearCliente(nuevoCliente);
    setClientes([...clientes, res.data]);
    setClienteSel(res.data);
    setClienteInput(res.data.nombre);
    setForm({ ...form, cliente_id: res.data.id });
    setTelefonoCliente(res.data.telefono);
    setOpenCliente(false);
    setNuevoCliente({ nombre: "", telefono: "" });
  };

  const crearPuntoModal = async () => {
    const nombreFormateado = formatearNombre(nuevoPunto.nombre);

    if (!nombreFormateado || !nuevoPunto.direccion || !nuevoPunto.referencia || !nuevoPunto.ciudad || !nuevoPunto.provincia) {
      mostrarAlerta(
        "error",
        "Datos incompletos",
        "Nombre y dirección son obligatorios.",
      );
      return;
    }

    const payload = {
      ...nuevoPunto,
      nombre: nombreFormateado,
    };

    const res = await crearPuntoCarga(payload);

    setPuntosCarga([...puntosCarga, res.data]);
    setPuntoSel(res.data);
    setPuntoCargaInput(res.data.nombre);
    setForm({ ...form, punto_carga_id: res.data.id });
    setDireccionCarga(res.data.direccion);
    setReferenciaCarga(res.data.referencia);
    setCiudadCarga(res.data.ciudad);
    setProvinciaCarga(res.data.provincia);

    setOpenPunto(false);
    setNuevoPunto({ nombre: "", direccion: "", referencia: "", ciudad: "", provincia: "" });
  };

const crearRutaModal = async () => {
  if (
    !nuevaRuta.nombre ||
    !nuevaRuta.origen_direccion ||
    !nuevaRuta.destino_direccion
  ) {
    mostrarAlerta(
      "error",
      "Datos incompletos",
      "Debe ingresar nombre, origen y destino de la ruta.",
    );
    return;
  }

  const payload = {
    nombre: nuevaRuta.nombre.trim().toUpperCase(),
    origen_direccion: nuevaRuta.origen_direccion,
    destino_direccion: nuevaRuta.destino_direccion,
    descripcion: nuevaRuta.descripcion,
  };

  const res = await crearRuta(payload);

  setRutas([...rutas, res.data]);
  setRutaSel(res.data);
  setRutaInput(res.data.nombre);
  setForm({ ...form, ruta_id: res.data.id });

  setOpenRuta(false);
  setNuevaRuta({
    nombre: "",
    origen_direccion: "",
    destino_direccion: "",
    descripcion: "",
  });
};


  return (
    <Box className="row justify-content-center mt-5">
      <Box className="col-md-8">
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
              gutterBottom
              sx={{ color: "#6FA3A8", letterSpacing: 1 }}
            >
              Registrar Viaje
            </Typography>

            <Divider sx={{ my: 3 }} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 4,
                }}
              >
                {/* CONDUCTOR */}
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
                {/* VEHÍCULO */}
                <Autocomplete
                  options={vehiculos}
                  value={vehiculoSel}
                  inputValue={vehiculoInput}
                  onInputChange={(event, newInputValue) => {
                    setVehiculoInput(newInputValue);
                  }}
                  getOptionLabel={(option) => option.placa || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterOptions={(options, state) => {
                    const filtered = filter(options, state);

                    
                    if (!state.inputValue) {
                      return filtered.slice(0, 2);
                    }

                    
                    return filtered;
                  }}
                  onChange={(event, value) => {
                    setVehiculoSel(value);
                    handleChange("vehiculo_id", value ? value.id : null);
                  }}
                  noOptionsText={
                    vehiculoInput
                      ? "No se encontraron vehículos"
                      : "Escriba para buscar más vehículos"
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Placa del vehículo"
                      placeholder="Buscar placa..."
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <DirectionsCar sx={{ color: "#6FA3A8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                            <IconButton onClick={() => setOpenVehiculo(true)}>
                              <Add sx={{ color: "#6FA3A8" }} />
                            </IconButton>
                          </>
                        ),
                      }}
                    />
                  )}
                />

                {/* CLIENTE */}
                <Autocomplete
                  options={clientes}
                  value={clienteSel}
                  inputValue={clienteInput}
                  onInputChange={(e, v) => setClienteInput(v)}
                  getOptionLabel={(o) => o.nombre || ""}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                  filterOptions={(options, state) => {
                    const filtered = filter(options, state);
                    return state.inputValue ? filtered : filtered.slice(0, 2);
                  }}
                  onChange={(e, v) => {
                    setClienteSel(v);
                    handleChange("cliente_id", v ? v.id : null);
                    setTelefonoCliente(v?.telefono || "");
                  }}
                  noOptionsText={
                    clienteInput
                      ? "No se encontraron clientes"
                      : "Escriba para buscar más clientes"
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente"
                      placeholder="Buscar cliente..."
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: "#6FA3A8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                            <IconButton onClick={() => setOpenCliente(true)}>
                              <Add sx={{ color: "#6FA3A8" }} />
                            </IconButton>
                          </>
                        ),
                      }}
                    />
                  )}
                />

                <TextField label="Teléfono" value={telefonoCliente} disabled />

                {/* PUNTO DE CARGA */}
                <Autocomplete
                  options={puntosCarga}
                  value={puntoSel}
                  inputValue={puntoCargaInput}
                  onInputChange={(e, v) => setPuntoCargaInput(v)}
                  getOptionLabel={(o) => o.nombre || ""}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                  filterOptions={(options, state) => {
                    const filtered = filter(options, state);
                    return state.inputValue ? filtered : filtered.slice(0, 2);
                  }}
                  onChange={(e, v) => {
                    setPuntoSel(v);
                    handleChange("punto_carga_id", v ? v.id : null);
                    setDireccionCarga(v?.direccion || "");
                  }}
                  noOptionsText={
                    puntoCargaInput
                      ? "No se encontraron puntos de carga"
                      : "Escriba para buscar más puntos"
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Punto de carga"
                      placeholder="Buscar punto..."
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Place sx={{ color: "#6FA3A8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                            <IconButton onClick={() => setOpenPunto(true)}>
                              <Add sx={{ color: "#6FA3A8" }} />
                            </IconButton>
                          </>
                        ),
                      }}
                    />
                  )}
                />

                <TextField label="Dirección" value={direccionCarga} disabled />

                {/* RUTA */}
                <Autocomplete
                  options={rutas}
                  value={rutaSel}
                  inputValue={rutaInput}
                  onInputChange={(e, v) => setRutaInput(v)}
                  getOptionLabel={(o) => o.nombre || ""}
                  isOptionEqualToValue={(o, v) => o.id === v.id}
                  filterOptions={(options, state) => {
                    const filtered = filter(options, state);
                    return state.inputValue ? filtered : filtered.slice(0, 2);
                  }}
                  onChange={(e, v) => {
                    setRutaSel(v);
                    handleChange("ruta_id", v ? v.id : null);
                  }}
                  noOptionsText={
                    rutaInput
                      ? "No se encontraron rutas"
                      : "Escriba para buscar más rutas"
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ruta"
                      placeholder="Buscar ruta..."
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Flag sx={{ color: "#6FA3A8" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {params.InputProps.endAdornment}
                            <IconButton onClick={() => setOpenRuta(true)}>
                              <Add sx={{ color: "#6FA3A8" }} />
                            </IconButton>
                          </>
                        ),
                      }}
                    />
                  )}
                />

                {/* PRECIO */}
                <TextField
                  label="Precio"
                  type="number"
                  onChange={(e) => handleChange("precio", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: "#6FA3A8" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <DatePicker
                    label="Fecha"
                    onChange={(v) => handleChange("fecha", v)}
                  />

                  <TimePicker
                    label="Hora"
                    onChange={(v) => handleChange("hora", v)}
                  />
                </Box>

                {/* ESTADO */}
                <TextField
                  select
                  label="Estado"
                  value={form.estado}
                  onChange={(e) => handleChange("estado", e.target.value)}
                >
                  {["ASIGNADO", "EN CURSO", "FINALIZADO", "CANCELADO"].map(
                    (e) => (
                      <MenuItem key={e} value={e}>
                        {e}
                      </MenuItem>
                    ),
                  )}
                </TextField>

                {/* BOTÓN */}
                <Box sx={{ gridColumn: "1 / span 2", textAlign: "right" }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={guardarViaje}
                    sx={{
                      backgroundColor: "#6FA3A8",
                      color: "#FFFFFF",
                      px: 4,
                      py: 1.2,
                      fontSize: "1rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      "&:hover": {
                        backgroundColor: "#5C8F94",
                      },
                    }}
                  >
                    Guardar Viaje
                  </Button>
                </Box>
              </Box>
            </LocalizationProvider>
          </CardContent>
        </Card>
      </Box>
      {/* ================= MODAL ALERTA ================= */}
      <Dialog
        TransitionComponent={Grow}
        transitionDuration={300}
        open={modalAlert.open}
        onClose={cerrarAlerta}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, px: 2 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            {modalAlert.type === "success" ? (
              <CheckCircleIcon sx={{ fontSize: 36, color: "#2E7D32" }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 36, color: "#C62828" }} />
            )}
            <Typography fontWeight={800}>{modalAlert.title}</Typography>
          </Box>

          <IconButton onClick={cerrarAlerta}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          <Typography>{modalAlert.message}</Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            onClick={cerrarAlerta}
            sx={{
              minWidth: 160,
              borderRadius: 3,
              fontWeight: 700,
              backgroundColor:
                modalAlert.type === "success" ? "#6FA3A8" : "#C85A3A",
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= MODALES ================= */}

      {/* VEHÍCULO */}
      <Dialog open={openVehiculo} onClose={() => setOpenVehiculo(false)}>
        <DialogTitle>Crear Vehículo</DialogTitle>
        <DialogContent>
          <TextField
            label="Placa"
            fullWidth
            sx={{ mb: 2 }}
            value={nuevoVehiculo.placa}
            onChange={(e) =>
              setNuevoVehiculo({
                ...nuevoVehiculo,
                placa: e.target.value,
              })
            }
          />

          <TextField
            label="Marca"
            fullWidth
            value={nuevoVehiculo.marca}
            onChange={(e) =>
              setNuevoVehiculo({
                ...nuevoVehiculo,
                marca: e.target.value,
              })
            }
          />
            <TextField
            label="Nombre delPropietario"
            fullWidth
            value={nuevoVehiculo.propietario}
            onChange={(e) =>
              setNuevoVehiculo({
                ...nuevoVehiculo,
                propietario: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVehiculo(false)}>Cancelar</Button>
          <Button onClick={crearVehiculoModal} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* CLIENTE */}
      <Dialog open={openCliente} onClose={() => setOpenCliente(false)}>
        <DialogTitle>Crear Cliente</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            sx={{ mb: 2 }}
            value={nuevoCliente.nombre}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
            }
          />
          <TextField
            label="Teléfono"
            fullWidth
            value={nuevoCliente.telefono}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCliente(false)}>Cancelar</Button>
          <Button onClick={crearClienteModal} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

     
    {/* ===== PUNTO DE CARGA ===== */}
<Dialog open={openPunto} onClose={() => setOpenPunto(false)} maxWidth="sm" fullWidth>
  <DialogTitle sx={{ fontWeight: 800, color: "#6FA3A8" }}>
    Crear Punto de Carga
  </DialogTitle>

  <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
    <TextField
      label="Nombre del punto"
      fullWidth
      value={nuevoPunto.nombre}
      onChange={(e) =>
        setNuevoPunto({ ...nuevoPunto, nombre: e.target.value })
      }
    />

    <TextField
      label="Dirección completa"
      placeholder="Ej: Km 12 vía Daule, Bodega Azul"
      fullWidth
      value={nuevoPunto.direccion}
      onChange={(e) =>
        setNuevoPunto({ ...nuevoPunto, direccion: e.target.value })
      }
    />

    <TextField
      label="Referencia"
      placeholder="Ej: Frente a gasolinera Primax"
      fullWidth
      value={nuevoPunto.referencia || ""}
      onChange={(e) =>
        setNuevoPunto({ ...nuevoPunto, referencia: e.target.value })
      }
    />

    <TextField
      label="Ciudad"
      fullWidth
      value={nuevoPunto.ciudad || ""}
      onChange={(e) =>
        setNuevoPunto({ ...nuevoPunto, ciudad: e.target.value })
      }
    />

    <TextField
      label="Provincia"
      fullWidth
      value={nuevoPunto.provincia || ""}
      onChange={(e) =>
        setNuevoPunto({ ...nuevoPunto, provincia: e.target.value })
      }
    />
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={() => setOpenPunto(false)}>Cancelar</Button>
    <Button
      variant="contained"
      onClick={crearPuntoModal}
      sx={{
        backgroundColor: "#6FA3A8",
        fontWeight: 700,
        "&:hover": { backgroundColor: "#5C8F94" },
      }}
    >
      Guardar
    </Button>
  </DialogActions>
</Dialog>


{/* ===== RUTA ===== */}
<Dialog open={openRuta} onClose={() => setOpenRuta(false)} fullWidth maxWidth="sm">
  <DialogTitle sx={{ fontWeight: 800, color: "#6FA3A8" }}>
    Crear Ruta
  </DialogTitle>

  <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
    <TextField
      label="Nombre de la ruta"
      placeholder="GUAYAQUIL - CUENCA"
      fullWidth
      value={nuevaRuta.nombre}
      onChange={(e) =>
        setNuevaRuta({ ...nuevaRuta, nombre: e.target.value })
      }
    />

    <TextField
      label="Dirección de origen"
      placeholder="Puerto Marítimo, Guayaquil"
      fullWidth
      value={nuevaRuta.origen_direccion}
      onChange={(e) =>
        setNuevaRuta({ ...nuevaRuta, origen_direccion: e.target.value })
      }
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Place sx={{ color: "#6FA3A8" }} />
          </InputAdornment>
        ),
      }}
    />

    <TextField
      label="Dirección de destino"
      placeholder="Terminal Terrestre, Cuenca"
      fullWidth
      value={nuevaRuta.destino_direccion}
      onChange={(e) =>
        setNuevaRuta({ ...nuevaRuta, destino_direccion: e.target.value })
      }
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Flag sx={{ color: "#6FA3A8" }} />
          </InputAdornment>
        ),
      }}
    />

    <TextField
      label="Descripción (opcional)"
      multiline
      rows={3}
      value={nuevaRuta.descripcion}
      onChange={(e) =>
        setNuevaRuta({ ...nuevaRuta, descripcion: e.target.value })
      }
    />
  </DialogContent>

  <DialogActions sx={{ p: 2 }}>
    <Button onClick={() => setOpenRuta(false)}>Cancelar</Button>

    <Button
      variant="contained"
      sx={{
        backgroundColor: "#6FA3A8",
        fontWeight: 700,
        "&:hover": { backgroundColor: "#5C8F94" },
      }}
      onClick={crearRutaModal}
    >
      Guardar Ruta
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}
