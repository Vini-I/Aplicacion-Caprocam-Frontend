// Esta versión SOLO se carga cuando la app corre en iOS/Android.
// En vez de dejar que expo-print guarde el PDF en su propia carpeta
// de caché interna (que Expo Go en Android a veces no deja leer ni
// copiar para compartir), le pedimos el PDF en base64 y lo escribimos
// nosotros mismos en el directorio de documentos de la app, que sí
// es accesible para expo-sharing.

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { useError } from "../../../shared/context/ErrorContext";

export const generarRegistroPDF = async (finca, estanquesFinca = []) => {
  try {
    const filaTabla = (etiqueta, valor) => `
      <tr>
        <td style="font-weight:bold; width:40%;">${etiqueta}</td>
        <td>${valor ?? ""}</td>
      </tr>
    `;

    const cantidadEstanques = estanquesFinca.length;

    const htmlTablaFinca = `
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px;" border="1" cellpadding="6">
        <tr style="background-color:#285a3c; color:white;">
          <th colspan="2" style="text-align:left; padding:6px;">Datos de la finca</th>
        </tr>
        ${filaTabla("Nombre", finca.nombreFinca)}
        ${filaTabla("Código", finca.codigoCBO)}
        ${filaTabla("Provincia", finca.provincia)}
        ${filaTabla("Cantón", finca.canton)}
        ${filaTabla("Distrito", finca.distrito)}
        ${filaTabla("Responsable", finca.propietarioResponsable)}
        ${filaTabla("Teléfonos", (finca.telefonos || []).join(", "))}
        ${filaTabla("Área total", finca.areaTotal)}
        ${filaTabla("Espejo de agua", finca.espejosAgua)}
        ${filaTabla("Cantidad de estanques", cantidadEstanques)}
      </table>
    `;

    const obtenerTextoSiNo = (valor) => {
      if (valor === true || String(valor).toLowerCase() === "si" || String(valor).toLowerCase() === "true") {
        return "Sí, usa precría";
      }
      if (valor === false || String(valor).toLowerCase() === "no" || String(valor).toLowerCase() === "false") {
        return "No usa precria";
      }
      return String(valor ?? "No registrado");
    };

    const formatearListaEquipos = (lista) => {
      if (!lista || !Array.isArray(lista) || lista.length === 0) {
        return "Sin asignar";
      }

      return lista
        .map((item) => item.nombre || item.codigo || item.nombreEquipo || item.modelo || `Equipo #${item.id}`)
        .join(", ");
    };

    const htmlEstanques =
      estanquesFinca.length === 0
        ? "<p>No hay estanques registrados.</p>"
        : estanquesFinca
            .map((estanque, index) => {
              let filas = `
                ${filaTabla("Código", estanque.codigo)}
                ${filaTabla("Estado", estanque.estado)}
                ${filaTabla("Tipo", estanque.tipoEstanque)}
                ${filaTabla("Largo", `${estanque.largo} m`)}
                ${filaTabla("Ancho", `${estanque.ancho} m`)}
                ${filaTabla("Profundidad", `${estanque.profundidad} m`)}
                ${filaTabla("Fuente de agua", estanque.fuenteAgua)}
                ${filaTabla("Fecha de último mantenimiento", estanque.fechaMantenimiento ?? "No registrado")}
                ${filaTabla("Usa Precría", obtenerTextoSiNo(estanque.precria))}
                ${filaTabla("Total de equipos", estanque.cantidadEquipos ?? 0)}
                ${filaTabla("Equipos de Aireación", formatearListaEquipos(estanque?.equipos?.aireacion))}
                ${filaTabla("Equipos de Alimentación", formatearListaEquipos(estanque?.equipos?.alimentacion))}
                ${filaTabla("Equipos de Bombeo", formatearListaEquipos(estanque?.equipos?.bombeo))}
                ${filaTabla("Equipos de Mantenimiento", formatearListaEquipos(estanque?.equipos?.mantenimiento))}
                ${filaTabla("Equipos de Monitoreo", formatearListaEquipos(estanque?.equipos?.monitoreo))}
                ${filaTabla("Otros Equipos", formatearListaEquipos(estanque?.equipos?.otros))}
              `;

              return `
                <table style="width:100%; border-collapse:collapse; margin-bottom:16px; page-break-inside: avoid;" border="1" cellpadding="6">
                  <tr style="background-color:#1e3c6e; color:white;">
                    <th colspan="2" style="text-align:left; padding:6px;">Estanque ${index + 1}</th>
                  </tr>
                  ${filas}
                </table>
              `;
            })
            .join("");

    const html = `
      <html>
        <body style="font-family: Helvetica, Arial, sans-serif;">
          <h1 style="text-align:center;">REPORTE DE FINCA</h1>
          <hr />

          ${htmlTablaFinca}

          <h2>Estanques</h2>
          ${htmlEstanques}

          <br />
          <p style="font-size:10px;color:gray; text-align:center;">
            Generado desde la aplicación
          </p>
        </body>
      </html>
    `;

    const result = await Print.printToFileAsync({
      html,
      base64: true,
    });

    if (!result || !result.base64) {
      throw new Error("printToFileAsync no devolvió contenido en base64");
    }

    const nombreArchivo = `reporte_${finca.codigoCBO || "finca"}.pdf`;
    const nuevaRuta = `${FileSystem.documentDirectory}${nombreArchivo}`;

    await FileSystem.writeAsStringAsync(nuevaRuta, result.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const puedeCompartir = await Sharing.isAvailableAsync();

    if (!puedeCompartir) {
      throw new Error("Compartir archivos no está disponible en este dispositivo");
    }

    await Sharing.shareAsync(nuevaRuta, {
      mimeType: "application/pdf",
      dialogTitle: "Compartir reporte de finca",
      UTI: "com.adobe.pdf",
    });

    return nuevaRuta;
  } catch (error) {
    mostrarError("Error al generar el PDF de la finca");
    throw error;
  }
};