/**
 * ============================================================
 * HOOK DE EDICIÓN DE VENTA
 * ============================================================
 *
 * Carga una venta existente por id y precarga el formulario con
 * los mismos catálogos y validaciones que useVenta.js, pero
 * guardando los cambios con updateVenta en vez de crear una
 * venta nueva.
 *
 * NOTA: los nombres de campo de lectura (peso_promedio,
 * tamano_promedio, comprador_id) se infieren a partir de los
 * ya confirmados en useDetalleVenta.js (finca_id, estanque_id,
 * fecha, total, cantidad_vendida, precio_kilo). Verifica contra
 * la respuesta real de GET /ventas/:id y ajusta si difiere.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

import { getVentaById, updateVenta } from "../services/mantVentas.service.js";
import { MantVentaDTO } from "../dtos/mantVenta.dto.js";

import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { compradorService } from "../../compradores/services/comprador.service.js";

import {
  CLIENTE_GENERICO,
  normalizarDecimal,
  formatearFechaParaInput,
  convertirFechaParaBackend,
  validarVentaFormulario,
} from "./useVenta.js";

function formatearFechaDesdeBackend(fechaBackend) {
  if (!fechaBackend) return "";
  const soloFecha = String(fechaBackend).split("T")[0];
  return formatearFechaParaInput(soloFecha);
}

function mensajeDeError(error) {
  if (typeof error === "string") return error;

  const detalles = error?.response?.data?.error;
  if (Array.isArray(detalles) && detalles.length > 0) {
    return detalles.join(" ");
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Ocurrió un error inesperado."
  );
}

export function useVentaEditar({ id, onGuardado } = {}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const ventaId = id ?? null;

  const [ventaOriginal, setVentaOriginal] = useState(null);
  const [cargandoVenta, setCargandoVenta] = useState(true);

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [compradoresData, setCompradoresData] = useState([]);

  const [fincaSeleccionada, setFincaSeleccionadaState] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [pesoPromedio, setPesoPromedio] = useState("0.1");
  const [tamanoPromedio, setTamanoPromedio] = useState("0.1");
  const [kilosVendidos, setKilosVendidos] = useState("0");
  const [precioKilo, setPrecioKilo] = useState("0");
  const [fechaVenta, setFechaVenta] = useState("");
  const [compradorSeleccionado, setCompradorSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargarCatalogos() {
      const [dataFincas, dataEstanques, dataCompradores] =
        await Promise.all([
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          compradorService.getCompradores(),
        ]);

      if (activo) {
        setFincas(dataFincas);
        setEstanques(dataEstanques);
        setCompradoresData(dataCompradores);
      }
    }

    cargarCatalogos();

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    let activo = true;

    async function cargarVenta() {
      if (!ventaId) {
        setCargandoVenta(false);
        return;
      }

      try {
        const venta = await getVentaById(ventaId);

        if (!activo) return;

        setVentaOriginal(venta);
        setFincaSeleccionadaState(venta?.finca ?? "");
        setEstanqueSeleccionado(venta?.estanque ?? "");
        setPesoPromedio(String(venta?.pesoPromedio ?? "0.1"));
        setTamanoPromedio(String(venta?.tamanoPromedio ?? "0.1"));
        setKilosVendidos(String(venta?.cantVendida ?? "0"));
        setPrecioKilo(String(venta?.precioKilo ?? "0"));
        setFechaVenta(formatearFechaDesdeBackend(venta?.fecha));
        setCompradorSeleccionado(venta?.comprador ?? CLIENTE_GENERICO);
      } catch (error) {
        setTipoMensaje("error");
        setMensaje(mensajeDeError(error));
      } finally {
        if (activo) setCargandoVenta(false);
      }
    }

    cargarVenta();

    return () => {
      activo = false;
    };
  }, [ventaId]);

  const opcionesFincas = useMemo(
    () =>
      fincas.map((finca) => ({
        label: finca.nombreFinca,
        value: finca.id,
      })),
    [fincas],
  );

  const estanquesFiltrados = useMemo(() => {
    if (!fincaSeleccionada) return [];

    return estanques
      .filter((estanque) => estanque.idFinca === Number(fincaSeleccionada))
      .map((estanque) => ({
        label: estanque.codigo,
        value: estanque.id,
      }));
  }, [fincaSeleccionada, estanques]);


  const opcionesCompradores = useMemo(
    () => [
      { label: "Cliente genérico", value: CLIENTE_GENERICO },
      ...compradoresData.map((comprador) => ({
        label: comprador.nombre,
        value: comprador.id,
      })),
    ],
    [compradoresData],
  );

  const precioKiloNumero = Number(precioKilo || 0);
  const totalVenta = Number(kilosVendidos || 0) * precioKiloNumero;

  const limpiarError = useCallback((campo) => {
    setErrores((actual) => {
      if (!actual[campo]) return actual;
      return { ...actual, [campo]: false };
    });
  }, []);

  const handleFincaChange = useCallback(
    (value) => {
      setFincaSeleccionadaState(value);
      setEstanqueSeleccionado("");
      limpiarError("finca");
    },
    [limpiarError],
  );

  const handlePesoPromedioChange = useCallback(
    (value) => {
      setPesoPromedio(normalizarDecimal(value));
      limpiarError("pesoPromedio");
    },
    [limpiarError],
  );

  const handleTamanoPromedioChange = useCallback(
    (value) => {
      setTamanoPromedio(normalizarDecimal(value));
      limpiarError("tamanoPromedio");
    },
    [limpiarError],
  );

  const handleKilosVendidosChange = useCallback(
    (value) => {
      setKilosVendidos(normalizarDecimal(value));
      limpiarError("kilosVendidos");
    },
    [limpiarError],
  );

  const handlePrecioChange = useCallback(
    (value) => {
      setPrecioKilo(String(Math.max(0, Math.round(Number(value) || 0))));
      limpiarError("precioKilo");
    },
    [limpiarError],
  );

  const handleCompradorChange = useCallback(
    (value) => {
      setCompradorSeleccionado(value);
      limpiarError("comprador");
    },
    [limpiarError],
  );

  const guardarCambios = useCallback(async () => {
    const nuevosErrores = validarVentaFormulario({
      fincaSeleccionada,
      estanqueSeleccionado,
      pesoPromedio,
      tamanoPromedio,
      kilosVendidos,
      precioKiloNumero,
      compradorSeleccionado,
    });

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setTipoMensaje("error");
      setMensaje("Completa los datos obligatorios para guardar los cambios.");
      return;
    }

    if (!ventaId) {
      setTipoMensaje("error");
      setMensaje("No se encontró la venta que se quiere editar.");
      return;
    }

    setGuardando(true);

    const ventaDTO = new MantVentaDTO({
      finca: Number(fincaSeleccionada),
      estanque: Number(estanqueSeleccionado),
      comprador:
        compradorSeleccionado === CLIENTE_GENERICO
          ? null
          : Number(compradorSeleccionado),
      pesoPromedio: Number(pesoPromedio),
      tamanoPromedio: Number(tamanoPromedio),
      cantVendida: Number(kilosVendidos),
      precioKilo: precioKiloNumero,
      fecha: convertirFechaParaBackend(fechaVenta),
    });

    try {
      await updateVenta(ventaId, ventaDTO);
      setTipoMensaje("success");
      setMensaje("Venta actualizada correctamente.");
      onGuardado?.({
        success: true,
        message: "Venta actualizada correctamente.",
      });
    } catch (error) {
      setTipoMensaje("error");
      setMensaje(mensajeDeError(error));
    } finally {
      setGuardando(false);
    }
  }, [
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoPromedio,
    tamanoPromedio,
    kilosVendidos,
    precioKiloNumero,
    compradorSeleccionado,
    fechaVenta,
    ventaId,
    onGuardado,
  ]);

  return {
    ventaOriginal,
    cargandoVenta,
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoPromedio,
    tamanoPromedio,
    kilosVendidos,
    precioKilo,
    fechaVenta,
    compradorSeleccionado,
    mensaje,
    tipoMensaje,
    errores,
    guardando,
    isWide,
    opcionesFincas,
    estanquesFiltrados,
    opcionesCompradores,
    totalVenta,
    setEstanqueSeleccionado,
    handleFincaChange,
    handlePesoPromedioChange,
    handleTamanoPromedioChange,
    handleKilosVendidosChange,
    handlePrecioChange,
    handleCompradorChange,
    limpiarError,
    guardarCambios,
  };
}