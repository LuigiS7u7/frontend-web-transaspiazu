import { useEffect, useState } from "react";
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
  Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import {
  obtenerVehiculos,
  eliminarVehiculo,
  actualizarVehiculo,
} from "../../services/vehiculosService";

import {
  obtenerClientes,
  eliminarCliente,
  actualizarCliente,
} from "../../services/clientesService";

import {
  obtenerRutas,
  eliminarRuta,
  actualizarRuta,
} from "../../services/rutasService";

import {
  obtenerPuntosCarga,
  eliminarPuntoCarga,
  actualizarPuntoCarga,
} from "../../services/puntosCargaService";

import Grow from "@mui/material/Grow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";

// ================= FORMATTERS =================
const formatearPlaca = (valor) => {
  if (!valor) return null;

  // Quitar todo menos letras y números
  const limpio = valor.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  // Debe tener 3 letras + 4 números
  if (limpio.length !== 7) return null;

  const letras = limpio.slice(0, 3);
  const numeros = limpio.slice(3, 7);

  if (!/^[A-Z]{3}$/.test(letras)) return null;
  if (!/^[0-9]{4}$/.test(numeros)) return null;

  return `${letras}-${numeros}`;
};

const formatearRuta = (valor) => {
  if (!valor) return null;

  return valor
    .trim()
    .toUpperCase()
    .replace(/[^A-Z\s-]/g, "") // solo letras, espacios y guiones
    .replace(/\s+/g, "-") // espacios → guiones
    .replace(/-+/g, "-"); // evitar guiones dobles
};

const formatearNombre = (valor) => {
  if (!valor) return null;

  return valor.trim().toUpperCase().replace(/\s+/g, " ");
};

export default function CatalogosConsulta() {
  const [tipo, setTipo] = useState("vehiculos");
  const [busqueda, setBusqueda] = useState("");
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);
const [confirmarEliminar, setConfirmarEliminar] = useState({
  open: false,
  id: null,
});
const [usuarios, setUsuarios] = useState([]);
const cargarUsuarios = async () => {
  try {
    const res = await axios.get("https://nonpatriotic-involucral-marylyn.ngrok-free.dev/api/usuarios");
     const usuariosArray = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];

    setUsuarios(usuariosArray);

  } catch (error) {
    console.error("Error cargando usuarios:", error);
    setUsuarios([]);
  }
};
useEffect(() => {
  cargarUsuarios();
}, []);

const solicitarEliminar = (id) => {
  setConfirmarEliminar({ open: true, id });
};


const ejecutarEliminacion = async () => {
  try {
    const id = confirmarEliminar.id;

   
    switch (tipo) {
      case "vehiculos":
        await eliminarVehiculo(id);
        break;
      case "clientes":
        await eliminarCliente(id);
        break;
      case "rutas":
        await eliminarRuta(id);
        break;
      case "puntos":
        await eliminarPuntoCarga(id);
        break;
      default:
        throw new Error("Tipo de parametro no reconocido");
    }

    // Refrescar la tabla y cerrar modal
    await cargarData();
    setConfirmarEliminar({ open: false, id: null });
    
    mostrarAlerta(
      "success", 
      "Registro Eliminado", 
      `El registro de ${tipo} ha sido removido correctamente.`
    );
  } catch (error) {
    setConfirmarEliminar({ open: false, id: null });
    mostrarAlerta("error", "Error", "No se pudo eliminar el registro seleccionado.");
    console.error(error);
  }
};
  /* ===== MODAL ALERT ===== */
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

  /* ================= CARGAR DATA ================= */
  const cargarData = async () => {
    switch (tipo) {
      case "vehiculos":
        setData((await obtenerVehiculos()).data);
        break;
      case "clientes":
        setData((await obtenerClientes()).data);
        break;
      case "rutas":
        setData((await obtenerRutas()).data);
        break;
      case "puntos":
        setData((await obtenerPuntosCarga()).data);
        break;
      default:
        setData([]);
    }
  };

  useEffect(() => {
    cargarData();
  }, [tipo]);

  /* ================= ELIMINAR ================= */
  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar registro?")) return;

    switch (tipo) {
      case "vehiculos":
        await eliminarVehiculo(id);
        break;
      case "clientes":
        await eliminarCliente(id);
        break;
      case "rutas":
        await eliminarRuta(id);
        break;
      case "puntos":
        await eliminarPuntoCarga(id);
        break;
    }
    cargarData();
  };

  /* ================= GUARDAR EDICIÓN ================= */
  const guardarCambios = async () => {
    switch (tipo) {
      case "vehiculos":
        await actualizarVehiculo(editItem.id, editItem);
        break;
      case "clientes":
        await actualizarCliente(editItem.id, editItem);
        break;
      case "rutas":
        await actualizarRuta(editItem.id, editItem);
        break;
      case "puntos":
        await actualizarPuntoCarga(editItem.id, editItem);
        break;
    }
    setEditItem(null);
    cargarData();
  };

  /* ================= FILTRO ================= */
  const filtrados = data.filter((d) =>
    JSON.stringify(d).toLowerCase().includes(busqueda.toLowerCase()),
  );

  function FormVehiculo({ onSaved, onAlert, usuarios  }) {
    const [form, setForm] = useState({ placa: "", marca: "", propetario: "" });
    const usuariosFiltrados = usuarios.filter(
  (u) => u.rol === "CONDUCTOR" || u.rol === "PROPETARIO"
);

    const guardar = async () => {
      let payload = null; 

      try {
        if (!form.placa || !form.marca) {
          onAlert(
            "error",
            "Datos incompletos",
            "Placa y marca son obligatorios.",
          );
          return;
        }

        const placaFormateada = formatearPlaca(form.placa);

        if (!placaFormateada) {
          onAlert(
            "error",
            "Placa inválida",
            "La placa debe tener el formato AAA-1234.",
          );
          return;
        }

        payload = {
          ...form,
          placa: placaFormateada,
        };

        console.log("PAYLOAD VEHICULO:", payload); 

        await axios.post("http://192.168.100.119:3000/api/vehiculos", payload);

        onAlert(
          "success",
          "Vehículo creado",
          "El vehículo fue registrado correctamente.",
        );

        setForm({ placa: "", marca: "", propetario: "" });
        onSaved();
      } catch (error) {
        console.error("ERROR VEHICULO:", error.response?.data || error);
console.error("ERROR VEHICULO:", error.response?.data || error);

        onAlert(
          "error",
          "Error",
          error.response?.data?.message || "No se pudo registrar el vehículo.",
        );
        console.error("ERROR VEHICULO:", error.response?.data || error);

      }
    };

    return (
      <Stack direction="row" spacing={2}>
        <TextField
          label="Placa"
          value={form.placa}
          onChange={(e) => setForm({ ...form, placa: e.target.value })}
          fullWidth
        />
        <TextField
          label="Marca"
          value={form.marca}
          onChange={(e) => setForm({ ...form, marca: e.target.value })}
          fullWidth
        />
       <Autocomplete
  options={usuariosFiltrados}
  getOptionLabel={(option) => option.nombre}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  filterOptions={(options, state) => {
    const input = state.inputValue.toLowerCase();
console.log("USUARIOS ANTES DE FILTRAR:", usuarios);
    const filtered = options.filter(
      (o) =>
        o.nombre.toLowerCase().includes(input)
      
    );

    // Si no escribe nada → mostrar solo 2
    if (!state.inputValue) {
      return filtered.slice(0, 2);
    }

    return filtered;
  }}
  onChange={(event, newValue) => {
    setForm({
      ...form,
      propietario: newValue ? newValue.nombre : ""
    });
  }}
  renderOption={(props, option) => (
    <li {...props}>
      <strong>{option.nombre}</strong> — {option.rol}
    </li>
  )}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Propetario"
      placeholder="Buscar por nombre..."
      fullWidth
    />
  )}
/>
        <Button
          variant="contained"
          onClick={guardar}
          startIcon={<SaveIcon />}
          sx={{ backgroundColor: "#6FA3A8" }}
        />
      </Stack>
    );
  }

  function FormCliente({ onSaved, onAlert }) {
    const [form, setForm] = useState({ nombre: "", telefono: "" });

    const guardar = async () => {
      try {
        if (!form.nombre) {
          onAlert(
            "error",
            "Datos incompletos",
            "El nombre del cliente es obligatorio.",
          );
          return;
        }

        await axios.post("http://192.168.100.119:3000/api/clientes", form);

        onAlert(
          "success",
          "Cliente creado",
          "El cliente fue registrado correctamente.",
        );

        setForm({ nombre: "", telefono: "" });
        onSaved();
      } catch {
        onAlert("error", "Error", "No se pudo registrar el cliente.");
      }
    };

    return (
      <Stack direction="row" spacing={2}>
        <TextField
          label="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          fullWidth
        />
        <TextField
          label="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={guardar}
          startIcon={<SaveIcon />}
          sx={{ backgroundColor: "#6FA3A8" }}
        />
      </Stack>
    );
  }

  function FormRuta({ onSaved, onAlert }) {
  const [form, setForm] = useState({
    nombre: "",
    origen_direccion: "",
    destino_direccion: "",
    descripcion: "",
  });

  const guardar = async () => {
    let payload = null;

    try {
      if (!form.nombre || !form.origen_direccion || !form.destino_direccion) {
        onAlert(
          "error",
          "Datos incompletos",
          "Nombre, origen y destino son obligatorios.",
        );
        return;
      }

      const nombreFormateado = formatearRuta(form.nombre);

      if (!nombreFormateado) {
        onAlert(
          "error",
          "Ruta inválida",
          "Ingrese un nombre válido para la ruta.",
        );
        return;
      }

      payload = {
        nombre: nombreFormateado,
        origen_direccion: form.origen_direccion.trim(),
        destino_direccion: form.destino_direccion.trim(),
        descripcion: form.descripcion?.trim() || null,
      };

      console.log("PAYLOAD RUTA:", payload);

      await axios.post("http://192.168.100.119:3000/api/rutas", payload);

      onAlert(
        "success",
        "Ruta creada",
        "La ruta fue registrada correctamente.",
      );

      setForm({
        nombre: "",
        origen_direccion: "",
        destino_direccion: "",
        descripcion: "",
      });

      onSaved();
    } catch (error) {
      console.error("ERROR RUTA:", error.response?.data || error);

      onAlert(
        "error",
        "Error",
        error.response?.data?.message || "No se pudo registrar la ruta.",
      );
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Nombre de la ruta"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        fullWidth
      />

      <TextField
        label="Dirección de origen"
        placeholder="Ej: Guayaquil, Ecuador"
        value={form.origen_direccion}
        onChange={(e) =>
          setForm({ ...form, origen_direccion: e.target.value })
        }
        fullWidth
      />

      <TextField
        label="Dirección de destino"
        placeholder="Ej: Cuenca, Ecuador"
        value={form.destino_direccion}
        onChange={(e) =>
          setForm({ ...form, destino_direccion: e.target.value })
        }
        fullWidth
      />

      <TextField
        label="Descripción (opcional)"
        multiline
        rows={2}
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        fullWidth
      />

      <Button
        variant="contained"
        onClick={guardar}
        startIcon={<SaveIcon />}
        sx={{ backgroundColor: "#6FA3A8", alignSelf: "flex-end" }}
      >
        Guardar Ruta
      </Button>
    </Stack>
  );
}


  function FormPuntoCarga({ onSaved, onAlert }) {
    const [form, setForm] = useState({ nombre: "", direccion: "", referencia: "", ciudad: "", provincia:"" });

    const guardar = async () => {
      let payload = null;

      try {
        if (!form.nombre || !form.direccion || !form.referencia || !form.ciudad || !form.provincia) {
          onAlert(
            "error",
            "Datos incompletos",
            "Nombre y dirección son obligatorios.",
          );
          return;
        }

        payload = {
          ...form,
          nombre: formatearNombre(form.nombre),
        };

        console.log("PAYLOAD PUNTO:", payload);

        await axios.post("http://192.168.100.119:3000/api/puntos-carga", payload);

        onAlert(
          "success",
          "Punto de carga creado",
          "El punto de carga fue registrado correctamente.",
        );

        setForm({ nombre: "", direccion: "", referencia: "", ciudad: "", provincia:"" });
        onSaved();
      } catch (error) {
        console.error("ERROR PUNTO:", error.response?.data || error);

        onAlert(
          "error",
          "Error",
          error.response?.data?.message ||
            "No se pudo registrar el punto de carga.",
        );
      }
    };

    return (
      <Stack  spacing={2}>
        <TextField
          label="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          fullWidth
        />
        <TextField
          label="Dirección"
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          fullWidth
        />
       
         <TextField
          label="Referencia"
          value={form.referencia}
          onChange={(e) => setForm({ ...form, referencia: e.target.value })}
          fullWidth
        />
         <TextField
          label="Ciudad"
          value={form.ciudad}
          onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
          fullWidth
        />
          <TextField
          label="Provincia"
          value={form.provincia}
          onChange={(e) => setForm({ ...form, provincia: e.target.value })}
          fullWidth
        />

           <Button
        variant="contained"
        onClick={guardar}
        startIcon={<SaveIcon />}
        sx={{ backgroundColor: "#6FA3A8", alignSelf: "flex-end" }}
      >
        Guardar
      </Button>
      </Stack>
    );
  }
  //  Columnas que NO se mostrarán en la tabla
  const columnasOcultas = ["id", "created_at", "estado"];

  // Columnas visibles (dinámicas según el tipo)
  const columnasVisibles = (
    filtrados[0] ? Object.keys(filtrados[0]) : []
  ).filter((key) => !columnasOcultas.includes(key));

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-8">
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
              Parámetros
            </Typography>
            <Divider sx={{ my: 3 }} />

            {/* BUSCADOR */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              {/* IZQUIERDA: Tipo */}
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  select
                  label="Tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="vehiculos">Vehículos</MenuItem>
                  <MenuItem value="clientes">Clientes</MenuItem>
                  <MenuItem value="rutas">Rutas</MenuItem>
                  <MenuItem value="puntos">Puntos de Carga</MenuItem>
                </TextField>
              </Stack>

              {/* DERECHA: Buscar + botón */}
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Buscar..."
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
                  onClick={cargarData}
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
            </Stack>

            {/* ===== TABLA ===== */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#E8F3F1" }}>
                    {columnasVisibles.map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700 }}>
                        {h.toUpperCase()}
                      </TableCell>
                    ))}
                    <TableCell align="center">ACCIONES</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtrados.map((row) => (
                    <TableRow key={row.id} hover>
                      {columnasVisibles.map((col) => (
                        <TableCell key={col}>{row[col]}</TableCell>
                      ))}

                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton sx={{ color: "#6FA3A8" }} onClick={() => setEditItem(row)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Eliminar">
  <IconButton 
    sx={{ color: "#C85A3A" }} 
    onClick={() => solicitarEliminar(row.id)} 
  >
    <DeleteIcon />
  </IconButton>
</Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 4 }} />

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "#6FA3A8", mb: 2 }}
            >
              Agregar nuevo registro
            </Typography>

            {tipo === "vehiculos" && (
              <FormVehiculo onSaved={cargarData} onAlert={mostrarAlerta}  usuarios={usuarios}/>
            )}

            {tipo === "clientes" && (
              <FormCliente onSaved={cargarData} onAlert={mostrarAlerta} />
            )}

            {tipo === "rutas" && (
              <FormRuta onSaved={cargarData} onAlert={mostrarAlerta} />
            )}

            {tipo === "puntos" && (
              <FormPuntoCarga onSaved={cargarData} onAlert={mostrarAlerta} />
            )}
          </CardContent>
        </Card>
      </div>


      
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
      ¿Estás seguro de que deseas eliminar este registro de <strong>{tipo}</strong>? 
      Esta acción no se puede deshacer.
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

      {/* ===== MODAL EDITAR ===== */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: "#6FA3A8" }}>
          Editar
        </DialogTitle>
        <DialogContent>
          {editItem &&
            Object.keys(editItem).map((k) =>
              k === "id" ? null : (
                <TextField
                  key={k}
                  label={k}
                  value={editItem[k] ?? ""} 
                  onChange={(e) =>
                    setEditItem({ ...editItem, [k]: e.target.value })
                  }
                  fullWidth
                  sx={{ mb: 2 }}
                />
              ),
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={guardarCambios}
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

      {/* ================= MODAL ALERTA ================= */}
      <Dialog
        TransitionComponent={Grow}
        transitionDuration={300}
        open={modalAlert.open}
        onClose={cerrarAlerta}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, px: 2 },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            {modalAlert.type === "success" ? (
              <CheckCircleIcon sx={{ fontSize: 36, color: "#2E7D32" }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 36, color: "#C62828" }} />
            )}

            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                color: modalAlert.type === "success" ? "#2E7D32" : "#C62828",
              }}
            >
              {modalAlert.title}
            </Typography>
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
    </div>
  );
}
