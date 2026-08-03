/**
 * ============================================================
 * HOOK: useEditarEstanque
 * ============================================================
 * Maneja la lógica del formulario para editar un estanque.
 * - Carga el estanque original.
 * - Normaliza valores numéricos.
 * - Valida datos y expone `errores` y `displayErrorMessage`.
 */

import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { useEstanque } from "../context/EstanqueContext";
import { useFinca } from "../../finca/context/FincaContext";

import {
  validarFormularioEstanque,
  normalizarNumeroDecimal,
} from "./useEstanque";

export default function useEditarEstanque(codigoCBO, id) {
  const router = useRouter();

  const { buscarFinca } = useFinca();
  const { editarEstanque, buscarEstanque } = useEstanque();

  const [finca, setFinca] = useState(null);
  const [estanqueOriginal, setEstanqueOriginal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [tipoEstanque, setTipoEstanque] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [profundidad, setProfundidad] = useState("");
  const [fuenteAgua, setFuenteAgua] = useState("");
  const [fechaMantenimiento, setFechaMantenimiento] = useState("");
  const [precria, setPrecria] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});

  const setLargoState = (valor) => setLargo(normalizarNumeroDecimal(valor));
  const setAnchoState = (valor) => setAncho(normalizarNumeroDecimal(valor));
  const setProfundidadState = (valor) => setProfundidad(normalizarNumeroDecimal(valor));

  // Cargar el estanque original al iniciar el componente
  useEffect(() => {
    async function cargarEstanque() {
      try {
        setLoading(true);
        const data = await buscarEstanque(id);
        setEstanqueOriginal(data);

        setCodigo(data.codigo ?? "");
        setEstado(data.estado ?? "Activo");
        setTipoEstanque(data.tipoEstanque ?? "");
        setLargo(String(data.largo ?? ""));
        setAncho(String(data.ancho ?? ""));
        setProfundidad(String(data.profundidad ?? ""));
        setFuenteAgua(data.fuenteAgua ?? "");
        setFechaMantenimiento(data.fechaMantenimiento ?? "");
        const precriaUI = data.precria === true || data.precria === "si" ? "si" : "no";
        setPrecria(precriaUI);

      } catch (error) {
        setTipoMensaje("danger");
        setMensaje("No se pudo cargar el estanque");
     } finally {
        setLoading(false);
      }
    }

    if (id) {
      cargarEstanque();
    }
  }, [id]);

  // Función para obtener la finca asociada al código CBO
  async function obtenerFinca() {
    try {
      const data = await buscarFinca(codigoCBO);
      setFinca(data);
    } catch (error) {
      mostrarError(error);
    }
  }

  useEffect(() => {
    obtenerFinca();
  }, []);

  // Función para mostrar un mensaje de error
  function mostrarError(texto) {
    setTipoMensaje("warning");
    setMensaje(texto);
  }

  // Validar el formulario antes de guardar los cambios
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

  // Función para guardar los cambios del estanque
  async function guardarCambios() {
    if (validarFormulario() === false) {
      return;
    }

    const estanque = await buscarEstanque(id);

    const EstanqueEditadoDTO = {
      idFinca: estanqueOriginal.idFinca,
      codigo: codigo.trim(),
      estado: estado,
      tipoEstanque: tipoEstanque,
      largo: Number(largo),
      ancho: Number(ancho),
      profundidad: Number(profundidad),
      fuenteAgua: fuenteAgua,
      fechaMantenimiento: fechaMantenimiento,
      precria: precria,
    };

    try {
      await editarEstanque(id, EstanqueEditadoDTO);

      setTipoMensaje("success");
      setMensaje("Cambios guardados correctamente");

      router.push({
        pathname: `/finca/detalle?id=${estanque.idFinca}`,
      });
    } catch (error) {
      setTipoMensaje("danger");
      setMensaje(
        error.response?.data?.message || "Error al guardar los cambios",
      );
    }
  }


  return {
    finca,
    loading,
    estanqueOriginal,

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

    guardarCambios,
    errores,
    displayErrorMessage: mensaje || null,
    displayErrorVariant: tipoMensaje || null,

  };
}
