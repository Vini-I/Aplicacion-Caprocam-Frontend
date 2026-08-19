/**
 * ============================================================
 * HOOK USERALEOSCREEN
 * ============================================================
 *
 * Orquesta la pantalla principal del módulo de Raleo: estado del
 * formulario (useRaleo), validación, cálculo del porcentaje y de
 * la biomasa restante, guardado real del registro
 * (Raleo.service.js) y la alerta de feedback tras guardar.
 *
 * CAMBIO (documento de requerimientos): el cálculo se invirtió.
 *
 * Antes el usuario digitaba el porcentaje y el sistema derivaba la
 * biomasa restante:
 *     restante = biomasaActual x (1 - porcentaje / 100)
 *
 * Ahora el usuario digita los kilogramos retirados y el sistema
 * deriva las dos cosas que el documento pide guardar:
 *     porcentaje       = (kgRetirados / biomasaAntes) x 100
 *     biomasaRestante  = biomasaAntes - kgRetirados
 *
 * Ejemplo del documento: 2000 kg antes, 1000 kg retirados ->
 * 1000 / 2000 x 100 = 50 % de raleo, restante 1000 kg.
 *
 * Ambos valores calculados SI se persisten (el documento los lista
 * explícitamente entre los datos que se deben guardar). Antes la
 * biomasa restante se calculaba solo para mostrarla en pantalla y
 * nunca se enviaba al backend: se perdía en cada registro.
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
 *
 * Retorna:
 * - form, updateField: estado del formulario.
 * - porcentajeRaleo, biomasaRestante: valores calculados, listos
 *   para mostrarse como campos de solo lectura ("" si todavía no
 *   se puede calcular).
 * - submitted, errores: estado de validación.
 * - alerta: { visible, variant, mensaje }.
 * - handleGuardar(): valida y persiste el registro.
 *
 * Ejemplo:
 * const { form, updateField, handleGuardar, alerta } = useRaleoScreen();
 */

import { useEffect, useState } from "react";
import useRaleo from "./useRaleo";
import raleoService from "../services/Raleo.service";
import { useError } from "../../../shared/context/ErrorContext.js"

function convertirFecha(fecha) {
  const [dia, mes, anio] = fecha.split("/");
  return `${anio}-${mes}-${dia}`;
}

export function calcularRaleo(biomasaAntes, kgRetirados) {
  /*
  Descripcion:
  Aplica las dos formulas del documento de requerimientos.
  Se exporta para poder reusarla desde useEditarRaleo.js y para
  que el calculo viva en un solo lugar.

  Parametros:
  - biomasaAntes: Biomasa del estanque antes del raleo, en kg.
  - kgRetirados: Kilogramos retirados mediante el raleo.

  Retorna:
  - { porcentaje, biomasaRestante } como strings con 2 decimales,
    o ambos en "" si los datos todavia no permiten calcular.
  */
  const antes = Number(biomasaAntes);
  const retirados = Number(kgRetirados);

  const datosIncompletos =
    biomasaAntes === "" ||
    kgRetirados === "" ||
    Number.isNaN(antes) ||
    Number.isNaN(retirados) ||
    antes <= 0;

  if (datosIncompletos) {
    return { porcentaje: "", biomasaRestante: "" };
  }

  return {
    porcentaje: ((retirados / antes) * 100).toFixed(2),
    biomasaRestante: (antes - retirados).toFixed(2),
  };
}

export default function useRaleoScreen() {
  const { form, updateField, resetForm, validarForm } = useRaleo();
  const { mostrarError } = useError();
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });

  const { porcentaje: porcentajeRaleo, biomasaRestante } = calcularRaleo(
    form.biomasaAntes,
    form.kgRetirados
  );

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

  const handleGuardar = async () => {
    setSubmitted(true);
    const { valido, errores: erroresValidacion } = validarForm();
    setErrores(erroresValidacion);

    if (!valido) {
      setAlerta({ visible: true, variant: "danger", mensaje: "Rellenar campos obligatorios." });
      return;
    }

    try {
      //Se modifican los nombres para que queden como en backend
      const registro = {
        idFinca: form.finca,
        idEstanque: form.estanque,
        fecha: convertirFecha(form.fecha),
        biomasaEstimada: Number(form.biomasaAntes),
        kgRetirados: Number(form.kgRetirados),
        porcentaje: Number(porcentajeRaleo),
        biomasaRestante: Number(biomasaRestante),
        observaciones: form.observaciones?.trim()
          ? form.observaciones
          : "No se realizan observaciones",
      };
      await raleoService.create(registro);
      setAlerta({ visible: true, variant: "success", mensaje: "Raleo registrado correctamente" });
    } catch (error) {
      mostrarError(error);
    }
  };

  return {
    form,
    updateField,
    porcentajeRaleo,
    biomasaRestante,
    submitted,
    errores,
    alerta,
    handleGuardar,
  };
}
