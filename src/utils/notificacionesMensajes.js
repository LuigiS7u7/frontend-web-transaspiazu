export const generarMensajeNotificacion = ({
  tipo,
  conductor,
  ruta,
  numero_guia,
  precio,
}) => {
  switch (tipo) {
    case "BITACORA":
      return `Estimado ${conductor}, le recordamos registrar la bitácora del viaje asignado en la ruta ${ruta}.`;

    case "PAGO":
      return `La guía N° ${numero_guia} ha sido pagada correctamente por un monto de $${precio}.`;

    case "VIAJE":
      return `La ruta ${ruta} ha sido finalizado exitosamente.`;

    default:
      return "";
  }
};


