/**
 * ============================================================
 * HOOK: useNuevoEstanque
 * ============================================================
 * Maneja la lógica del formulario para registrar un nuevo estanque.
 * - Carga la finca por `codigoCBO`.
 * - Normaliza valores numéricos.
 * - Valida datos usando `validarFormularioEstanque`.
 * - Expone `errores` y `displayErrorMessage` para la UI.
 */

import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { useEstanque } from "../context/EstanqueContext";
import { useFinca } from "../../finca/context/FincaContext";

import { getCurrentDate } from "../../../shared/utils/dateUtils";

import {
  validarFormularioEstanque,
  normalizarNumeroDecimal,
} from "./useEstanque";

export default function useNuevoEstanque({ navigation, codigoCBO }) {
  const router = useRouter();

  const { crearEstanque } = useEstanque();
  const { buscarFinca } = useFinca();

  const [finca, setFinca] = useState(null);

  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [tipoEstanque, setTipoEstanque] = useState("");
  
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [profundidad, setProfundidad] = useState("");
  const [fuenteAgua, setFuenteAgua] = useState("");

  const [fechaMantenimiento, setFechaMantenimiento] =
    useState(getCurrentDate());
  const [precria, setPrecria] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});

  const setLargoState = (valor) => setLargo(normalizarNumeroDecimal(valor));
  const setAnchoState = (valor) => setAncho(normalizarNumeroDecimal(valor));
  const setProfundidadState = (valor) => setProfundidad(normalizarNumeroDecimal(valor));

  async function obtenerFinca() {
    try {
      const data = await buscarFinca(codigoCBO);
      setFinca(data);
    } catch (error) {
      mostrarError(
        error.response?.data?.message ||
          error.message ||
          "No se pudo cargar la finca.",
      );
    }
  }

  useEffect(() => {
    obtenerFinca();
  }, []);

  function mostrarError(texto) {
    setTipoMensaje("danger");
    setMensaje(texto);
  }

  function validarFormulario() {
    setSubmitted(true);

    const resultado = validarFormularioEstanque({
    codigo,
    tipoEstanque,
    estado,
    largo,
    ancho,
    profundidad,
    fuenteAgua,
    fechaMantenimiento,
    precria,
  });

    if (resultado.valido === false) {
      setTipoMensaje(resultado.tipoMensaje);
      setMensaje(resultado.mensaje);
      setErrores(resultado.errores || {});
    }

    return resultado.valido;
  }

  async function registrarEstanque() {
    if (validarFormulario() === false) {
      return;
    }

    const NuevoEstanqueDTO = ({
      idFinca: finca.id,
      codigo: codigo.trim(),
      estado: estado,
      tipoEstanque: tipoEstanque,
      largo: Number(largo),
      ancho: Number(ancho),
      profundidad: Number(profundidad),
      fuenteAgua: fuenteAgua,
      fechaMantenimiento: fechaMantenimiento,
      precria: precria,
    });
    try {
      await crearEstanque(NuevoEstanqueDTO);
      router.push({
        pathname: `/finca/detalle?id=${finca.id}`,
      });
    } catch (error) {
      setTipoMensaje("danger");
      setMensaje(
        error.response?.data?.message || "Error al guardar los cambios.",
      );
    }
  }

  return {
    finca,

    codigo,    setCodigo,
    estado,    setEstado,
    tipoEstanque,    setTipoEstanque,
    largo,    setLargoState,
    ancho,    setAnchoState,
    profundidad,    setProfundidadState,
    fuenteAgua,    setFuenteAgua,

    fechaMantenimiento,    setFechaMantenimiento,
    precria,    setPrecria,

    mensaje,
    tipoMensaje,
    submitted,

    errores,
    registrarEstanque,
    // Mensaje único para mostrar en UI (validación o servidor)
    displayErrorMessage: mensaje || null,
    displayErrorVariant: tipoMensaje || null,
  };
}
