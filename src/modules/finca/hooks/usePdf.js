/**
 * ============================================================
 * HOOK DE GENERACIÓN DE PDF DE FINCAS
 * ============================================================
 *
 * Centraliza la lógica necesaria para generar el documento PDF
 * correspondiente al registro de una finca, administrando el
 * estado de carga durante el proceso de generación.
 *
 * Funcionalidad:
 * - Controla el estado de carga mientras se genera el PDF.
 * - Invoca el servicio encargado de construir el documento PDF.
 * - Recibe la información de la finca y sus estanques asociados.
 * - Maneja posibles errores durante la generación del documento.
 * - Expone una función reutilizable para generar el PDF desde
 *   cualquier pantalla del módulo.
 */

import { useState } from "react";
import { generarRegistroPDF } from "../services/fincaPDF";

export const usePdf = () => {
  const [loading, setLoading] = useState(false);

  const crearPDFFinca = async (finca, estanquesFinca = []) => {
    try {
      setLoading(true);
      await generarRegistroPDF(finca, estanquesFinca);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    crearPDFFinca,
    loading,
  };
};