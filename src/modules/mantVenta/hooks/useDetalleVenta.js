/**
 * ============================================================
 * HOOK DE DETALLE DE VENTAS
 * ============================================================
 *
 * Centraliza la lógica de carga de parámetros, filtros y
 * opciones de selección para la pantalla de detalle de ventas.
 */
import { fincaService } from "../../finca/services/finca.service.js";
import { estanqueService } from "../../estanques/services/estanque.service.js";
import { getVentas, deleteVenta } from "../services/mantVentas.service.js";

import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Card from "../../../shared/components/Card.jsx";
import Button from "../../../shared/components/Button.jsx";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors.js";
import { View } from "react-native";
import { styles } from "../styles/VentaStyles.js";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useWindowDimensions } from "react-native";

export function useDetalleVenta({ onEdit  } = {}) {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const [fincas, setFincas] = useState([]);
  const [estanques, setEstanques] = useState([]);

  useEffect(() => {
    let activo = true;

    async function cargarCatalogos() {
      const [dataFincas, dataEstanques] = await Promise.all([
        fincaService.getFincas(),
        estanqueService.getEstanques(),
      ]);

      if (activo) {
        setFincas(dataFincas);
        setEstanques(dataEstanques);
      }
    }

    cargarCatalogos();

    return () => {
      activo = false;
    };
  }, []);

  const [ventas, setVentas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargarVentas() {
      const data = await getVentas();

      if (activo) {
        setVentas(data);
      }
    }

    cargarVentas();

    return () => {
      activo = false;
    };
  }, []);

  const fincaInicial =
    typeof params.fincaFiltro === "string" ? params.fincaFiltro : "";
  const estanqueInicial =
    typeof params.estanqueFiltro === "string" ? params.estanqueFiltro : "";

  const [fincaFiltro, setFincaFiltro] = useState(fincaInicial);
  const [estanqueFiltro, setEstanqueFiltro] = useState(estanqueInicial);

  const opcionesFincas = useMemo(
    () =>
      fincas.map((finca) => ({
        label: finca.nombreFinca,
        value: finca.id,
      })),
    [fincas],
  );

  const opcionesEstanques = useMemo(() => {
    if (!fincaFiltro) return [];

    return estanques
      .filter((estanque) => estanque.idFinca === Number(fincaFiltro))
      .map((estanque) => ({
        label: estanque.codigo,
        value: estanque.id,
      }));
  }, [fincaFiltro, estanques]);

  const ventasFiltradas = useMemo(() => {
    return (ventas || []).filter((venta) => {
      const coincideFinca =
        !fincaFiltro || venta.finca_id === Number(fincaFiltro);
      const coincideEstanque =
        !estanqueFiltro || venta.estanque_id === Number(estanqueFiltro);

      return coincideFinca && coincideEstanque;
    });
  }, [ventas, fincaFiltro, estanqueFiltro]);

  const hayFiltro = Boolean(fincaFiltro && estanqueFiltro);

  const mensajeDetalle = hayFiltro
    ? "Mostrando solo las ventas de la finca y estanque seleccionados."
    : "Seleccione una finca y un estanque para ver su historial de ventas.";

  const descripcionEliminar = useMemo(() => {
    if (!ventaSeleccionada) return "";

    const finca = fincas.find((item) => item.id === ventaSeleccionada.finca_id);
    const estanque = estanques.find(
      (item) => item.id === ventaSeleccionada.estanque_id,
    );

    return `${finca?.nombreFinca ?? "Finca"} • ${estanque?.codigo ?? "Estanque"} (${ventaSeleccionada.fecha ?? ""})`;
  }, [ventaSeleccionada, fincas, estanques]);

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

  function FilaDetalle({ etiqueta, valor }) {
    return (
      <View style={styles.filaDetalle}>
        <Text
          size={12}
          color={COLORS.textTertiary}
          style={styles.etiquetaDetalle}
        >
          {etiqueta}
        </Text>

        <Text
          size={14}
          weight="600"
          color={COLORS.textSecondary}
          style={styles.valorDetalle}
        >
          {valor}
        </Text>
      </View>
    );
  }

  function TarjetaVenta({ venta }) {
    const finca = fincas.find((item) => item.id === venta.finca_id);
    const estanque = estanques.find((item) => item.id === venta.estanque_id);

    return (
      <Card style={styles.tarjeta}>
        <View style={styles.tarjetaEncabezado}>
          <Text style={styles.nombreProducto}>
            {finca?.nombreFinca ?? "Finca"} • {estanque?.codigo ?? "Estanque"}
          </Text>

          <View style={styles.buttonsCrud}>
            <Button
              style={styles.delete}
              onPress={() => abrirModalEliminar(venta)}>
              <Icon icon={ICONS.delete} style={[styles.deleteIcon]} size={15} />
              <Text size={15} style={{ color: COLORS.error }}>
                Eliminar
              </Text>
            </Button>
            <Button style={styles.edit} onPress={() => onEdit?.(venta.id)}>
               <Icon icon={ICONS.edit} style={styles.editIcon} size={16} />
              <Text size={15} style={{ color: COLORS.primary }}>
                Editar
              </Text>
            </Button>
          </View>
        </View>

        <View style={styles.filasDetalle}>
          <FilaDetalle etiqueta="Fecha" valor={venta.fecha} />
          <FilaDetalle
            etiqueta="Total"
            valor={formatearMontoColones(venta.total)}
          />
          <FilaDetalle
            etiqueta="Kilos"
            valor={`${venta.cantidad_vendida} kg`}
          />
          <FilaDetalle
            etiqueta="Precio/kg"
            valor={`₡ ${Number(venta.precio_kilo).toLocaleString("es-CR")}`}
          />
        </View>
      </Card>
    );
  }

  function abrirModalEliminar(venta) {
    setVentaSeleccionada(venta);
    setModalVisible(true);
  }

  function cancelarEliminar() {
    setModalVisible(false);
    setVentaSeleccionada(null);
  }

  async function confirmarEliminar() {
    if (!ventaSeleccionada) return;

    setEliminando(true);

    try {
      await deleteVenta(ventaSeleccionada.id);
      setVentas((actual) =>
        actual.filter((venta) => venta.id !== ventaSeleccionada.id),
      );
    } catch (error) {
      console.error("No se pudo eliminar la venta:", error);
    } finally {
      setEliminando(false);
      setModalVisible(false);
      setVentaSeleccionada(null);
    }
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
    modalVisible,
    descripcionEliminar,
    eliminando,
    confirmarEliminar,
    cancelarEliminar,
    handleFincaChange,
    handleEstanqueChange,
  };
}

function formatearMontoColones(value) {
  const numero = Math.round(Number(value) || 0);
  return `₡ ${String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
