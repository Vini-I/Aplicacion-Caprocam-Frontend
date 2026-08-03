/**
 * ============================================================
 * HOOK DE REGISTRO DE VENTAS
 * ============================================================
 *
 * Gestiona la lógica necesaria para registrar ventas de producto,
 * controlando el formulario, cálculos, catálogos relacionados,
 * validaciones y almacenamiento temporal de las ventas registradas.
 *
 * Funcionalidad:
 * - Carga colaboradores activos para asociarlos a la venta.
 * - Obtiene opciones de fincas, estanques y compradores disponibles.
 * - Filtra estanques según la finca seleccionada.
 * - Normaliza y valida campos numéricos como peso, tamaño, kilos y precio.
 * - Calcula el total estimado de la venta según kilos vendidos y precio.
 * - Permite registrar ventas con compradores existentes o cliente genérico.
 * - Genera nombres consecutivos para clientes genéricos, como Cliente 001.
 * - Guarda la venta en el listado local y muestra mensajes de resultado.
 */
import { createVenta } from "../services/mantVentas.service.js";
import { MantVentaDTO } from "../dtos/mantVenta.dto.js";

import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { colaboradorService } from "../../colaboradores/services/colaborador.service.js";
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { compradorService } from "../../compradores/services/comprador.service.js";

import { styles } from "../styles/VentaStyles.js";
import { COLORS } from "../../../theme/colors.js";

export function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

export function formatearFechaParaInput(fecha) {
  if (!fecha) return obtenerFechaActual();

  const [anio, mes, dia] = fecha.split("-");

  if (!anio || !mes || !dia) return obtenerFechaActual();

  return `${dia}/${mes}/${anio}`;
}

export function convertirFechaParaBackend(fechaDDMMYYYY) {
  const [dia, mes, anio] = fechaDDMMYYYY.split("/");
  return `${anio}-${mes}-${dia}`;
}

function limpiarDecimal(value) {
  const texto = String(value).replace(",", ".");
  const partes = texto.replace(/[^0-9.]/g, "").split(".");

  if (partes.length === 1) {
    return partes[0];
  }

  return `${partes[0]}.${partes.slice(1).join("")}`;
}

export function normalizarDecimal(value, decimales = 1) {
  const numero = Number(limpiarDecimal(value));

  if (Number.isNaN(numero) || numero < 0) {
    return "0";
  }

  return numero.toFixed(decimales).replace(/\.0$/, "");
}

export function formatearMontoColones(value) {
  const numero = Math.round(Number(value) || 0);
  return `₡ ${String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function validarVentaFormulario({
  fincaSeleccionada,
  estanqueSeleccionado,
  pesoPromedio,
  tamanoPromedio,
  kilosVendidos,
  precioKiloNumero,
  colaboradorSeleccionado,
  compradorSeleccionado,
}) {
  const errores = {};

  if (!fincaSeleccionada) errores.finca = true;
  if (!estanqueSeleccionado) errores.estanque = true;
  if (Number(pesoPromedio) <= 0) errores.pesoPromedio = true;
  if (Number(tamanoPromedio) <= 0) errores.tamanoPromedio = true;
  if (Number(kilosVendidos) <= 0) errores.kilosVendidos = true;
  if (precioKiloNumero <= 0) errores.precioKilo = true;
  if (!compradorSeleccionado) errores.comprador = true;

  return errores;
}

export function useVenta() {
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [pesoPromedio, setPesoPromedio] = useState("0.0");
  const [tamanoPromedio, setTamanoPromedio] = useState("0.0");
  const [kilosVendidos, setKilosVendidos] = useState("0");
  const [precioKilo, setPrecioKilo] = useState("0");
  const [fechaVenta, setFechaVenta] = useState(obtenerFechaActual());
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState("");
  const [compradorSeleccionado, setCompradorSeleccionado] = useState("");
  const [colaboradores, setColaboradores] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);
  const [compradoresData, setCompradoresData] = useState([]);

  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    let activo = true;

    async function cargarCatalogos() {
      const [dataColaboradores, dataFincas, dataEstanques, dataCompradores] =
        await Promise.all([
          colaboradorService.getColaboradores({ activo: true }),
          fincaService.getFincas(),
          estanqueService.getEstanques(),
          compradorService.getCompradores(),
        ]);

      if (activo) {
        setColaboradores(dataColaboradores);
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

  const opcionesColaboradores = useMemo(
    () =>
      colaboradores.map((colaborador) => ({
        label: colaborador.nombre,
        value: colaborador.id,
      })),
    [colaboradores],
  );

  const opcionesCompradores = useMemo(
    () => [
      ...compradoresData.map((comprador) => ({
        label: comprador.nombre,
        value: comprador.id,
      })),
    ],
    [compradoresData],
  );

  const precioKiloNumero = Number(precioKilo || 0);
  const totalVenta = Number(kilosVendidos || 0) * precioKiloNumero;

  const gridStyle = useMemo(
    () => (isWide ? styles.inputRow : styles.inputGrid),
    [isWide],
  );

  const errorInputStyle = useMemo(
    () => ({
      borderColor: COLORS.error,
      backgroundColor: COLORS.surface,
    }),
    [],
  );

  const limpiarError = useCallback((campo) => {
    setErrores((actual) => {
      if (!actual[campo]) return actual;
      return { ...actual, [campo]: false };
    });
  }, []);

  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
      setSubmitted(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const limpiarMensaje = useCallback(() => {
    setSuccessMessage("");
    setErrorMessage("");
    setSubmitted(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        limpiarMensaje();
      };
    }, [limpiarMensaje]),
  );


  const handlePesoPromedioChange = useCallback(
    (value) => {
      setPesoPromedio(normalizarDecimal(value));
      limpiarError("pesoPromedio");
      setSuccessMessage("");
      setErrorMessage("");
    },
    [limpiarError],
  );

  const handleTamanoPromedioChange = useCallback(
    (value) => {
      setTamanoPromedio(normalizarDecimal(value));
      limpiarError("tamanoPromedio");
      setSuccessMessage("");
      setErrorMessage("");
    },
    [limpiarError],
  );

  const handleKilosVendidosChange = useCallback(
    (value) => {
      setKilosVendidos(normalizarDecimal(value));
      limpiarError("kilosVendidos");
      setSuccessMessage("");
      setErrorMessage("");
    },
    [limpiarError],
  );

  const handleColaboradorChange = useCallback(
    (value) => {
      setColaboradorSeleccionado(value);
      limpiarError("colaborador");
      setSuccessMessage("");
      setErrorMessage("");
    },
    [limpiarError],
  );

  const handleFincaChange = useCallback(
    (value) => {
      setFincaSeleccionada(value);
      setEstanqueSeleccionado("");

      limpiarError("finca");

      setSuccessMessage("");
      setErrorMessage("");
    },
    [limpiarError],
  );

  const handlePrecioChange = useCallback(
    (value) => {
      setPrecioKilo(String(Math.max(0, Math.round(Number(value) || 0))));
      limpiarError("precioKilo");
      setSuccessMessage("");
      setErrorMessage("");
    },
    [limpiarError],
  );

  const handleCompradorChange = useCallback(
    (value) => {
      setCompradorSeleccionado(value);
      limpiarError("comprador");
      setSuccessMessage("");
      setErrorMessage("");
    },
    [limpiarError],
  );

  const handleFechaChange = useCallback(
    (value) => {
      if (!value) {
        setFechaVenta(obtenerFechaActual());
        return;
      }

      setFechaVenta(value);
    },
    [],
  );

  const limpiarFormulario = useCallback(() => {
    setFincaSeleccionada("");
    setEstanqueSeleccionado("");
    setPesoPromedio("0.1");
    setTamanoPromedio("0.1");
    setKilosVendidos("0");
    setPrecioKilo("0");
    setFechaVenta(obtenerFechaActual());
    setColaboradorSeleccionado("");
    setCompradorSeleccionado("");
    setErrores({});
  }, []);

  const guardarVenta = useCallback(async () => {

    setSubmitted(true);
    setSuccessMessage("");
    setErrorMessage("");

    const nuevosErrores = validarVentaFormulario({
      fincaSeleccionada,
      estanqueSeleccionado,
      pesoPromedio,
      tamanoPromedio,
      kilosVendidos,
      precioKiloNumero,
      colaboradorSeleccionado,
      compradorSeleccionado,
    });

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setErrorMessage("Rellenar campos obligatorios.");
      return;
    }

    setGuardando(true);

    const ventaDTO = new MantVentaDTO({
      finca: Number(fincaSeleccionada),
      estanque: Number(estanqueSeleccionado),
      colaborador: colaboradorSeleccionado ? Number(colaboradorSeleccionado) : null,
      comprador: Number(compradorSeleccionado),
      pesoPromedio: Number(pesoPromedio),
      tamanoPromedio: Number(tamanoPromedio),
      cantVendida: Number(kilosVendidos),
      precioKilo: precioKiloNumero,
      fecha: convertirFechaParaBackend(fechaVenta),
    });

    try {

      await createVenta(ventaDTO);

      setVentas((actual) => [ventaDTO, ...actual]);

      limpiarFormulario();

      setSuccessMessage("Venta guardada correctamente.");

    } catch (error) {

      setSubmitted(true);
      setErrorMessage("No fue posible guardar la venta.");

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
    colaboradorSeleccionado,
    compradorSeleccionado,
    fechaVenta,
    limpiarFormulario,
  ]);

  function SectionTitle({ icon, title }) {
    return (
      <View style={styles.sectionTitle}>
        <Icon
          icon={icon}
          size={18}
          color={COLORS.primary}
          style={styles.sectionIcon}
        />
        <Text style={styles.sectionText}>{title}</Text>
      </View>
    );
  }

  return {
    SectionTitle,
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoPromedio,
    tamanoPromedio,
    kilosVendidos,
    precioKilo,
    fechaVenta,
    colaboradorSeleccionado,
    compradorSeleccionado,

    submitted,
    successMessage,
    errorMessage,

    errores,
    guardando,
    gridStyle,
    errorInputStyle,
    opcionesFincas,
    estanquesFiltrados,
    opcionesColaboradores,
    opcionesCompradores,
    precioKiloNumero,
    totalVenta,
    ventas,
    // setters directos
    setFechaVenta,
    setEstanqueSeleccionado,
    handleFincaChange,
    handlePesoPromedioChange,
    handleTamanoPromedioChange,
    handleKilosVendidosChange,
    handlePrecioChange,
    handleCompradorChange,
    handleColaboradorChange,
    handleFechaChange,
    limpiarError,
    guardarVenta,
  };
}