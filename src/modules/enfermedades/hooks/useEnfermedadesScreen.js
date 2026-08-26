/**
 * =============================================================
 * HOOK DE PANTALLA DE ENFERMEDADES
 * =============================================================
 *
 * Centraliza la logica del formulario, carga de opciones,
 * validaciones y registro de enfermedades.
 */

import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { getUsuario } from "../../login/utils/tokenStorage.js";
import { getSiembras } from "../../siembra/services/siembra.service.js";

import useEnfermedades from "./useEnfermedades.js";

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${fecha.getFullYear()}`;
}

function convertirFechaParaBackend(fecha) {
  if (!fecha || fecha.includes("-")) return fecha || "";
  const [dia, mes, anio] = fecha.split("/");
  return dia && mes && anio ? `${anio}-${mes}-${dia}` : fecha;
}

function obtenerFechaValida(fecha) {
  const texto = String(fecha ?? "").trim();
  let dia, mes, anio;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    [dia, mes, anio] = texto.split("/").map(Number);
  } else if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
    [anio, mes, dia] = texto.slice(0, 10).split("-").map(Number);
  } else {
    return null;
  }

  const fechaValidada = new Date(anio, mes - 1, dia);
  fechaValidada.setHours(0, 0, 0, 0);

  if (
    fechaValidada.getFullYear() !== anio ||
    fechaValidada.getMonth() !== mes - 1 ||
    fechaValidada.getDate() !== dia
  )
    return null;

  return fechaValidada;
}

function validarFechaReporte(fecha) {
  if (!String(fecha ?? "").trim()) return "Seleccione la fecha del reporte.";

  const fechaValidada = obtenerFechaValida(fecha);
  if (!fechaValidada) return "La fecha del reporte no es valida.";

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (fechaValidada > hoy) return "La fecha del reporte no puede ser futura.";

  return "";
}

function obtenerResponsable(usuario) {
  if (!usuario) return "No disponible";

  const nombreCompleto = usuario.nombreCompleto ?? usuario.nombre_completo;
  if (nombreCompleto) return String(nombreCompleto).trim();

  const nombre = usuario.nombre ?? "";
  const apellidos = usuario.apellidos ?? usuario.apellido ?? "";
  const responsable = `${nombre} ${apellidos}`.trim();

  return responsable || usuario.usuario || usuario.username || "No disponible";
}

function primeraMayuscula(texto) {
  return texto
    ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
    : "";
}

function obtenerIdFinca(finca) {
  return Number(finca.id ?? finca.fincaId ?? finca.idFinca ?? finca.finca_id);
}

function obtenerIdEstanque(estanque) {
  return Number(
    estanque.id ??
      estanque.estanqueId ??
      estanque.idEstanque ??
      estanque.estanque_id,
  );
}

function obtenerFincaIdEstanque(estanque) {
  return Number(
    estanque.idFinca ??
      estanque.fincaId ??
      estanque.id_finca ??
      estanque.finca_id,
  );
}

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function obtenerIdEstanqueSiembra(siembra) {
  return Number(
    siembra.estanqueId ??
      siembra.idEstanque ??
      siembra.estanque_id ??
      siembra.id_estanque,
  );
}

function estanqueEstaOperativo(estanque) {
  return normalizarTexto(estanque?.estado) === "activo";
}

function siembraEstaActiva(siembra) {
  const activo = siembra?.activo ?? true;
  const estado = normalizarTexto(siembra?.estado);

  if (
    activo === false ||
    activo === 0 ||
    activo === "0" ||
    normalizarTexto(activo) === "false"
  )
    return false;

  return estado === "activa" || estado === "activo";
}

function estanqueTieneSiembraActiva(estanqueId, siembras) {
  if (!Array.isArray(siembras)) return false;

  return siembras.some(function (siembra) {
    return (
      obtenerIdEstanqueSiembra(siembra) === Number(estanqueId) &&
      siembraEstaActiva(siembra)
    );
  });
}

function buscarEstanquePorId(estanques, estanqueId) {
  if (!Array.isArray(estanques)) return null;

  return (
    estanques.find(function (item) {
      return obtenerIdEstanque(item) === Number(estanqueId);
    }) ?? null
  );
}

function validarEstanqueParaRegistro(estanqueId, estanques, siembras) {
  const estanqueSeleccionado = buscarEstanquePorId(estanques, estanqueId);

  if (!estanqueSeleccionado) return "Seleccione un estanque valido.";

  if (!estanqueEstaOperativo(estanqueSeleccionado))
    return "El estanque seleccionado no esta activo.";

  if (!estanqueTieneSiembraActiva(estanqueId, siembras))
    return "El estanque seleccionado no tiene una siembra activa.";

  return "";
}

function normalizarCatalogo(catalogo) {
  if (!Array.isArray(catalogo)) return [];

  return catalogo
    .map(function (item) {
      if (typeof item === "string")
        return { label: primeraMayuscula(item), value: item };

      const value =
        item.value ?? item.valor ?? item.codigo ?? item.nombre ?? "";

      const label =
        item.label ?? item.nombre ?? primeraMayuscula(String(value));

      return { label: String(label), value: String(value) };
    })
    .filter(function (item) {
      return item.value !== "";
    });
}

export default function useEnfermedadesScreen() {
  const { width } = useWindowDimensions();

  const {
    catalogoEnfermedades,
    catalogoSeveridades,
    loading: loadingEnfermedades,
    guardarEnfermedad: guardarEnfermedadBackend,
  } = useEnfermedades();

  const responsable = useMemo(() => obtenerResponsable(getUsuario()), []);

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [siembras, setSiembras] = useState([]);

  const [finca, setFinca] = useState("");
  const [estanque, setEstanque] = useState("");
  const [fechaReporte, setFechaReporte] = useState(obtenerFechaActual());
  const [enfermedad, setEnfermedad] = useState("");
  const [severidad, setSeveridad] = useState("");
  const [reporte, setReporte] = useState("");

  const [cargandoOpciones, setCargandoOpciones] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");

  useEffect(
    function () {
      if (!mensaje) return undefined;

      const duracion = tipoMensaje === "success" ? 3000 : 6000;

      const timer = setTimeout(function () {
        setMensaje("");
        setTipoMensaje("info");
      }, duracion);

      return function () {
        clearTimeout(timer);
      };
    },
    [mensaje, tipoMensaje],
  );

  useEffect(function () {
    async function cargarOpciones() {
      try {
        setCargandoOpciones(true);

        const [fincasData, estanquesData, siembrasData] = await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          getSiembras(),
        ]);

        setFincas(Array.isArray(fincasData) ? fincasData : []);
        setEstanques(Array.isArray(estanquesData) ? estanquesData : []);
        setSiembras(Array.isArray(siembrasData) ? siembrasData : []);
      } catch (error) {
        setTipoMensaje("danger");
        setMensaje(error.message);
      } finally {
        setCargandoOpciones(false);
      }
    }

    cargarOpciones();
  }, []);

  const opcionesFincas = useMemo(
    function () {
      return fincas
        .map(function (item) {
          const id = obtenerIdFinca(item);

          const label =
            item.nombreFinca ??
            item.nombre_finca ??
            item.nombre ??
            item.codigoCBO ??
            `Finca ${id}`;

          return { label, value: String(id) };
        })
        .filter(function (item) {
          return Number(item.value) > 0;
        });
    },
    [fincas],
  );

  const opcionesEstanques = useMemo(
    function () {
      if (!finca) return [];

      return estanques
        .filter(function (item) {
          const estanqueId = obtenerIdEstanque(item);

          return (
            obtenerFincaIdEstanque(item) === Number(finca) &&
            estanqueEstaOperativo(item) &&
            estanqueTieneSiembraActiva(estanqueId, siembras)
          );
        })
        .map(function (item) {
          const id = obtenerIdEstanque(item);
          const label = item.codigo ?? item.nombre ?? `Estanque ${id}`;

          return { label, value: String(id) };
        })
        .filter(function (item) {
          return Number(item.value) > 0;
        });
    },
    [finca, estanques, siembras],
  );

  const opcionesEnfermedades = useMemo(
    function () {
      return normalizarCatalogo(catalogoEnfermedades);
    },
    [catalogoEnfermedades],
  );

  const opcionesSeveridades = useMemo(
    function () {
      return normalizarCatalogo(catalogoSeveridades);
    },
    [catalogoSeveridades],
  );

  const esTablet = width >= 768;

  const gridStyle = useMemo(
    function () {
      return {
        width: "100%",
        flexDirection: esTablet ? "row" : "column",
        flexWrap: esTablet ? "wrap" : "nowrap",
        gap: 12,
      };
    },
    [esTablet],
  );

  const itemStyle = useMemo(
    function () {
      return { width: esTablet ? "48.5%" : "100%" };
    },
    [esTablet],
  );

  const itemFullStyle = useMemo(function () {
    return { width: "100%" };
  }, []);

  const placeholderFinca = cargandoOpciones
    ? "Cargando fincas..."
    : opcionesFincas.length > 0
      ? "Seleccione una finca"
      : "No se encuentran opciones o valores";

  const placeholderEstanque = !finca
    ? "Seleccione primero una finca"
    : opcionesEstanques.length > 0
      ? "Seleccione un estanque"
      : "No hay estanques activos con siembra activa";

  const placeholderEnfermedad =
    opcionesEnfermedades.length > 0
      ? "Seleccione una enfermedad"
      : "No se encuentran opciones o valores";

  const placeholderSeveridad =
    opcionesSeveridades.length > 0
      ? "Seleccione la severidad"
      : "No se encuentran opciones o valores";

  const errorFinca = submitted && finca === "";
  const errorEstanque = submitted && estanque === "";
  const errorFechaReporte =
    submitted && validarFechaReporte(fechaReporte) !== "";
  const errorEnfermedad = submitted && enfermedad === "";
  const errorSeveridad = submitted && severidad === "";

  function limpiarMensaje() {
    setMensaje("");
    setTipoMensaje("info");
  }

  function cambiarFinca(value) {
    setFinca(String(value));
    setEstanque("");
    limpiarMensaje();
  }

  function cambiarEstanque(value) {
    setEstanque(String(value));
    limpiarMensaje();
  }

  function cambiarFechaReporte(value) {
    setFechaReporte(value);
    limpiarMensaje();
  }

  function cambiarEnfermedad(value) {
    setEnfermedad(String(value));
    limpiarMensaje();
  }

  function cambiarSeveridad(value) {
    setSeveridad(String(value));
    limpiarMensaje();
  }

  function cambiarReporte(value) {
    setReporte(value);
    limpiarMensaje();
  }

  function validarFormulario() {
    if (!finca) return "Seleccione una finca.";
    if (!estanque) return "Seleccione un estanque.";

    const errorEstanqueOperativo = validarEstanqueParaRegistro(
      estanque,
      estanques,
      siembras,
    );

    if (errorEstanqueOperativo) return errorEstanqueOperativo;

    const errorFecha = validarFechaReporte(fechaReporte);
    if (errorFecha) return errorFecha;

    if (!enfermedad) return "Seleccione una enfermedad.";
    if (!severidad) return "Seleccione la severidad.";

    return "";
  }

  function limpiarFormulario() {
    setFinca("");
    setEstanque("");
    setFechaReporte(obtenerFechaActual());
    setEnfermedad("");
    setSeveridad("");
    setReporte("");
    setSubmitted(false);
  }

  async function guardarEnfermedad() {
    setSubmitted(true);
    setMensaje("");

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setTipoMensaje("danger");
      setMensaje(errorValidacion);
      return;
    }

    try {
      const enfermedadDTO = {
        fincaId: Number(finca),
        estanqueId: Number(estanque),
        fechaReporte: convertirFechaParaBackend(fechaReporte),
        enfermedad,
        severidad,
        reporte: reporte.trim() || null,
      };

      await guardarEnfermedadBackend(enfermedadDTO);

      setTipoMensaje("success");
      setMensaje("Enfermedad registrada correctamente.");
      limpiarFormulario();
    } catch (error) {
      setTipoMensaje("danger");
      setMensaje(error.message);
    }
  }

  return {
    finca,
    estanque,
    fechaReporte,
    enfermedad,
    severidad,
    reporte,
    responsable,
    opcionesFincas,
    opcionesEstanques,
    opcionesEnfermedades,
    opcionesSeveridades,
    placeholderFinca,
    placeholderEstanque,
    placeholderEnfermedad,
    placeholderSeveridad,
    gridStyle,
    itemStyle,
    itemFullStyle,
    errorFinca,
    errorEstanque,
    errorFechaReporte,
    errorEnfermedad,
    errorSeveridad,
    mensaje,
    tipoMensaje,
    loading: loadingEnfermedades || cargandoOpciones,
    cambiarFinca,
    cambiarEstanque,
    cambiarFechaReporte,
    cambiarEnfermedad,
    cambiarSeveridad,
    cambiarReporte,
    guardarEnfermedad,
  };
}