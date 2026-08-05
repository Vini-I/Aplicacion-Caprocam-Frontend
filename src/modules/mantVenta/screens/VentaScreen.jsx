/**
 * ============================================================
 * PANTALLA DE REGISTRO DE VENTAS DEL MÓDULO DE VENTAS
 * ============================================================
 *
 * Contiene la interfaz para registrar ventas de producto y
 * enviar la información a la lógica de negocio del módulo.
 */

import { ScrollView, View } from "react-native";

import Alert from "../../../shared/components/Alert.jsx";
import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import DateInput from "../../../shared/components/DateInput.jsx";
import NumberInput from "../../../shared/components/NumberInput.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";

import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";

import { formatearMontoColones, useVenta } from "../hooks/useVenta.js";
import { styles } from "../styles/VentaStyles.js";
import { STYLE } from "../../../theme/style";

export default function VentaScreen({ onDetalleVentas }) {
  const {
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoPromedio,
    tamanoPromedio,
    kilosVendidos,
    precioKilo,
    fechaVenta,
    compradorSeleccionado,

    submitted,
    successMessage,
    errorMessage,

    errores,
    guardando,
    opcionesFincas,
    estanquesFiltrados,
    opcionesCompradores,
    totalVenta,
    ventas,
    SectionTitle,
    setFechaVenta,
    setEstanqueSeleccionado,
    handleFincaChange,
    handlePesoPromedioChange,
    handleTamanoPromedioChange,
    handleKilosVendidosChange,
    handlePrecioChange,
    handleCompradorChange,
    handleFechaChange,
    limpiarError,
    guardarVenta,
    gridStyle,
    errorInputStyle,
  } = useVenta();

  return (
    <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
      <Card style={STYLE.contentWrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>Registro de venta</Text>
        </View>

        <SectionTitle icon={ICONS.water} title="Finca y estanque" />

        <View style={gridStyle}>
          <View style={styles.inputItem}>
            <Select
              label="Seleccione la finca *"
              placeholder="Seleccione una finca"
              options={opcionesFincas}
              value={fincaSeleccionada}
              onChange={handleFincaChange}
              selectStyle={errores.finca ? errorInputStyle : null}
            />
          </View>

          <View style={styles.inputItem}>
            <Select
              label="Seleccione el estanque *"
              placeholder="Seleccione un estanque"
              options={estanquesFiltrados}
              value={estanqueSeleccionado}
              onChange={(value) => {
                setEstanqueSeleccionado(value);
                limpiarError("estanque");
              }}
              disabled={!fincaSeleccionada}
              selectStyle={errores.estanque ? errorInputStyle : null}
            />
          </View>
        </View>

        <SectionTitle icon={ICONS.weight} title="Datos de la venta" />

        <View style={gridStyle}>
          <View style={styles.inputItem}>
            <NumberInput
              label="Peso promedio (g) *"
              value={pesoPromedio}
              onChangeText={handlePesoPromedioChange}
              step={0.1}
              min={0.0}
              max={20}
              style={errores.pesoPromedio ? errorInputStyle : null}
            />
          </View>

          <View style={styles.inputItem}>
            <NumberInput
              label="Tamaño promedio (cm) *"
              value={tamanoPromedio}
              onChangeText={handleTamanoPromedioChange}
              step={0.1}
              min={0.0}
              max={20}
              style={errores.tamanoPromedio ? errorInputStyle : null}
            />
          </View>
        </View>

        <View style={gridStyle}>
          <View style={styles.inputItem}>
            <NumberInput
              label="Cantidad vendida (kg) *"
              value={kilosVendidos}
              onChangeText={handleKilosVendidosChange}
              step={0.1}
              min={0}
              max={999999}
              style={errores.kilosVendidos ? errorInputStyle : null}
            />
          </View>

          <View style={styles.inputItem}>
            <NumberInput
              label="Precio por kilo (₡) *"
              value={precioKilo}
              onChangeText={handlePrecioChange}
              step={1}
              min={0}
              max={999999}
              style={errores.precioKilo ? errorInputStyle : null}
            />
          </View>
        </View>

        <View style={styles.inputItem}>
          <DateInput
            label="Fecha *"
            value={fechaVenta}
            onChangeText={handleFechaChange}
            allowFutureDates={true}
          />
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total estimado</Text>
          <Text style={styles.summaryValue}>
            {formatearMontoColones(totalVenta)}
          </Text>
        </View>

        <SectionTitle icon={ICONS.user} title="Comprador" />

        <View style={gridStyle}>
          <View style={styles.inputItem}>
            <Select
              label="Comprador *"
              placeholder="Seleccione comprador"
              options={opcionesCompradores}
              value={compradorSeleccionado}
              onChange={handleCompradorChange}
              selectStyle={errores.comprador ? errorInputStyle : null}
            />
          </View>
        </View>

        {submitted && errorMessage ? (
          <Alert
            variant="danger"
            message={errorMessage}
            style={styles.alert}
            textStyle={styles.alertText}
          />
        ) : null}

        {submitted && successMessage ? (
          <Alert
            variant="success"
            message={successMessage}
            style={styles.successAlert}
            textStyle={styles.successAlertText}
          />
        ) : null}

        <Button
          onPress={guardarVenta}
          disabled={guardando}
          style={styles.saveButton}
        >
          <View style={styles.buttonContent}>
            <Icon icon={ICONS.save} size={22} color={COLORS.primary} />
            <Text style={styles.buttonText}>
              {guardando ? "Guardando..." : "Registrar venta"}
            </Text>
          </View>
        </Button>

        <Button
          onPress={() => onDetalleVentas(ventas, fincaSeleccionada)}
          style={styles.saveButton}
        >
          <View style={styles.buttonContent}>
            <Icon icon={ICONS.report} size={20} color={COLORS.primary} />
            <Text style={styles.buttonText}>Mostrar detalles</Text>
          </View>
        </Button>
      </Card>
    </ScrollView>
  );
}