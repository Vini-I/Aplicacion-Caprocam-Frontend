/**
 * ============================================================
 * HOOK DE DETALLE DE VENTAS
 * ============================================================
 *
 * Centraliza la lógica de carga de parámetros, filtros y
 * opciones de selección para la pantalla de detalle de ventas.
 */
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { COLORS } from "../../../theme/colors.js";
import { View } from "react-native";
import { styles } from "../styles/VentaStyles.js"
import { useMemo, useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { useWindowDimensions } from "react-native";
import { fincas } from "../../finca/screens/FincaData.js";
import { estanques } from "../../mantCrecimiento/services/EstanqueData.js";
import { obtenerIdNumericoFinca } from "./useVenta.js";

export function useDetalleVenta() {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const ventas = useMemo(() => {
    if (typeof params.ventas === "string") {
      try {
        return JSON.parse(params.ventas);
      } catch {
        return [];
      }
    }

    return [];
  }, [params.ventas]);

const fincaInicial = typeof params.fincaFiltro === "string" ? params.fincaFiltro : "";
const estanqueInicial = typeof params.estanqueFiltro === "string" ? params.estanqueFiltro : "";

  const [fincaFiltro, setFincaFiltro] = useState(fincaInicial);
  const [estanqueFiltro, setEstanqueFiltro] = useState(estanqueInicial);

  const opcionesFincas = useMemo(
    () =>
      fincas.map((finca) => ({
        label: finca.nombre,
        value: finca.codigoInterno,
      })),
    [],
  );

  const opcionesEstanques = useMemo(() => {
    const finca = fincas.find((item) => item.codigoInterno === fincaFiltro);

    if (!finca) return [];

    const fincaId = obtenerIdNumericoFinca(finca.codigoInterno);

    return estanques
      .filter(
        (estanque) => estanque.fincaNombre === finca.nombre || estanque.fincaId === fincaId,
      )
      .map((estanque) => ({
        label: `${estanque.codigo} - ${estanque.nombre}`,
        value: String(estanque.id),
      }));
  }, [fincaFiltro]);

  const ventasFiltradas = useMemo(() => {
    return (ventas || []).filter((venta) => {
      const coincideFinca = !fincaFiltro || venta.fincaId === fincaFiltro;
      const coincideEstanque = !estanqueFiltro || venta.estanqueId === estanqueFiltro;

      return coincideFinca && coincideEstanque;
    });
  }, [ventas, fincaFiltro, estanqueFiltro]);
  
const hayFiltro = Boolean(fincaFiltro  && estanqueFiltro);

  const mensajeDetalle = hayFiltro
    ? "Mostrando solo las ventas de la finca y estanque seleccionados."
    : "Seleccione una finca y un estanque para ver su historial de ventas.";

  const handleFincaChange = useCallback((value) => {
    setFincaFiltro(value);
    setEstanqueFiltro("");
  }, []);

  const handleEstanqueChange = useCallback((value) => {
    setEstanqueFiltro(value);
  }, []);

  function SectionTitle({ icon, title }) {
    return (
      <View style={styles.sectionTitle}>
        <Icon icon={icon} size={18} color={COLORS.primary} style={styles.sectionIcon} />
        <Text style={styles.sectionText}>{title}</Text>
      </View>
    );
  }
  
  function FilaDetalle({ etiqueta, valor }) {
    return (
      <View style={styles.filaDetalle}>
        <Text size={12} color={COLORS.textTertiary} style={styles.etiquetaDetalle}>
          {etiqueta}
        </Text>
  
        <Text size={14} weight="600" color={COLORS.textSecondary} style={styles.valorDetalle}>
          {valor}
        </Text>
      </View>
    );
  }
  
  function TarjetaVenta({ venta }) {
    return (
      <Card style={styles.tarjeta}>
        <View style={styles.tarjetaEncabezado}>
          <Text style={styles.nombreProducto}>
            {venta.fincaNombre} • {venta.estanqueNombre}
          </Text>
        </View>
  
        <View style={styles.filasDetalle}>
          <FilaDetalle etiqueta="Fecha" valor={venta.fechaVenta} />
          <FilaDetalle etiqueta="Total" valor={formatearMontoColones(venta.totalVenta)} />
          <FilaDetalle etiqueta="Kilos" valor={`${venta.kilosVendidos} kg`} />
          <FilaDetalle etiqueta="Precio/kg" valor={`₡ ${Number(venta.precioKilo).toLocaleString("es-CR")}`} />
          <FilaDetalle etiqueta="Colaborador" valor={venta.colaboradorNombre || "—"} />
          <FilaDetalle etiqueta="Comprador" valor={venta.compradorNombre || "—"} />
        </View>
      </Card>
    );
  }
  

  return {
    SectionTitle,
    FilaDetalle,
    TarjetaVenta,
    ventas,
    fincaFiltro,
    estanqueFiltro,
    opcionesFincas,
    opcionesEstanques,
    ventasFiltradas,
    mensajeDetalle,
    hayFiltro,
    isWide,
    handleFincaChange,
    handleEstanqueChange,
  };
}
