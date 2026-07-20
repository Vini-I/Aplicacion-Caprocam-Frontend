/**
 * ============================================================
 * HOOK useTrazabilidad
 * ============================================================
 *
 * Descripción:
 * Centraliza el estado, validaciones y envío del formulario de
 * trazabilidad. La pantalla consumidora debe delegar la lógica a
 * este hook y mantener la presentación separada.
 *
 * Validaciones principales:
 * - Campos obligatorios: finca, estanques (origen/destino), fecha, colaborador, tamaño, dias, pl.
 * - Origen y destino no pueden coincidir.
 * - Valores numéricos deben ser mayores que 0.
 * - La fecha debe tener formato dd/mm/aaaa válido y no puede ser futura.
 *
 * Retorna:
 * - `formData`, `fincas`, `colaboradores`, `estanquesOrigen`, `estanquesDestino`,
 *   `plAutocompletado`, `mensajeError`, `submitted`, `mostrarAlerta` y handlers como
 *   `manejarCambio`, `manejarCambioFinca`, `manejarEnvio`.
 *
 * Restricciones:
 * - No realizar llamadas a la API directamente; usar los servicios del módulo.
 * - No implementar parseo/validación de fecha local; usar las utilidades
 *   compartidas de shared/utils/dateUtils.js.
 *  */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import { initialForm } from "../screens/TrazabilidadData";
import {
  obtenerEstanquesPorFinca,
  obtenerFincas,
  obtenerColaboradorSesion,
  obtenerColaboradorSesionActual,
  obtenerSiembraPorEstanque,
} from "../services/TrazabilidadServices";
import { crearRegistroTrazabilidad } from "../services/AgregarTrazabilidadService";
import { esFechaFutura, esFechaValida } from "../../../shared/utils/dateUtils";



export function useTrazabilidad() {
  const router = useRouter();

  const [colaboradorSesion, setColaboradorSesion] = useState(obtenerColaboradorSesion);

  const [formData, setFormData] = useState(() => ({
    ...initialForm,
    colaboradorId: colaboradorSesion.value,
  }));
  const [mensajeError, setMensajeError] = useState("");
  const [plAutocompletado, setPlAutocompletado] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [fincas, setFincas] = useState([]);

  const timerAlertaRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    };
  }, []);

  useEffect(() => {
    obtenerFincas().then(setFincas).catch(() => setFincas([]));
  }, []);

  // Resuelve el nombre real del colaborador de sesión contra la API
  // (el id ya es correcto desde el montaje, esto solo actualiza el label).
  useEffect(() => {
    let cancelado = false;
    obtenerColaboradorSesionActual().then((real) => {
      if (cancelado) return;
      setColaboradorSesion(real);
      setFormData((previousData) => ({ ...previousData, colaboradorId: real.value }));
    });
    return () => {
      cancelado = true;
    };
  }, []);

  const [estanquesOrigen, setEstanquesOrigen] = useState([]);
  const [estanquesDestino, setEstanquesDestino] = useState([]);

  useEffect(() => {
    let mounted = true;

    if (!formData.fincaId) {
      setEstanquesOrigen([]);
      setEstanquesDestino([]);
      return () => {
        mounted = false;
      };
    }

    obtenerEstanquesPorFinca(formData.fincaId)
      .then((lista) => {
        if (!mounted) return;
        setEstanquesOrigen(lista || []);
        setEstanquesDestino(lista || []);
      })
      .catch(() => {
        if (!mounted) return;
        setEstanquesOrigen([]);
        setEstanquesDestino([]);
      });

    return () => {
      mounted = false;
    };
  }, [formData.fincaId]);

  function manejarCambio(field, value) {
    if (field === "estanqueOrigenId") {
      const siembra = obtenerSiembraPorEstanque(value);

      setFormData((previousData) => ({
        ...previousData,
        [field]: value,
        pl: siembra ? String(siembra.cantidadSembrada ?? "") : "",
      }));

      setPlAutocompletado(Boolean(siembra));
      setMensajeError("");
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
    setMensajeError("");
  }

  function manejarCambioFinca(value) {
    setFormData((previousData) => ({
      ...previousData,
      fincaId: value,
      estanqueOrigenId: "",
      estanqueDestinoId: "",
      pl: "",
    }));

    setPlAutocompletado(false);
    setMensajeError("");
  }

  function obtenerCamposVacios() {
    const camposObligatorios = [
      "fincaId",
      "estanqueOrigenId",
      "estanqueDestinoId",
      "fecha",
      "colaboradorId",
      "tamaño",
      "dias",
      "pl",
    ];

    return camposObligatorios.filter(
      (campo) => String(formData[campo] ?? "").trim() === "",
    );
  }

  function validarFormulario() {
    if (obtenerCamposVacios().length > 0) {
      setMensajeError("Debe completar todos los campos para registrar el movimiento.");
      return false;
    }

    if (formData.estanqueOrigenId === formData.estanqueDestinoId) {
      setMensajeError("El estanque de origen no puede ser igual al estanque de destino.");
      return false;
    }

    if (Number(formData.tamaño) <= 0) {
      setMensajeError("El tamaño debe ser un número mayor a 0.");
      return false;
    }

    if (Number(formData.pl) <= 0) {
      setMensajeError("El campo PL debe ser un número mayor a 0.");
      return false;
    }

    if (Number(formData.dias) <= 0) {
      setMensajeError("Los días deben ser un número mayor a 0.");
      return false;
    }

    if (!esFechaValida(formData.fecha)) {
      setMensajeError("La fecha ingresada no es válida.");
      return false;
    }

    if (esFechaFutura(formData.fecha)) {
      setMensajeError("La fecha no puede ser futura.");
      return false;
    }

    return true;
  }

  async function manejarEnvio() {
    setSubmitted(true);

    const esValido = validarFormulario();

    if (!esValido) {
      return;
    }

    try {
      await crearRegistroTrazabilidad(formData);
    } catch (error) {
      const mensajeApi = error?.response?.data?.message;
      setMensajeError(
        error?.response?.status === 400 && mensajeApi
          ? mensajeApi
          : "No se pudo guardar el registro. Intenta de nuevo."
      );
      return;
    }
    setMensajeError("");
    setMostrarAlerta(true);

    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMostrarAlerta(false);
      timerAlertaRef.current = null;
      setFormData(initialForm);
      setSubmitted(false);
      router.back();
    }, 1500);
  }



  return {
    formData,
    fincas,
    colaboradorSesion,
    estanquesOrigen,
    estanquesDestino,
    plAutocompletado,
    mensajeError,
    submitted,
    mostrarAlerta,
    manejarCambio,
    manejarCambioFinca,
    manejarEnvio,
  };
}