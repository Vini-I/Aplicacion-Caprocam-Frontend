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
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { colaboradoresService } from "../../colaboradores/services/colaboradoresService.js";
import { fincas } from "../../finca/screens/FincaData.js";
import { estanques } from "../../mantCrecimiento/services/EstanqueData.js";
import { compradores as compradoresData } from "../services/CompradorData.js";

import { styles } from "../styles/VentaStyles.js";
import { COLORS } from "../../../theme/colors.js";

export const CLIENTE_GENERICO = "cliente-generico";

export function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
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

export function obtenerIdNumericoFinca(codigoInterno) {
  const partes = String(codigoInterno).split("-");
  const numero = Number(partes[1]);

  if (Number.isNaN(numero)) {
    return null;
  }

  return numero;
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
  if (!colaboradorSeleccionado) errores.colaborador = true;
  if (!compradorSeleccionado) errores.comprador = true;

  return errores;
}

export function useVenta() {
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState("");
  const [pesoPromedio, setPesoPromedio] = useState("0.1");
  const [tamanoPromedio, setTamanoPromedio] = useState("0.1");
  const [kilosVendidos, setKilosVendidos] = useState("0");
  const [precioKilo, setPrecioKilo] = useState("0");
  const [fechaVenta, setFechaVenta] = useState(obtenerFechaActual());
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState("");
  const [compradorSeleccionado, setCompradorSeleccionado] = useState("");
  const [colaboradores, setColaboradores] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargarColaboradores() {
      const data = await colaboradoresService.getColaboradores({ activo: true });

      if (activo) {
        setColaboradores(data);
      }
    }

    cargarColaboradores();

    return () => {
      activo = false;
    };
  }, []);

  const opcionesFincas = useMemo(
    () =>
      fincas.map((finca) => ({
        label: finca.nombre,
        value: finca.codigoInterno,
      })),
    [],
  );

  const estanquesFiltrados = useMemo(() => {
    const finca = fincas.find((item) => item.codigoInterno === fincaSeleccionada);

    if (!finca) return [];

    const fincaId = obtenerIdNumericoFinca(finca.codigoInterno);

    return estanques
      .filter(
        (estanque) =>
          estanque.fincaNombre === finca.nombre || estanque.fincaId === fincaId,
      )
      .map((estanque) => ({
        label: `${estanque.codigo} - ${estanque.nombre}`,
        value: String(estanque.id),
      }));
  }, [fincaSeleccionada]);

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
      { label: "Cliente genérico", value: CLIENTE_GENERICO },
      ...compradoresData.map((comprador) => ({
        label: comprador.nombre,
        value: comprador.id,
      })),
    ],
    [],
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

  const limpiarMensaje = useCallback(() => {
    setMensaje("");
    setTipoMensaje("");
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

  const handleColaboradorChange = useCallback(
    (value) => {
      setColaboradorSeleccionado(value);
      limpiarError("colaborador");
    },
    [limpiarError],
  );

  const handleFincaChange = useCallback(
    (value) => {
      setFincaSeleccionada(value);
      setEstanqueSeleccionado("");
      limpiarError("finca");
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

  const guardarVenta = useCallback(() => {
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
      setTipoMensaje("error");
      setMensaje("Completa los datos obligatorios para guardar venta");
      return;
    }

    setGuardando(true);

    const finca = fincas.find((item) => item.codigoInterno === fincaSeleccionada);
    const estanque = estanques.find((item) => String(item.id) === estanqueSeleccionado);
    const colaborador = colaboradores.find((item) => item.id === colaboradorSeleccionado);
    const comprador = compradoresData.find((item) => item.id === compradorSeleccionado);
    const esClienteGenerico = compradorSeleccionado === CLIENTE_GENERICO;
    const numeroClienteGenerico =
      ventas.filter((venta) => String(venta.compradorId).startsWith(CLIENTE_GENERICO)).length + 1;
    const nombreClienteGenerico = `Cliente ${String(numeroClienteGenerico).padStart(3, "0")}`;

    const nuevaVenta = {
      id: String(Date.now()),
      fincaId: fincaSeleccionada,
      fincaNombre: finca?.nombre ?? "",
      estanqueId: estanqueSeleccionado,
      estanqueNombre: estanque?.nombre ?? "",
      pesoPromedio: Number(pesoPromedio),
      tamanoPromedio: Number(tamanoPromedio),
      kilosVendidos: Number(kilosVendidos),
      precioKilo: precioKiloNumero,
      totalVenta,
      fechaVenta,
      colaboradorId: colaboradorSeleccionado,
      colaboradorNombre: colaborador?.nombre ?? "",
      compradorId: esClienteGenerico
        ? `${CLIENTE_GENERICO}-${String(numeroClienteGenerico).padStart(3, "0")}`
        : compradorSeleccionado,
      compradorNombre: esClienteGenerico ? nombreClienteGenerico : comprador?.nombre || "",
    };

    setVentas((actual) => [nuevaVenta, ...actual]);
    setTipoMensaje("success");
    setMensaje("Venta guardada exitosamente.");
    limpiarFormulario();
    setGuardando(false);
  }, [
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoPromedio,
    tamanoPromedio,
    kilosVendidos,
    precioKiloNumero,
    colaboradorSeleccionado,
    compradorSeleccionado,
    colaboradores,
    ventas,
    totalVenta,
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
    mensaje,
    tipoMensaje,
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
    setEstanqueSeleccionado,
    handleFincaChange,
    handlePesoPromedioChange,
    handleTamanoPromedioChange,
    handleKilosVendidosChange,
    handlePrecioChange,
    handleCompradorChange,
    handleColaboradorChange,
    limpiarError,
    guardarVenta,
  };
}
