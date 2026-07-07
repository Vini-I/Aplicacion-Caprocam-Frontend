import { useCallback, useEffect, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";

import { colaboradoresService } from "../../colaboradores/services/colaboradoresService.js";
import { fincas } from "../../finca/screens/FincaData.js";
import { estanques } from "../../mantCrecimiento/services/EstanqueData.js";
import { compradores as compradoresData } from "../services/CompradorData.js";

export const COMPRADOR_MANUAL = "comprador-manual";

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
  compradorManual,
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

  if (
    compradorSeleccionado === COMPRADOR_MANUAL &&
    compradorManual.trim() === ""
  ) {
    errores.compradorManual = true;
  }

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
  const [compradorManual, setCompradorManual] = useState("");
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
      { label: "Comprador manual", value: COMPRADOR_MANUAL },
      ...compradoresData.map((comprador) => ({
        label: comprador.nombre,
        value: comprador.id,
      })),
    ],
    [],
  );

  const precioKiloNumero = Number(precioKilo || 0);
  const totalVenta = Number(kilosVendidos || 0) * precioKiloNumero;

  const limpiarError = useCallback((campo) => {
    setErrores((actual) => {
      if (!actual[campo]) return actual;
      return { ...actual, [campo]: false };
    });
  }, []);

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

      if (value !== COMPRADOR_MANUAL) {
        setCompradorManual("");
        limpiarError("compradorManual");
      }
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
    setCompradorManual("");
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
      compradorManual,
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
    const esCompradorManual = compradorSeleccionado === COMPRADOR_MANUAL;

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
      compradorId: esCompradorManual ? "" : compradorSeleccionado,
      compradorNombre: esCompradorManual ? compradorManual.trim() : comprador?.nombre || "",
    };

    setVentas((actual) => [nuevaVenta, ...actual]);
    setTipoMensaje("success");
    setMensaje("Venta guardada correctamente.");
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
    compradorManual,
    colaboradores,
    totalVenta,
    fechaVenta,
    limpiarFormulario,
  ]);

  return {
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoPromedio,
    tamanoPromedio,
    kilosVendidos,
    precioKilo,
    fechaVenta,
    colaboradorSeleccionado,
    compradorSeleccionado,
    compradorManual,
    mensaje,
    tipoMensaje,
    errores,
    guardando,
    isWide,
    opcionesFincas,
    estanquesFiltrados,
    opcionesColaboradores,
    opcionesCompradores,
    precioKiloNumero,
    totalVenta,
    ventas,
    // setters directos
    setEstanqueSeleccionado,
    setCompradorManual,
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
