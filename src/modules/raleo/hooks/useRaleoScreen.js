/**
 * ============================================================
 * HOOK USERALEOSCREEN
 * ============================================================
 *
 * Orquesta la pantalla principal del módulo de Raleo: estado del
 * formulario (useRaleo), validación, guardado real del registro
 * (Raleo.service.js) y la alerta de feedback tras guardar. Antes
 * vivía como lógica inline dentro de RaleoScreen.jsx; se extrajo
 * aquí para seguir el mismo patrón de separación de hooks que
 * useAlimentacionScreen.js / useDensidadPoblacional.js.
 *
 * Funcionalidad:
 * - alerta.visible se mantiene 3s si es "success" y 6s si es
 *   "danger" antes de ocultarse (estándar de duración de alerts
 *   de error en formularios).
 * - Al ocultarse una alerta de éxito, se limpia el formulario,
 *   sin navegar fuera del módulo, para permitir registrar varios
 *   raleos seguidos sin salir de la pantalla.
 * - `observaciones` no es obligatorio: si el usuario no escribe
 *   nada, se completa con "No se realizan observaciones" antes de
 *   persistir el registro.
 * - Los errores que devuelve el backend al guardar se propagan
 *   con throw para que RaleoScreen.jsx los muestre con el
 *   ModalError global (useError().mostrarError), igual que antes.
 *
 * Retorna:
 * - form, updateField, biomasaRestante: estado del formulario.
 * - submitted, errores: estado de validación.
 * - alerta: { visible, variant, mensaje }.
 * - handleGuardar(onError): valida y persiste el registro; si el
 *   guardado falla, llama a onError(error) en vez de manejarlo.
 *
 * Ejemplo:
 * const { form, updateField, handleGuardar, alerta } = useRaleoScreen();
 * handleGuardar(mostrarError);
 */

import { useEffect, useState } from "react";
import useRaleo from "./useRaleo";
import raleoService from "../services/Raleo.service";

function convertirFecha(fecha) {
  const [dia, mes, anio] = fecha.split("/");
  return `${anio}-${mes}-${dia}`;
}

export default function useRaleoScreen() {
  const { form, updateField, resetForm, validarForm } = useRaleo();
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });

  const biomasaActual = Number(form.biomasaActual);
  const porcentaje = Number(form.porcentajeRaleo);

  const biomasaRestante =
    form.biomasaActual !== "" && form.porcentajeRaleo !== ""
      ? biomasaActual * (1 - porcentaje / 100)
      : "";

  useEffect(() => {
    if (!alerta.visible) return;

    const duracion = alerta.variant === "success" ? 3000 : 6000;

    const timer = setTimeout(() => {
      if (alerta.variant === "success") {
        resetForm();
        setSubmitted(false);
        setErrores({});
      }
      setAlerta((prev) => ({ ...prev, visible: false }));
    }, duracion);

    return () => clearTimeout(timer);
  }, [alerta.visible, alerta.variant]);

  const handleGuardar = async (onError) => {
    setSubmitted(true);
    const { valido, errores: erroresValidacion } = validarForm();
    setErrores(erroresValidacion);

    if (!valido) {
      setAlerta({ visible: true, variant: "danger", mensaje: "Rellenar campos obligatorios." });
      return;
    }

    try {
      const registro = {
        idFinca: form.finca,
        idEstanque: form.estanque,
        fecha: convertirFecha(form.fecha),
        porcentaje: Number(form.porcentajeRaleo),
        pesoEstimado: Number(form.pesoPromedio),
        biomasaEstimado: Number(form.biomasaActual),
        objetivo: form.objetivo,
        metodo: form.metodo,
        observaciones: form.observaciones?.trim()
          ? form.observaciones
          : "No se realizan observaciones",
      };
      await raleoService.create(registro);
      setAlerta({ visible: true, variant: "success", mensaje: "Raleo registrado correctamente" });
    } catch (error) {
      onError?.(error);
    }
  };

  return {
    form,
    updateField,
    biomasaRestante,
    submitted,
    errores,
    alerta,
    handleGuardar,
  };
}
