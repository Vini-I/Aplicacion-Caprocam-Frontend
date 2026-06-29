import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";

import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";

import { fincas } from "../../finca/screens/FincaData.js";
import { estanques } from "../../mantCrecimiento/screens/EstanqueData.js";
import { formatearMontoColones } from "../hooks/useVenta.js";
import { obtenerIdNumericoFinca } from "../hooks/useVenta.js";
import { useVentaDetalle } from "../hooks/useVentaDetalle.js";
import { styles } from "../styles/VentaStyles.js";

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

export default function DetalleVentasScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

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

  const fincaInicial = typeof params.fincaSeleccionada === "string" ? params.fincaSeleccionada : "";
  const estanqueInicial = typeof params.estanqueSeleccionado === "string" ? params.estanqueSeleccionado : "";

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
        (estanque) =>
          estanque.fincaNombre === finca.nombre || estanque.fincaId === fincaId,
      )
      .map((estanque) => ({
        label: `${estanque.codigo} - ${estanque.nombre}`,
        value: String(estanque.id),
      }));
  }, [fincaFiltro]);

  const { ventasFiltradas, mensajeDetalle } = useVentaDetalle({
    ventas,
    fincaSeleccionada: fincaFiltro,
    estanqueSeleccionado: estanqueFiltro,
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <Icon icon={ICONS.report} size={22} color={COLORS.primary} style={styles.headerIcon} />
          <Text style={styles.cardTitle}>Detalle de ventas</Text>
        </View>

        <SectionTitle icon={ICONS.filter} title="Filtrar ventas" />
        <Text style={styles.detalleHint}>{mensajeDetalle}</Text>

        <View style={styles.inputRow}>
          <View style={styles.inputItem}>
            <Select
              label="Finca"
              placeholder="Todas las fincas"
              options={opcionesFincas}
              value={fincaFiltro}
              onChange={(value) => {
                setFincaFiltro(value);
                setEstanqueFiltro("");
              }}
            />
          </View>

          <View style={styles.inputItem}>
            <Select
              label="Estanque"
              placeholder="Todos los estanques"
              options={opcionesEstanques}
              value={estanqueFiltro}
              onChange={setEstanqueFiltro}
              disabled={!fincaFiltro}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Button onPress={() => router.back()} style={styles.saveButton}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.back} size={20} color={COLORS.white} />
              <Text style={styles.buttonText}>Volver</Text>
            </View>
          </Button>
        </View>

        {ventasFiltradas.length > 0 ? (
          <View style={styles.lista}>
            {ventasFiltradas.map((venta) => (
              <TarjetaVenta key={venta.id} venta={venta} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Sin ventas registradas</Text>
            <Text style={styles.emptyDescription}>
              No hay ventas para la finca y estanque seleccionados.
            </Text>
          </View>
        )}
      </Card>
    </ScrollView>
  );
}
