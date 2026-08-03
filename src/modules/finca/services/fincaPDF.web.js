// Esta versión SOLO se carga cuando la app corre en navegador (web).
// Genera el PDF con texto real usando jsPDF, y usa jspdf-autotable
// para dibujar tablas reales en vez de texto suelto línea por línea.
//
// - Los datos generales de la finca van en UNA tabla de 2 columnas
//   (etiqueta / valor).
// - Cada estanque tiene su PROPIA tabla de 2 columnas (campo / valor),
//   apiladas una tras otra.

import jsPDF from "jspdf/dist/jspdf.es.min.js";
import autoTable from "jspdf-autotable";
import { useError } from "../../../shared/context/ErrorContext";

export const generarRegistroPDF = (finca, estanquesFinca = []) => {
  function formatearListaEquipos(lista) {
    if (!lista || !Array.isArray(lista) || lista.length === 0) {
      return "Sin asignar";
    }
    return lista
      .map(
        (item) =>
          item.nombre ||
          item.codigo ||
          item.nombreEquipo ||
          item.modelo ||
          `Equipo #${item.id}`,
      )
      .join(", ");
  }

  function obtenerTextoSiNo(valor) {
    let texto = "No usa precria";
    const normalizado = String(valor || "")
      .trim()
      .toLowerCase();

    if (normalizado === "si" || normalizado === "true" || normalizado === "1") {
      texto = "Sí, usa precria";
    }

    return texto;
  }

  try {
    const doc = new jsPDF();

    const margenIzq = 14;
    let y = 20;

    //Título principal
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("REPORTE DE FINCA", 105, y, { align: "center" });
    y += 6;
    doc.setLineWidth(0.5);
    doc.line(margenIzq, y, 196, y);
    y += 8;

    const cantidadEstanques = estanquesFinca.length;

    //Tabla de datos generales de la finca
    const filasFinca = [
      ["Nombre", finca.nombreFinca],
      ["Código", finca.codigoCBO],
      ["Provincia", finca.provincia],
      ["Cantón", finca.canton],
      ["Distrito", finca.distrito],
      ["Responsable", finca.propietarioResponsable],
      ["Teléfonos", (finca.telefonoParse || []).join(", ")],
      ["Área total", `${finca.areaTotal}`],
      ["Espejo de agua", `${finca.espejosAgua}`],
      ["Cantidad de estanques", `${cantidadEstanques}`],
    ];

    autoTable(doc, {
      startY: y,
      head: [["Datos de la finca", ""]],
      body: filasFinca,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [40, 90, 60],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 50 },
        1: { cellWidth: "auto" },
      },
      margin: { left: margenIzq, right: 14 },
    });

    // jspdf-autotable actualiza esta propiedad con la posición Y
    // donde terminó de dibujar, para que sepamos dónde seguir.
    y = doc.lastAutoTable.finalY + 10;

    //Sección de estanques
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Estanques", margenIzq, y);
    y += 6;

    if (estanquesFinca.length === 0) {
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text("No hay estanques registrados.", margenIzq, y);
      y += 10;
    } else {
      estanquesFinca.forEach((estanque, index) => {
        // Si no queda suficiente espacio para empezar una ficha nueva
        // de estanque, saltamos de página antes de dibujarla.
        if (y > 230) {
          doc.addPage();
          y = 20;
        }

        const filasEstanque = [
          ["Código", estanque.codigo],
          ["Estado", estanque.estado],
          ["Tipo", estanque.tipoEstanque],
          ["Largo", `${estanque.largo} m`],
          ["Ancho", `${estanque.ancho} m`],
          ["Profundidad", `${estanque.profundidad} m`],
          ["Fuente de agua", estanque.fuenteAgua],
          [
            "Fecha de último mantenimiento",
            estanque.fechaMantenimiento ?? "No registrado",
          ],
          ["Usa Precría", obtenerTextoSiNo(estanque.precria)],
          ["Total de equipos", String(estanque.cantidadEquipos ?? 0)],
          ["Equipos de Aireación", formatearListaEquipos(estanque?.equipos?.aireacion)],
          [
            "Equipos de Alimentación",
            formatearListaEquipos(estanque?.equipos?.alimentacion),
          ],
          ["Equipos de Bombeo", formatearListaEquipos(estanque?.equipos?.bombeo)],
          [
            "Equipos de Mantenimiento",
            formatearListaEquipos(estanque?.equipos?.mantenimiento),
          ],
          ["Equipos de Monitoreo", formatearListaEquipos(estanque?.equipos?.monitoreo)],
          ["Otros Equipos", formatearListaEquipos(estanque?.equipos?.otros)],
        ];

        autoTable(doc, {
          startY: y,
          head: [[`Estanque ${index + 1}`, ""]],
          body: filasEstanque,
          theme: "grid",
          styles: { fontSize: 9, cellPadding: 2.5 },
          headStyles: {
            fillColor: [30, 60, 110],
            textColor: 255,
            fontStyle: "bold",
          },
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: 55 },
            1: { cellWidth: "auto" },
          },
          margin: { left: margenIzq, right: 14 },
        });

        y = doc.lastAutoTable.finalY + 8;
      });
    }

    //Pie de página
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Generado desde la aplicación", 105, y, { align: "center" });

    doc.save(`Reporte_${finca.codigoCBO || "finca"}.pdf`);

    return null;
  } catch (error) {
    const { mostrarError } = useError();
    mostrarError("Error al generar el PDF de la finca");
    throw error;
  }
};
