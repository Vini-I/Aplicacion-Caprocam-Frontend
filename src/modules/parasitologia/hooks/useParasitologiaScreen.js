/**
 * ============================================================
 * HOOK: PARASITOLOGIA SCREEN
 * ============================================================
 *
 * Centraliza el estado y la logica del formulario de
 * parasitologia para que la pantalla solo renderice la interfaz.
 */

import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import useParasitologia from "./useParasitologia";
import { STYLE } from "../../../theme/style";
import { getCurrentDate } from "../../../shared/utils/dateUtils";
import { calcularGradoInfeccion } from "../services/ParasitologiaService";
import { obtenerResponsableBackend } from "../../enfermedades/services/EnfermedadesService";
import {
  construirRegistroParasitologia,
  obtenerColorGrado,
  obtenerErroresFormularioParasitologia,
  obtenerOpcionesEstanques,
  obtenerOpcionesFincas,
  validarFormularioParasitologia,
} from "../services/ParasitologiaScreenService";
import { styles } from "../styles/ParasitologiaStyle";

export default function useParasitologiaScreen(onBack, navigation) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { loading, error, guardarRegistro } = useParasitologia();

  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(getCurrentDate());
  const [responsable, setResponsable] = useState("Cargando responsable...");
  const [parasito, setParasito] = useState("");
  const [camaronesMuestreados, setCamaronesMuestreados] = useState("0");
  const [camaronesInfectados, setCamaronesInfectados] = useState("0");
  const [observaciones, setObservaciones] = useState("");
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
    contentStyle.push(styles.contentTablet);
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

  const gradoCalculado = calcularGradoInfeccion(
    camaronesMuestreados,
    camaronesInfectados,
  );

  const colorGrado = obtenerColorGrado(gradoCalculado.grado);

  const datosFormulario = {
    finca: finca,
    estanque: estanque,
    fechaReporte: fechaReporte,
    parasito: parasito,
    camaronesMuestreados: camaronesMuestreados,
    camaronesInfectados: camaronesInfectados,
  };

  const erroresFormulario = obtenerErroresFormularioParasitologia(
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

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");
    setFechaReporte(getCurrentDate());
    setParasito("");
    setCamaronesMuestreados("0");
    setCamaronesInfectados("0");
    setObservaciones("");
    setSubmitted(false);
  }

  function validarFormulario() {
    setSubmitted(true);

    const resultado = validarFormularioParasitologia(datosFormulario);

    if (resultado.valido === false) {
      setTipoMensaje(resultado.tipoMensaje);
      setMensaje(resultado.mensaje);
    }

    return resultado.valido;
  }

  async function registrarParasitologia() {
    if (validarFormulario() === false) {
      return;
    }

    const nuevoRegistro = construirRegistroParasitologia({
      finca: finca,
      estanque: estanque,
      fechaReporte: fechaReporte,
      responsable: responsable,
      parasito: parasito,
      camaronesMuestreados: camaronesMuestreados,
      camaronesInfectados: camaronesInfectados,
      observaciones: observaciones,
    });

    const guardado = await guardarRegistro(nuevoRegistro);

    if (guardado === null) {
      setTipoMensaje("danger");
      setMensaje("No se pudo guardar el registro de parasitologia.");
      return;
    }

    setTipoMensaje("success");
    setMensaje("Registro de parasitologia guardado correctamente.");

    limpiarFormulario();
  }

  return {
    loading,
    error,
    finca,
    estanque,
    fechaReporte,
    responsable,
    parasito,
    camaronesMuestreados,
    camaronesInfectados,
    observaciones,
    mensaje,
    tipoMensaje,
    submitted,
    opcionesFincas,
    opcionesEstanques,
    gradoCalculado,
    colorGrado,
    erroresFormulario,
    contentStyle,
    gridStyle,
    itemStyle,
    itemFullStyle,
    setEstanque,
    setFechaReporte,
    setResponsable,
    setParasito,
    setCamaronesMuestreados,
    setCamaronesInfectados,
    setObservaciones,
    volver,
    cambiarFinca,
    registrarParasitologia,
  };
}