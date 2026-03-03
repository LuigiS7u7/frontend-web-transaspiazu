import { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
} from "@mui/material";
import Grow from "@mui/material/Grow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";

import {
  AttachMoney,
  Save,
  Badge,
  ReceiptLong,
  CreditCard,
} from "@mui/icons-material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import { guardarEstadoFinanciero } from "../../services/financieroService";
import { obtenerConductores } from "../../services/conductoresService";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function FinancieroRegistro() {

  const [form, setForm] = useState({
    cedula: "",
    numero_guia: "",
    estado_pago: "PENDIENTE",
    metodo_pago: "EFECTIVO",
    numero_metodo_pago: "",
    fecha_pago: null,
    precio: "",
    foto_pago: null,
  });
  const [preview, setPreview] = useState(null);
const esPagado = form.estado_pago === "PAGADO";

const esEfectivo = form.metodo_pago === "EFECTIVO";
const esTransferencia = form.metodo_pago === "TRANSFERENCIA";
const esCheque = form.metodo_pago === "CHEQUE";

// Solo cuando está PAGADO se puede subir foto
const requiereFoto = esPagado;

// Solo cuando está PAGADO y no es efectivo requiere número
const requiereNumero = esPagado && (esTransferencia || esCheque);

  const filter = createFilterOptions();

  const [cedulaInput, setCedulaInput] = useState("");
  const [conductorSel, setConductorSel] = useState(null);
  const [conductores, setConductores] = useState([]);
  /* ===== MODAL ALERTA ===== */
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
 const handleChange = (campo, valor) => {
  setForm((prev) => ({
    ...prev,
    [campo]: valor,
  }));
};
const [guias, setGuias] = useState([]);
const [guiaSel, setGuiaSel] = useState(null);
useEffect(() => {
  if (form.estado_pago === "PENDIENTE") {
    setForm((prev) => ({
      ...prev,
      numero_metodo_pago: "",
      foto_pago: null,
    }));
    setPreview(null);
  }

  if (form.metodo_pago === "EFECTIVO") {
    setForm((prev) => ({
      ...prev,
      numero_metodo_pago: "",
    }));
  }
}, [form.estado_pago, form.metodo_pago]);


  /* ================= CARGAR CONDUCTORES ================= */
  useEffect(() => {
    const cargar = async () => {
      const res = await obtenerConductores();
      setConductores(res.data);
    };
    cargar();
  }, []);

  const guardarRegistro = async () => {
    try {
      console.log("FORM COMPLETO:", form);
console.log("fecha_pago:", form.fecha_pago);
console.log("precio:", form.precio);
      if (
        !form.cedula ||
        !form.numero_guia ||
        !form.fecha_pago ||        
         form.precio === "" || form.precio === null
       
      ) {
        mostrarAlerta(
          "error",
          "Datos incompletos",
          "Complete todos los campos obligatorios.",
        );
        return;
      }
if (esPagado) {
  if (!form.foto_pago) {
    mostrarAlerta(
      "error",
      "Comprobante requerido",
      "Debe subir el comprobante de pago."
    );
    return;
  }

  if (requiereNumero && !form.numero_metodo_pago) {
    mostrarAlerta(
      "error",
      "Número requerido",
      "Debe ingresar el número del método de pago."
    );
    return;
  }
}



      const formData = new FormData();

      formData.append("cedula", form.cedula);
      formData.append("numero_guia", form.numero_guia);
      formData.append("estado_pago", form.estado_pago);
      formData.append("metodo_pago", form.metodo_pago);
      formData.append("numero_metodo_pago", form.numero_metodo_pago);
      formData.append(
        "fecha_pago",
        dayjs(form.fecha_pago).format("YYYY-MM-DD"),
      );
      formData.append("precio", form.precio);

      if (form.foto_pago) {
        formData.append("foto_pago", form.foto_pago);
      }

      await guardarEstadoFinanciero(formData);

      mostrarAlerta(
        "success",
        "Registro exitoso",
        "El estado financiero fue registrado correctamente.",
      );

      setForm({
        cedula: "",
        numero_guia: "",
        estado_pago: "PENDIENTE",
        metodo_pago: "EFECTIVO",
        numero_metodo_pago: "",
        fecha_pago: null,
        precio: "",
        foto_pago: null,
      });
      setPreview(null);
    } catch (error) {
      mostrarAlerta(
        "error",
        "Error",
        "No se pudo registrar el estado financiero.",
      );
    }
  };

  return (
    <div
      className="row justify-content-center mt-5"
      style={{ backgroundColor: "#F4F5F7", minHeight: "100vh" }}
    >
      <div className="col-md-10 col-lg-8">
        <Card
          sx={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 10px 28px rgba(0,0,0,0.08)",
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: "#6FA3A8", letterSpacing: 1 }}
            >
              Registro Financiero
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 4,
                }}
              >
                {/* ===== CÉDULA (AUTOCOMPLETE) ===== */}
                <Autocomplete
                  options={conductores}
                  value={conductorSel}
                  inputValue={cedulaInput}
                  onInputChange={(e, v) => setCedulaInput(v)}
                  getOptionLabel={(option) => option.cedula}
                  isOptionEqualToValue={(option, value) =>
                    option.cedula === value.cedula
                  }
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
                  onChange={async (e, v) => {
                    setConductorSel(v);
                    handleChange("cedula", v?.cedula || "");
                     if (v?.cedula) {
    const res = await fetch(`http://localhost:3000/api/bitacoras/guias/${v.cedula}`);
    const data = await res.json();
    setGuias(data);
  } else {
    setGuias([]);
  }
                  }}
                  noOptionsText={
                    cedulaInput
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

<Autocomplete
  options={guias}
  value={guiaSel}
  getOptionLabel={(option) => option.numero_guia}
  isOptionEqualToValue={(option, value) =>
    option.numero_guia === value.numero_guia
  }
  onChange={(e, v) => {
    setGuiaSel(v);
    handleChange("numero_guia", v?.numero_guia || "");
    handleChange("precio", v?.precio_viaje ?? "");
  }}
  renderInput={(params) => (
 
          <TextField
                      {...params}
                      label="Número de guía"
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

                {/* ESTADO DE PAGO */}
                <TextField
                  select
                  label="Estado de pago"
                  value={form.estado_pago}
                  onChange={(e) => handleChange("estado_pago", e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard sx={{ color: "#6FA3A8" }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {["PENDIENTE", "PAGADO"].map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </TextField>

                {/* MÉTODO DE PAGO */}
                <TextField
                  select
                  label="Método de pago"
                  value={form.metodo_pago}
                  onChange={(e) => handleChange("metodo_pago", e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard sx={{ color: "#6FA3A8" }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  {["EFECTIVO", "TRANSFERENCIA", "CHEQUE"].map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Número del método de pago"
                  value={form.numero_metodo_pago}
                  onChange={(e) =>
                    handleChange("numero_metodo_pago", e.target.value)
                  }
                  fullWidth
                  disabled={!requiereNumero}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard sx={{ color: "#6FA3A8" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* FECHA */}
                <DatePicker
                  label="Fecha de pago"
                  value={form.fecha_pago}
                  onChange={(value) => handleChange("fecha_pago", value)}
                  enableAccessibleFieldDOMStructure={false}
                  slots={{ textField: TextField }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthIcon sx={{ color: "#6FA3A8" }} />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />


               {/* ===== COMPROBANTE DE PAGO ===== */}
{requiereFoto  ? (
  !form.foto_pago ? (
    <Box
      component="label"
      sx={{
        border: "2px dashed #C5DADD",
        borderRadius: 3,
        p: 4,
        textAlign: "center",
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": { backgroundColor: "#F5FAFB" },
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 40, color: "#6FA3A8" }} />
      <Typography fontWeight={600} mt={1}>
        Subir comprobante de pago
      </Typography>
      <Typography variant="caption" color="text.secondary">
        JPG, PNG o PDF
      </Typography>

      <input
        type="file"
        hidden
        accept="image/*,.pdf"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;

          handleChange("foto_pago", file);

          if (file.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(file));
          } else {
            setPreview(null);
          }
        }}
      />
    </Box>
  ) : (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        {preview ? (
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid #ddd",
              position: "relative",
            }}
          >
            <img
              src={preview}
              alt="preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            <IconButton
              size="small"
              onClick={() => window.open(preview, "_blank")}
              sx={{
                position: "absolute",
                bottom: 4,
                right: 4,
                backgroundColor: "rgba(255,255,255,0.85)",
              }}
            >
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <PictureAsPdfIcon color="error" />
            <Typography variant="caption">
              {form.foto_pago.name}
            </Typography>
          </Stack>
        )}

        <IconButton
          color="error"
          onClick={() => {
            handleChange("foto_pago", null);
            setPreview(null);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Stack>
  )
) : (
  <Box
    sx={{
      border: "1px dashed #ddd",
      borderRadius: 3,
      p: 3,
      textAlign: "center",
      color: "text.secondary",
    }}
  >
    <Typography variant="caption">
      El comprobante se habilita únicamente cuando el estado sea PAGADO
    </Typography>
  </Box>
)}

                

                {/* PRECIO */}
                <TextField
                  label="Valor a pagar"
                  type="number"
                  value={form.precio}
                  fullWidth
                   disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: "#6FA3A8" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* BOTÓN */}
                <Box sx={{ gridColumn: "1 / span 2", textAlign: "right" }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={guardarRegistro}
                    sx={{
                      backgroundColor: "#6FA3A8",
                      "&:hover": {
                        backgroundColor: "#5C8F94",
                      },
                    }}
                  >
                    Guardar Registro
                  </Button>
                </Box>
              </Box>
            </LocalizationProvider>
          </CardContent>
        </Card>

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
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
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
      </div>
    </div>
  );
}
