/**
 * ============================================================
 * HOOK: PARASITOLOGIA SCREEN
 * ============================================================
 *
 * Centraliza el estado y la logica del formulario.
 */

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useWindowDimensions,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import useParasitologia from
  "./useParasitologia";

import { fincaService } from
  "../../finca/services/finca.service.js";

import { estanqueService } from
  "../../estanques/services/estanque.service.js";

import { STYLE } from
  "../../../theme/style";

import { getCurrentDate } from
  "../../../shared/utils/dateUtils";

import {
  calcularGradoInfeccion,
  obtenerResponsableSesion,
} from "../services/ParasitologiaService";

import {
  construirRegistroParasitologia,
  obtenerColorGrado,
  obtenerErroresFormularioParasitologia,
  obtenerOpcionesEstanques,
  obtenerOpcionesFincas,
  validarFormularioParasitologia,
} from "../services/ParasitologiaScreenService";

import { styles } from
  "../styles/ParasitologiaStyle";

export default function useParasitologiaScreen(
  onBack,
  navigation,
) {
  const router = useRouter();

  const { width } =
    useWindowDimensions();

  const {
    loading: loadingParasitologia,
    error: errorParasitologia,
    catalogoParasitos,
    guardarRegistro,
  } = useParasitologia();

  const [
    fincas,
    setFincas,
  ] = useState([]);

  const [
    estanques,
    setEstanques,
  ] = useState([]);

  const [
    loadingOpciones,
    setLoadingOpciones,
  ] = useState(true);

  const [
    errorOpciones,
    setErrorOpciones,
  ] = useState("");

  const [
    finca,
    setFinca,
  ] = useState("");

  const [
    estanque,
    setEstanque,
  ] = useState("");

  const [
    fechaReporte,
    setFechaReporte,
  ] = useState(
    getCurrentDate(),
  );

  const [
    responsable,
    setResponsable,
  ] = useState(
    obtenerResponsableSesion(),
  );

  const [
    parasito,
    setParasito,
  ] = useState("");

  const [
    camaronesMuestreados,
    setCamaronesMuestreados,
  ] = useState("0");

  const [
    camaronesInfectados,
    setCamaronesInfectados,
  ] = useState("0");

  const [
    observaciones,
    setObservaciones,
  ] = useState("");

  const [
    mensaje,
    setMensaje,
  ] = useState("");

  const [
    tipoMensaje,
    setTipoMensaje,
  ] = useState("info");

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  let esTablet = false;
  let esDesktop = false;

  if (width >= 768) {
    esTablet = true;
  }

  if (width >= 1024) {
    esDesktop = true;
  }

  const contentStyle = [
    STYLE.contentWrapper,
    styles.content,
  ];

  const gridStyle = [
    styles.grid,
  ];

  const itemStyle = [
    styles.gridItem,
  ];

  const itemFullStyle = [
    styles.gridItem,
  ];

  if (esTablet === true) {
    contentStyle.push(
      styles.contentTablet,
    );

    gridStyle.push(
      styles.gridTablet,
    );

    itemStyle.push(
      styles.gridItemTablet,
    );

    itemFullStyle.push(
      styles.gridItemFull,
    );
  }

  if (esDesktop === true) {
    contentStyle.push(
      styles.contentDesktop,
    );

    gridStyle.push(
      styles.gridDesktop,
    );

    itemStyle.push(
      styles.gridItemDesktop,
    );

    itemFullStyle.push(
      styles.gridItemFull,
    );
  }

  const opcionesFincas = useMemo(
    function () {
      return obtenerOpcionesFincas(
        fincas,
      );
    },
    [
      fincas,
    ],
  );

  const opcionesEstanques = useMemo(
    function () {
      return obtenerOpcionesEstanques(
        estanques,
        finca,
      );
    },
    [
      estanques,
      finca,
    ],
  );

  const gradoCalculado =
    calcularGradoInfeccion(
      camaronesMuestreados,
      camaronesInfectados,
    );

  const colorGrado =
    obtenerColorGrado(
      gradoCalculado.grado,
    );

  const datosFormulario = {
    finca: finca,
    estanque: estanque,
    fechaReporte: fechaReporte,
    parasito: parasito,
    camaronesMuestreados:
      camaronesMuestreados,
    camaronesInfectados:
      camaronesInfectados,
  };

  const erroresFormulario =
    obtenerErroresFormularioParasitologia(
      datosFormulario,
      submitted,
    );

  let loading =
    loadingParasitologia;

  if (loadingOpciones === true) {
    loading = true;
  }

  let error =
    errorParasitologia;

  if (
    error === "" &&
    errorOpciones !== ""
  ) {
    error = errorOpciones;
  }

  let placeholderFinca =
    "Seleccione la finca";

  if (
    loadingOpciones === false &&
    opcionesFincas.length === 0
  ) {
    placeholderFinca =
      "No se encuentran opciones o valores";
  }

  let placeholderEstanque =
    "Seleccione el estanque";

  if (
    finca !== "" &&
    opcionesEstanques.length === 0
  ) {
    placeholderEstanque =
      "No se encuentran opciones o valores";
  }

  let placeholderParasito =
    "Seleccione el parasito";

  if (
    catalogoParasitos.length === 0
  ) {
    placeholderParasito =
      "No se encuentran opciones o valores";
  }

  useEffect(
    function () {
      let activo = true;

      async function cargarOpciones() {
        setLoadingOpciones(true);
        setErrorOpciones("");

        try {
          const respuestas =
            await Promise.all([
              fincaService.getFincas(),
              estanqueService
                .getEstanques(),
            ]);

          if (activo === true) {
            if (
              Array.isArray(
                respuestas[0],
              )
            ) {
              setFincas(
                respuestas[0],
              );
            } else {
              setFincas([]);
            }

            if (
              Array.isArray(
                respuestas[1],
              )
            ) {
              setEstanques(
                respuestas[1],
              );
            } else {
              setEstanques([]);
            }
          }
        } catch {
          if (activo === true) {
            setErrorOpciones(
              "No se pudieron cargar las fincas y estanques.",
            );
          }
        } finally {
          if (activo === true) {
            setLoadingOpciones(false);
          }
        }
      }

      setResponsable(
        obtenerResponsableSesion(),
      );

      cargarOpciones();

      return function () {
        activo = false;
      };
    },
    [],
  );

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
    setMensaje("");
  }

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");

    setFechaReporte(
      getCurrentDate(),
    );

    setParasito("");

    setCamaronesMuestreados(
      "0",
    );

    setCamaronesInfectados(
      "0",
    );

    setObservaciones("");
    setSubmitted(false);
  }

  function validarFormulario() {
    setSubmitted(true);

    const resultado =
      validarFormularioParasitologia(
        datosFormulario,
      );

    if (
      resultado.valido === false
    ) {
      setTipoMensaje(
        resultado.tipoMensaje,
      );

      setMensaje(
        resultado.mensaje,
      );
    }

    return resultado.valido;
  }

  async function registrarParasitologia() {
    setMensaje("");

    if (
      validarFormulario() === false
    ) {
      return;
    }

    const nuevoRegistro =
      construirRegistroParasitologia({
        finca: finca,
        estanque: estanque,
        fechaReporte: fechaReporte,
        parasito: parasito,
        camaronesMuestreados:
          camaronesMuestreados,
        camaronesInfectados:
          camaronesInfectados,
        observaciones:
          observaciones,
      });

    const guardado =
      await guardarRegistro(
        nuevoRegistro,
      );

    if (guardado === null) {
      setTipoMensaje("danger");

      setMensaje(
        "No se pudo guardar el registro de parasitologia.",
      );

      return;
    }

    setTipoMensaje("success");

    setMensaje(
      "Registro de parasitologia guardado correctamente.",
    );

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
    opcionesParasitos:
      catalogoParasitos,

    placeholderFinca,
    placeholderEstanque,
    placeholderParasito,

    gradoCalculado,
    colorGrado,
    erroresFormulario,

    contentStyle,
    gridStyle,
    itemStyle,
    itemFullStyle,

    setEstanque,
    setFechaReporte,
    setParasito,
    setCamaronesMuestreados,
    setCamaronesInfectados,
    setObservaciones,

    volver,
    cambiarFinca,
    registrarParasitologia,
  };
}