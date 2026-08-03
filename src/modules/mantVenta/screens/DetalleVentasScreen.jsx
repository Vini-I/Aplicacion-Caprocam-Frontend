/**
 * ============================================================
 * PANTALLA DE DETALLE DE VENTAS DEL MÓDULO DE VENTAS
 * ============================================================
 *
 * Muestra el historial de ventas filtrado por finca y estanque,
 * permitiendo revisar los registros de forma organizada.
 */

import { ScrollView, View } from "react-native";

import Card from "../../../shared/components/Card.jsx";
import Alert from "../../../shared/components/Alert.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";

import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";

import { formatearMontoColones } from "../hooks/useVenta.js";
import { useDetalleVenta } from "../hooks/useDetalleVenta.js";
import { styles } from "../styles/VentaStyles.js";
import { STYLE } from "../../../theme/style.js";

export default function DetalleVentasScreen({ onEdit, success, message }) {
  const {
    SectionTitle,
    FilaDetalle,
    TarjetaVenta,
    fincaFiltro,
    estanqueFiltro,
    opcionesFincas,
    opcionesEstanques,
    ventasFiltradas,
    mensajeDetalle,
    isWide,
    modalVisible,
    descripcionEliminar,
    cancelarEliminar,
    confirmarEliminar,
    handleFincaChange,
    handleEstanqueChange,
    mostrarExito,
    mensajeExito,
  } = useDetalleVenta({ onEdit, success, message });

  const gridStyle = isWide ? styles.inputRow : styles.inputGrid;

  return (
    <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
      {mostrarExito && mensajeExito && (
        <Alert
          variant="success"
          message={mensajeExito}
          style={styles.successAlert}
          textStyle={styles.successAlertText}
        />
      )}

      <Card style={STYLE.contentWrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>Detalle de ventas</Text>
        </View>

        <SectionTitle icon={ICONS.filter} title="Filtrar ventas" />
        <Text style={styles.detalleHint}>{mensajeDetalle}</Text>
        <View style={gridStyle}>
          <View style={styles.inputItem}>
            <Select
              label="Finca"
              placeholder="Todas las fincas"
              options={opcionesFincas}
              value={fincaFiltro}
              onChange={handleFincaChange}
            />
          </View>

          <View style={styles.inputItem}>
            <Select
              label="Estanque"
              placeholder="Todos los estanques"
              options={opcionesEstanques}
              value={estanqueFiltro}
              onChange={handleEstanqueChange}
              disabled={!fincaFiltro}
            />
          </View>
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

        <ModalEliminar
          visible={modalVisible}
          title="venta"
          message={descripcionEliminar}
          onConfirm={confirmarEliminar}
          onCancel={cancelarEliminar}
        />
      </Card>
    </ScrollView>
  );
}
