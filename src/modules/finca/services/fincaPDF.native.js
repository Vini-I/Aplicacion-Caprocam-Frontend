// Esta versión SOLO se carga cuando la app corre en iOS/Android.
// En vez de dejar que expo-print guarde el PDF en su propia carpeta
// de caché interna (que Expo Go en Android a veces no deja leer ni
// copiar para compartir), le pedimos el PDF en base64 y lo escribimos
// nosotros mismos en el directorio de documentos de la app, que sí
// es accesible para expo-sharing.

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

export const generarRegistroPDF = async (finca, estanquesFinca = []) => {
  try {
    const filaTabla = (etiqueta, valor) => `
      <tr>
        <td style="font-weight:bold; width:40%;">${etiqueta}</td>
        <td>${valor ?? ""}</td>
      </tr>
    `;

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
        ${filaTabla("Cantidad de estanques", finca.estanques)}
      </table>
    `;

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
                ${filaTabla("Especie", estanque.especie)}
                ${filaTabla("Fecha de siembra", estanque.fechaSiembra)}
              `;

              if (estanque.fechaInicioEngorde) {
                filas += filaTabla("Inicio de engorde", estanque.fechaInicioEngorde);
              }

              filas += `
                ${filaTabla("Último mantenimiento", estanque.fechaMantenimiento)}
                ${filaTabla("Densidad de siembra", estanque.densidadSiembra)}
                ${filaTabla("Precría", estanque.precria)}
                ${filaTabla("Método de alimentación", estanque.metodoAlimentacion)}
                ${filaTabla("Proveedor de alimento", estanque.proveedorAlimento)}
                ${filaTabla("Aireadores", estanque.numeroAireadores)}
                ${filaTabla("Alimentador automático", estanque.tieneAlimentadorAutomatico)}
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
    console.log("Error generando PDF (móvil):", error);
    throw error;
  }
};