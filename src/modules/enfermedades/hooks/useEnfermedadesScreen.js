/**
 * ============================================================
 * HOOK: ENFERMEDADES SCREEN
 * ============================================================
 *
 * Centraliza el estado y la logica del formulario de
 * enfermedades para que la pantalla solo renderice la interfaz.
 */

import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import useEnfermedades from "./UseEnfermedades";
import { getCurrentDate } from "../../../shared/utils/dateUtils";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/EnfermedadesStyle";
import { obtenerResponsableBackend } from "../services/EnfermedadesService";
import {
  actualizarSeleccionEnfermedad,
  construirCasoEnfermedad,
  obtenerErroresFormularioEnfermedad,
  obtenerOpcionesEstanques,
  obtenerOpcionesFincas,
  validarFormularioEnfermedad,
} from "../services/EnfermedadesScreenService";

export default function useEnfermedadesScreen(onBack, navigation) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { loading, error, guardarEnfermedad } = useEnfermedades();

  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(getCurrentDate());
  const [responsable, setResponsable] = useState("Cargando responsable...");
  const [enfermedadesSeleccionadas, setEnfermedadesSeleccionadas] = useState(
    [],
  );
  const [severidad, setSeveridad] = useState("");
  const [mortalidad, setMortalidad] = useState("0");
  const [reporte, setReporte] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [submitted, setSubmitted] = useState(false);

  let esTablet = false;
  let esDesktop = false;

  if (width >= 768) {
    esTablet = true;
  }

  if (width >= 1024) {
    esDesktop = true;
  }

  const contentStyle = [STYLE.contentWrapper, styles.content];
  const gridStyle = [styles.grid];
  const itemStyle = [styles.gridItem];
  const itemFullStyle = [styles.gridItem];

  if (esTablet === true) {
    gridStyle.push(styles.gridTablet);
    itemStyle.push(styles.gridItemTablet);
    itemFullStyle.push(styles.gridItemFull);
  }

  if (esDesktop === true) {
    contentStyle.push(styles.contentDesktop);
    gridStyle.push(styles.gridDesktop);
    itemStyle.push(styles.gridItemDesktop);
    itemFullStyle.push(styles.gridItemFull);
  }

  const opcionesFincas = obtenerOpcionesFincas();
  const opcionesEstanques = obtenerOpcionesEstanques(finca);

  const datosFormulario = {
    finca: finca,
    estanque: estanque,
    enfermedadesSeleccionadas: enfermedadesSeleccionadas,
    severidad: severidad,
    mortalidad: mortalidad,
    reporte: reporte,
  };

  const erroresFormulario = obtenerErroresFormularioEnfermedad(
    datosFormulario,
    submitted,
  );

  useEffect(function () {
    let activo = true;

    async function cargarResponsable() {
      const responsableBackend = await obtenerResponsableBackend();

      if (activo === true) {
        setResponsable(responsableBackend);
      }
    }

    cargarResponsable();

    return function () {
      activo = false;
    };
  }, []);

  function volver() {
    if (onBack) {
      onBack();
      return;
    }

    if (navigation) {
      navigation.goBack();
      return;
    }

    router.back();
  }

  function cambiarFinca(valor) {
    setFinca(valor);
    setEstanque("");
  }

  function cambiarEnfermedad(valor) {
    const nuevasEnfermedades = actualizarSeleccionEnfermedad(
      valor,
      enfermedadesSeleccionadas,
    );

    setEnfermedadesSeleccionadas(nuevasEnfermedades);
  }

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");
    setFechaReporte(getCurrentDate());
    setEnfermedadesSeleccionadas([]);
    setSeveridad("");
    setMortalidad("0");
    setReporte("");
    setSubmitted(false);
  }

  function validarFormulario() {
    setSubmitted(true);

    const resultado = validarFormularioEnfermedad(datosFormulario);

    if (resultado.valido === false) {
      setTipoMensaje(resultado.tipoMensaje);
      setMensaje(resultado.mensaje);
    }

    return resultado.valido;
  }

  async function registrarEnfermedad() {
    if (validarFormulario() === false) {
      return;
    }

    const nuevoCaso = construirCasoEnfermedad({
      finca: finca,
      estanque: estanque,
      fechaReporte: fechaReporte,
      responsable: responsable,
      enfermedadesSeleccionadas: enfermedadesSeleccionadas,
      severidad: severidad,
      mortalidad: mortalidad,
      reporte: reporte,
    });

    const guardado = await guardarEnfermedad(nuevoCaso);

    if (guardado === null) {
      setTipoMensaje("danger");
      setMensaje("No se pudo guardar la enfermedad.");
      return;
    }

    setTipoMensaje("success");
    setMensaje("Enfermedad registrada correctamente.");

    limpiarFormulario();
  }

  return {
    loading,
    error,
    finca,
    estanque,
    fechaReporte,
    responsable,
    enfermedadesSeleccionadas,
    severidad,
    mortalidad,
    reporte,
    mensaje,
    tipoMensaje,
    submitted,
    opcionesFincas,
    opcionesEstanques,
    erroresFormulario,
    contentStyle,
    gridStyle,
    itemStyle,
    itemFullStyle,
    setEstanque,
    setFechaReporte,
    setResponsable,
    setSeveridad,
    setMortalidad,
    setReporte,
    volver,
    cambiarFinca,
    cambiarEnfermedad,
    registrarEnfermedad,
  };
}