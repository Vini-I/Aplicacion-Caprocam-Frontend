/**
 * ============================================================
 * HOOK useTrazabilidad
 * ============================================================
 *
 * Descripción:
 * Centraliza el estado, validaciones y envío del formulario de trazabilidad.
 *
 * @dependencies TrazabilidadServices, AgregarTrazabilidadService, dateUtils
 * @validations Campos obligatorios, origen!=destino, números mayores a 0 y fecha válida.
 * @navigation N/A
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import { initialForm } from "../screens/TrazabilidadData";
import {
  obtenerEstanquesPreCriaPorFinca,
  obtenerEstanquesEngordePorFinca,
  obtenerFincas,
  obtenerColaboradorSesion,
  obtenerSiembraActivaPorEstanque,
} from "../services/TrazabilidadServices";
import { crearRegistroTrazabilidad } from "../services/AgregarTrazabilidadService";
import { esFechaFutura, esFechaValida } from "../../../shared/utils/dateUtils";

export function useTrazabilidad() {
  const router = useRouter();
  const [colaboradorSesion, setColaboradorSesion] = useState(() => obtenerColaboradorSesion());

  const [formData, setFormData] = useState(() => ({
    ...initialForm,
    colaboradorId: colaboradorSesion.colaboradorId ?? null,
  }));
  const [mensajeError, setMensajeError] = useState("");
  const [plAutocompletado, setPlAutocompletado] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fincas, setFincas] = useState([]);

  const [errorCarga, setErrorCarga] = useState("");
  const [sesionExpirada, setSesionExpirada] = useState(false);

  function mostrarErrorCarga(mensaje, error) {
    if (error?.response?.status === 401) {
      setSesionExpirada(true);
      setErrorCarga("Tu sesión expiró. Debes iniciar sesión de nuevo.");
      return;
    }
    setSesionExpirada(false);
    setErrorCarga(mensaje);
  }

  function cerrarErrorCarga() {
    setErrorCarga("");
    setSesionExpirada(false);
  }

  function irALogin() {
    cerrarErrorCarga();
    router.replace("/login");
  }

  const timerErrorRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerErrorRef.current) clearTimeout(timerErrorRef.current);
    };
  }, []);

  useEffect(() => {
    obtenerFincas()
      .then(setFincas)
      .catch((error) => {
        setFincas([]);
        mostrarErrorCarga("No se pudieron cargar las fincas.", error);
      });
  }, []);

  // Resuelve el nombre/datos reales de la sesión actual (usuario o colaborador)
  useEffect(() => {
    let cancelado = false;
    obtenerColaboradorSesion(true).then((real) => {
      if (cancelado) return;
      setColaboradorSesion(real);
      setFormData((previousData) => ({ ...previousData, colaboradorId: real.colaboradorId ?? null }));
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

    Promise.all([
      obtenerEstanquesPreCriaPorFinca(formData.fincaId),
      obtenerEstanquesEngordePorFinca(formData.fincaId),
    ])
      .then(([listaOrigen, listaDestino]) => {
        if (!mounted) return;
        setEstanquesOrigen(listaOrigen || []);
        setEstanquesDestino(listaDestino || []);
      })
      .catch((error) => {
        if (!mounted) return;
        setEstanquesOrigen([]);
        setEstanquesDestino([]);
        mostrarErrorCarga("No se pudieron cargar los estanques de la finca seleccionada.", error);
      });
    return () => {
      mounted = false;
    };
  }, [formData.fincaId]);

  // Evita que la respuesta de una consulta vieja (usuario cambió de
  // estanque rápido) sobrescriba el pl/dias del estanque seleccionado
  // actualmente.
  const siembraRequestIdRef = useRef(0);

  function manejarCambio(field, value) {
    if (field === "estanqueOrigenId") {
      setFormData((previousData) => ({
        ...previousData,
        [field]: value,
      }));
      setMensajeError("");
      if (timerErrorRef.current) {
        clearTimeout(timerErrorRef.current);
        timerErrorRef.current = null;
      }

      const requestId = ++siembraRequestIdRef.current;

      obtenerSiembraActivaPorEstanque(value).then((siembra) => {
        if (siembraRequestIdRef.current !== requestId) return; // respuesta obsoleta

        setFormData((previousData) => ({
          ...previousData,
          pl: siembra ? String(siembra.pl_siembra ?? "") : "",
          dias: siembra ? String(siembra.dias ?? "") : "",
        }));
        setPlAutocompletado(Boolean(siembra));
      });
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
    setMensajeError("");
    if (timerErrorRef.current) {
      clearTimeout(timerErrorRef.current);
      timerErrorRef.current = null;
    }
  }

  function manejarCambioFinca(value) {
    siembraRequestIdRef.current += 1; // invalida cualquier consulta de siembra en vuelo

    setFormData((previousData) => ({
      ...previousData,
      fincaId: value,
      estanqueOrigenId: "",
      estanqueDestinoId: "",
      pl: "",
      dias: "",
    }));

    setPlAutocompletado(false);
    setMensajeError("");
    if (timerErrorRef.current) {
      clearTimeout(timerErrorRef.current);
      timerErrorRef.current = null;
    }
  }

  function obtenerCamposVacios() {
    const camposObligatorios = [
      "fincaId",
      "estanqueOrigenId",
      "estanqueDestinoId",
      "fecha",
      "tamaño",
      "dias",
      "pl",
    ];

    return camposObligatorios.filter(
      (campo) => String(formData[campo] ?? "").trim() === "",
    );
  }

  function validarFormulario() {
    const mensaje =
      obtenerCamposVacios().length > 0
        ? "Debe completar todos los campos para registrar el movimiento."
        : formData.estanqueOrigenId === formData.estanqueDestinoId
          ? "El estanque de origen no puede ser igual al estanque de destino."
          : Number(formData.tamaño) <= 0
            ? "El tamaño debe ser un número mayor a 0."
            : Number(formData.pl) <= 0
              ? "El campo PL debe ser un número mayor a 0."
              : Number(formData.dias) <= 0
                ? "Los días deben ser un número mayor a 0."
                : !esFechaValida(formData.fecha)
                  ? "La fecha ingresada no es válida."
                  : esFechaFutura(formData.fecha)
                    ? "La fecha no puede ser futura."
                    : "";

    if (mensaje) {
      setMensajeError(mensaje);
      if (timerErrorRef.current) clearTimeout(timerErrorRef.current);
      timerErrorRef.current = setTimeout(() => {
        setMensajeError("");
        timerErrorRef.current = null;
      }, 6000);
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
      if (error?.response?.status === 401) {
        mostrarErrorCarga("", error);
        return;
      }
      const mensajeApi = error?.response?.data?.message;
      setMensajeError(
        error?.response?.status === 400 && mensajeApi
          ? mensajeApi
          : "No se pudo guardar el registro. Intenta de nuevo."
      );
      return;
    }
    setMensajeError("");
    setFormData(initialForm);
    setSubmitted(false);
    setPlAutocompletado(false);
    router.replace({ pathname: "/trazabilidad", params: { successMessage: "¡Movimiento registrado exitosamente!" } });
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
    manejarCambio,
    manejarCambioFinca,
    manejarEnvio,
    errorCarga,
    sesionExpirada,
    cerrarErrorCarga,
    irALogin,
  };
}