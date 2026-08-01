/**
 * ============================================================
 * HOOK useTrazabilidadList
 * ============================================================
 *
 * Descripción:
 * Hook responsable de obtener, enriquecer y filtrar el listado de registros de trazabilidad.
 *
 * @dependencies TrazabilidadServices, ErrorContext, expo-router
 * @validations Búsqueda por texto y filtros combinados (fincas, estanques, colaboradores, fecha).
 * @navigation Navega a /trazabilidad/agregar y /trazabilidad/:id.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import {
  getRegistros,
  obtenerFincas,
  obtenerColaboradores,
  obtenerTodosLosEstanques,
  construirMapas,
  enriquecerRegistros,
  filtrarRegistrosTrazabilidad,
} from "../services/TrazabilidadServices";
import { useError } from "../../../shared/context/ErrorContext";

export function useTrazabilidadList() {
  const router = useRouter();
  const { mostrarError } = useError();

  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    fincas: [],
    estanques: [],
    colaboradores: [],
    fecha: "",
  });

  const [registros, setRegistros] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [colaboradoresCat, setColaboradoresCat] = useState([]);
  const [estanques, setEstanques] = useState([]);
// Errores fuera de un formulario (cargar catálogos o el listado):
  // se muestran con el mismo Alert que ya usa la pantalla, no en
  // console.error ni en silencio. 401 = token vencido.
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
    if (error) mostrarError(error);
  }

  function cerrarErrorCarga() {
    setErrorCarga("");
    setSesionExpirada(false);
  }

  function irALogin() {
    cerrarErrorCarga();
    router.replace("/login");
  }

  useEffect(() => {
    obtenerFincas().then(setFincas).catch((error) => {
      setFincas([]);
      mostrarErrorCarga("No se pudieron cargar las fincas.", error);
    });

    obtenerColaboradores().then(setColaboradoresCat).catch((error) => {
      setColaboradoresCat([]);
      mostrarErrorCarga("No se pudieron cargar los colaboradores.", error);
    });

    obtenerTodosLosEstanques().then(setEstanques).catch((error) => {
      setEstanques([]);
      mostrarErrorCarga("No se pudieron cargar los estanques.", error);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      getRegistros().then(setRegistros).catch((error) => {
        setRegistros([]);
        mostrarErrorCarga("No se pudo cargar el listado de trazabilidad.", error);
      });
    }, []),
  );

  const mapas = useMemo(
    () => construirMapas({ fincas, colaboradores: colaboradoresCat, estanques }),
    [fincas, colaboradoresCat, estanques],
  );

  const registrosEnriquecidos = useMemo(
    () => enriquecerRegistros(registros, mapas),
    [registros, mapas],
  );

  // Extrae unicamente los responsables (usuarios o colaboradores) que
  // poseen al menos 1 registro en el listado de trazabilidad.
  const colaboradores = useMemo(() => {
    const map = new Map();
    (registrosEnriquecidos || []).forEach((reg) => {
      const key = reg.colaboradorId ?? (reg.creadoPorUsuarioId ? `user_${reg.creadoPorUsuarioId}` : reg.colaboradorNombre);
      const label = reg.colaboradorNombre || "Sin asignar";

      if (key && label && !map.has(key)) {
        map.set(key, {
          label,
          value: key,
        });
      }
    });
    return Array.from(map.values());
  }, [registrosEnriquecidos]);

  const registrosFiltrados = useMemo(
    () => filtrarRegistrosTrazabilidad(registrosEnriquecidos, busqueda, filtros),
    [registrosEnriquecidos, busqueda, filtros],
  );

  const hayFiltrosActivos =
    String(busqueda).trim() !== "" ||
    filtros.fincas.length > 0 ||
    filtros.estanques.length > 0 ||
    filtros.colaboradores.length > 0 ||
    filtros.fecha !== "";

  function nuevoRegistro() {
    router.push("/trazabilidad/agregar");
  }

  function limpiarBusqueda() {
    setBusqueda("");
    setFiltros({ fincas: [], estanques: [], colaboradores: [], fecha: "" });
  }

  function abrirDetalle(id) {
    router.push(`/trazabilidad/${id}`);
  }

  return {
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    registrosFiltrados,
    fincas,
    colaboradores,
    hayFiltrosActivos,
    nuevoRegistro,
    limpiarBusqueda,
    abrirDetalle,
    errorCarga,
    sesionExpirada,
    cerrarErrorCarga,
    irALogin,
  };
}

// Helper to prepare a registro for presentation in the UI.
// Keeps formatting logic out of the screen component.
export function formatRegistroForView(registro) {
  const plNumber = Number(registro.pl ?? 0);
  const plFormatted = plNumber.toLocaleString();
  // "tamano" sin ñ: así lo confirmó el equipo de API en la respuesta real.
  const tamanoFormatted = registro.tamano ? `${registro.tamano}g` : "";

  return {
    ...registro,
    plFormatted,
    tamanoFormatted,
  };
}