/**
 * ============================================================
 * HOOK: useEnfermedadesScreen
 * ============================================================
 *
 * Descripcion:
 * Maneja el estado, validaciones y CRUD del modulo
 * Enfermedades.
 *
 * Integracion:
 * - Fincas reales desde backend y respaldo temporal.
 * - Estanques reales desde backend y respaldo temporal.
 * - Catalogos desde backend.
 * - Registros desde backend.
 * - Crear, actualizar y eliminar mediante Axios.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "expo-router";

import {
  actualizarEnfermedad,
  crearEnfermedad,
  eliminarEnfermedad,
  obtenerCatalogoEnfermedades,
  obtenerCatalogoSeveridades,
  obtenerEnfermedades,
  obtenerMensajeError,
  obtenerOpcionesEstanques,
  obtenerOpcionesFincas,
} from "../services/EnfermedadesService";

/*
============================================================
FUNCIONES INTERNAS
============================================================
*/

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return dia + "/" + mes + "/" + anio;
}

function obtenerNombreOpcion(
  opciones,
  valor,
  respaldo,
) {
  if (Array.isArray(opciones) === false) {
    return respaldo;
  }

  for (let i = 0; i < opciones.length; i++) {
    if (
      String(opciones[i].value) ===
      String(valor)
    ) {
      return opciones[i].label;
    }
  }

  return respaldo;
}

function esNumeroNoNegativo(valor) {
  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ""
  ) {
    return true;
  }

  const numero = Number(valor);

  if (Number.isNaN(numero) === true) {
    return false;
  }

  if (numero < 0) {
    return false;
  }

  return true;
}

function validarFormulario(datos) {
  if (datos.finca === "") {
    return "Debe seleccionar una finca.";
  }

  if (datos.estanque === "") {
    return "Debe seleccionar un estanque.";
  }

  if (
    datos.fechaReporte === undefined ||
    datos.fechaReporte === null ||
    String(datos.fechaReporte).trim() === ""
  ) {
    return "Debe seleccionar la fecha del reporte.";
  }

  if (datos.enfermedad === "") {
    return "Debe seleccionar una enfermedad.";
  }

  if (datos.severidad === "") {
    return "Debe seleccionar la severidad.";
  }

  if (
    esNumeroNoNegativo(datos.mortalidad) === false
  ) {
    return (
      "La mortalidad debe ser un numero " +
      "mayor o igual a cero."
    );
  }

  if (
    datos.reporte === undefined ||
    datos.reporte === null ||
    String(datos.reporte).trim() === ""
  ) {
    return "Debe escribir el reporte sanitario.";
  }

  return "";
}

/*
============================================================
HOOK
============================================================
*/

export default function useEnfermedadesScreen({
  onBack,
  navigation,
} = {}) {
  const router = useRouter();

  /*
  ==========================================================
  FORMULARIO
  ==========================================================
  */

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
    obtenerFechaActual(),
  );

  const [
    enfermedad,
    setEnfermedad,
  ] = useState("");

  const [
    severidad,
    setSeveridad,
  ] = useState("");

  const [
    mortalidad,
    setMortalidad,
  ] = useState("0");

  const [
    reporte,
    setReporte,
  ] = useState("");

  /*
  ==========================================================
  DATOS
  ==========================================================
  */

  const [
    opcionesFincas,
    setOpcionesFincas,
  ] = useState([]);

  const [
    todosLosEstanques,
    setTodosLosEstanques,
  ] = useState([]);

  const [
    opcionesEnfermedades,
    setOpcionesEnfermedades,
  ] = useState([]);

  const [
    opcionesSeveridades,
    setOpcionesSeveridades,
  ] = useState([]);

  const [
    registros,
    setRegistros,
  ] = useState([]);

  /*
  ==========================================================
  INTERFAZ
  ==========================================================
  */

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    eliminandoId,
    setEliminandoId,
  ] = useState(null);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [
    mensaje,
    setMensaje,
  ] = useState("");

  const [
    tipoMensaje,
    setTipoMensaje,
  ] = useState("info");

  const [
    registroEditandoId,
    setRegistroEditandoId,
  ] = useState(null);

  /*
  ==========================================================
  ESTANQUES FILTRADOS
  ==========================================================
  */

  const opcionesEstanques = useMemo(
    function () {
      const resultado = [];

      if (finca === "") {
        return resultado;
      }

      const fincaSeleccionada = Number(finca);

      for (
        let i = 0;
        i < todosLosEstanques.length;
        i++
      ) {
        const item = todosLosEstanques[i];
        const fincaEstanque = Number(item.fincaId);

        if (
          fincaEstanque ===
          fincaSeleccionada
        ) {
          resultado.push(item);
        }
      }

      return resultado;
    },
    [
      finca,
      todosLosEstanques,
    ],
  );

  /*
  ==========================================================
  REGISTROS VISIBLES
  ==========================================================
  */

  const casosRegistrados = useMemo(
    function () {
      const resultado = [];

      for (
        let i = 0;
        i < registros.length;
        i++
      ) {
        const registro = registros[i];

        resultado.push({
          ...registro,
          fincaNombre: obtenerNombreOpcion(
            opcionesFincas,
            registro.fincaId,
            "Sin finca",
          ),
          estanqueNombre: obtenerNombreOpcion(
            todosLosEstanques,
            registro.estanqueId,
            "Sin estanque",
          ),
        });
      }

      return resultado;
    },
    [
      registros,
      opcionesFincas,
      todosLosEstanques,
    ],
  );

  /*
  ==========================================================
  CARGA
  ==========================================================
  */

  const cargarDatos = useCallback(
    async function () {
      setCargando(true);
      setMensaje("");

      const resultados = await Promise.allSettled([
        obtenerOpcionesFincas(),
        obtenerOpcionesEstanques(),
        obtenerCatalogoEnfermedades(),
        obtenerCatalogoSeveridades(),
        obtenerEnfermedades(),
      ]);

      const errores = [];
      const resultadoFincas = resultados[0];
      const resultadoEstanques = resultados[1];
      const resultadoEnfermedades = resultados[2];
      const resultadoSeveridades = resultados[3];
      const resultadoRegistros = resultados[4];

      if (
        resultadoFincas.status ===
        "fulfilled"
      ) {
        setOpcionesFincas(
          resultadoFincas.value,
        );
      } else {
        setOpcionesFincas([]);

        errores.push(
          obtenerMensajeError(
            resultadoFincas.reason,
            "No se pudieron cargar las fincas.",
          ),
        );
      }

      if (
        resultadoEstanques.status ===
        "fulfilled"
      ) {
        setTodosLosEstanques(
          resultadoEstanques.value,
        );
      } else {
        setTodosLosEstanques([]);

        errores.push(
          obtenerMensajeError(
            resultadoEstanques.reason,
            "No se pudieron cargar los estanques.",
          ),
        );
      }

      if (
        resultadoEnfermedades.status ===
        "fulfilled"
      ) {
        setOpcionesEnfermedades(
          resultadoEnfermedades.value,
        );
      } else {
        setOpcionesEnfermedades([]);

        errores.push(
          obtenerMensajeError(
            resultadoEnfermedades.reason,
            "No se pudo cargar el catalogo de enfermedades.",
          ),
        );
      }

      if (
        resultadoSeveridades.status ===
        "fulfilled"
      ) {
        setOpcionesSeveridades(
          resultadoSeveridades.value,
        );
      } else {
        setOpcionesSeveridades([]);

        errores.push(
          obtenerMensajeError(
            resultadoSeveridades.reason,
            "No se pudo cargar el catalogo de severidades.",
          ),
        );
      }

      if (
        resultadoRegistros.status ===
        "fulfilled"
      ) {
        setRegistros(
          resultadoRegistros.value,
        );
      } else {
        setRegistros([]);

        errores.push(
          obtenerMensajeError(
            resultadoRegistros.reason,
            "No se pudieron cargar los registros.",
          ),
        );
      }

      if (errores.length > 0) {
        setTipoMensaje("warning");
        setMensaje(errores.join("\n"));
      }

      setCargando(false);
    },
    [],
  );

  useEffect(
    function () {
      cargarDatos();
    },
    [
      cargarDatos,
    ],
  );

  /*
  ==========================================================
  CAMBIOS
  ==========================================================
  */

  const cambiarFinca = useCallback(
    function (valor) {
      setFinca(String(valor));
      setEstanque("");
      setMensaje("");
    },
    [],
  );

  const cambiarEstanque = useCallback(
    function (valor) {
      setEstanque(String(valor));
      setMensaje("");
    },
    [],
  );

  const cambiarFechaReporte = useCallback(
    function (valor) {
      setFechaReporte(valor);
      setMensaje("");
    },
    [],
  );

  const cambiarEnfermedad = useCallback(
    function (valor) {
      setEnfermedad(String(valor));
      setMensaje("");
    },
    [],
  );

  const cambiarSeveridad = useCallback(
    function (valor) {
      setSeveridad(String(valor));
      setMensaje("");
    },
    [],
  );

  const cambiarMortalidad = useCallback(
    function (valor) {
      setMortalidad(String(valor));
      setMensaje("");
    },
    [],
  );

  const cambiarReporte = useCallback(
    function (valor) {
      setReporte(valor);
      setMensaje("");
    },
    [],
  );

  /*
  ==========================================================
  LIMPIAR
  ==========================================================
  */

  const limpiarFormulario = useCallback(
    function () {
      setFinca("");
      setEstanque("");
      setFechaReporte(obtenerFechaActual());
      setEnfermedad("");
      setSeveridad("");
      setMortalidad("0");
      setReporte("");
      setSubmitted(false);
      setRegistroEditandoId(null);
    },
    [],
  );

  /*
  ==========================================================
  GUARDAR
  ==========================================================
  */

  const guardarEnfermedad = useCallback(
    async function () {
      setSubmitted(true);
      setMensaje("");

      const errorValidacion = validarFormulario({
        finca: finca,
        estanque: estanque,
        fechaReporte: fechaReporte,
        enfermedad: enfermedad,
        severidad: severidad,
        mortalidad: mortalidad,
        reporte: reporte,
      });

      if (errorValidacion !== "") {
        setTipoMensaje("warning");
        setMensaje(errorValidacion);
        return;
      }

      setGuardando(true);

      const datos = {
        fincaId: Number(finca),
        estanqueId: Number(estanque),
        fechaReporte: fechaReporte,
        enfermedad: enfermedad,
        severidad: severidad,
        mortalidadRegistrada: mortalidad,
        reporte: reporte,
      };

      try {
        let mensajeExito =
          "Enfermedad registrada correctamente.";

        if (registroEditandoId === null) {
          await crearEnfermedad(datos);
        } else {
          await actualizarEnfermedad(
            registroEditandoId,
            datos,
          );

          mensajeExito =
            "Enfermedad actualizada correctamente.";
        }

        const registrosActualizados =
          await obtenerEnfermedades();

        setRegistros(registrosActualizados);
        setTipoMensaje("success");
        setMensaje(mensajeExito);
        limpiarFormulario();
      } catch (error) {
        setTipoMensaje("danger");

        setMensaje(
          obtenerMensajeError(
            error,
            "No fue posible guardar la enfermedad.",
          ),
        );
      } finally {
        setGuardando(false);
      }
    },
    [
      finca,
      estanque,
      fechaReporte,
      enfermedad,
      severidad,
      mortalidad,
      reporte,
      registroEditandoId,
      limpiarFormulario,
    ],
  );

  /*
  ==========================================================
  EDITAR
  ==========================================================
  */

  const editarCaso = useCallback(
    function (caso) {
      setFinca(String(caso.fincaId));
      setEstanque(String(caso.estanqueId));
      setFechaReporte(caso.fechaReporte);
      setEnfermedad(caso.enfermedad);
      setSeveridad(caso.severidad);
      setMortalidad(
        String(caso.mortalidadRegistrada),
      );
      setReporte(caso.reporte);
      setRegistroEditandoId(caso.id);
      setSubmitted(false);
      setTipoMensaje("info");

      setMensaje(
        "Editando el registro #" +
        caso.id +
        ".",
      );
    },
    [],
  );

  const cancelarEdicion = useCallback(
    function () {
      limpiarFormulario();
      setMensaje("");
      setTipoMensaje("info");
    },
    [
      limpiarFormulario,
    ],
  );

  /*
  ==========================================================
  ELIMINAR
  ==========================================================
  */

  const eliminarCaso = useCallback(
    async function (id) {
      setEliminandoId(id);
      setMensaje("");

      try {
        await eliminarEnfermedad(id);

        const registrosActualizados =
          await obtenerEnfermedades();

        setRegistros(registrosActualizados);

        if (
          Number(registroEditandoId) ===
          Number(id)
        ) {
          limpiarFormulario();
        }

        setTipoMensaje("success");

        setMensaje(
          "Enfermedad eliminada correctamente.",
        );
      } catch (error) {
        setTipoMensaje("danger");

        setMensaje(
          obtenerMensajeError(
            error,
            "No fue posible eliminar la enfermedad.",
          ),
        );
      } finally {
        setEliminandoId(null);
      }
    },
    [
      registroEditandoId,
      limpiarFormulario,
    ],
  );

  /*
  ==========================================================
  VOLVER
  ==========================================================
  */

  const volver = useCallback(
    function () {
      if (typeof onBack === "function") {
        onBack();
        return;
      }

      if (
        navigation !== undefined &&
        navigation !== null &&
        typeof navigation.goBack === "function"
      ) {
        navigation.goBack();
        return;
      }

      router.replace(
        "/(drawer)/(tabs)/registros",
      );
    },
    [
      onBack,
      navigation,
      router,
    ],
  );

  return {
    finca: finca,
    estanque: estanque,
    fechaReporte: fechaReporte,
    enfermedad: enfermedad,
    severidad: severidad,
    mortalidad: mortalidad,
    reporte: reporte,

    responsableVisible:
      "Se asigna desde la sesion",

    opcionesFincas: opcionesFincas,
    opcionesEstanques: opcionesEstanques,
    opcionesEnfermedades: opcionesEnfermedades,
    opcionesSeveridades: opcionesSeveridades,
    casosRegistrados: casosRegistrados,

    cargando: cargando,
    guardando: guardando,
    eliminandoId: eliminandoId,
    submitted: submitted,
    mensaje: mensaje,
    tipoMensaje: tipoMensaje,
    registroEditandoId: registroEditandoId,

    cambiarFinca: cambiarFinca,
    cambiarEstanque: cambiarEstanque,
    cambiarFechaReporte: cambiarFechaReporte,
    cambiarEnfermedad: cambiarEnfermedad,
    cambiarSeveridad: cambiarSeveridad,
    cambiarMortalidad: cambiarMortalidad,
    cambiarReporte: cambiarReporte,

    guardarEnfermedad: guardarEnfermedad,
    editarCaso: editarCaso,
    cancelarEdicion: cancelarEdicion,
    eliminarCaso: eliminarCaso,
    recargar: cargarDatos,
    volver: volver,
  };
}
