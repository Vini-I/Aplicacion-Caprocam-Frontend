/**
 * ============================================================
 * PANTALLA DE REGISTRO DE VENTAS DEL MÓDULO DE VENTAS
 * ============================================================
 *
 * Contiene la interfaz para registrar ventas de producto y
 * enviar la información a la lógica de negocio del módulo.
 */

import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import Alert from "../../../shared/components/Alert.jsx";
import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Input from "../../../shared/components/Input.jsx";
import NumberInput from "../../../shared/components/NumberInput.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";

import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";

import {
  COMPRADOR_MANUAL,
  formatearMontoColones,
  useVenta,
} from "../hooks/useVenta.js";
import { styles } from "../styles/VentaStyles.js";

function SectionTitle({ icon, title }) {
  return (
    <View style={styles.sectionTitle}>
      <Icon icon={icon} size={18} color={COLORS.primary} style={styles.sectionIcon} />
      <Text style={styles.sectionText}>{title}</Text>
    </View>
  );
}

export default function VentaScreen({ onDetalleVentas }) {
  const router = useRouter();

  const {
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
    totalVenta,
    ventas,
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
  } = useVenta();

  const gridStyle = isWide ? styles.inputRow : styles.inputGrid;
  const errorInputStyle = {
    borderColor: COLORS.error,
    backgroundColor: COLORS.surface,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>Registro de venta</Text>
        </View>

        {tipoMensaje === "success" && mensaje !== "" && (
          <Text style={styles.successText}>{mensaje}</Text>
        )}

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
              min={0.1}
              max={15}
              style={errores.pesoPromedio ? errorInputStyle : null}
            />
          </View>

          <View style={styles.inputItem}>
            <NumberInput
              label="Tamaño promedio (cm) *"
              value={tamanoPromedio}
              onChangeText={handleTamanoPromedioChange}
              step={0.1}
              min={0.1}
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

        <Input label="Fecha *" value={fechaVenta} editable={false} />

        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total estimado</Text>
          <Text style={styles.summaryValue}>{formatearMontoColones(totalVenta)}</Text>
        </View>

        <SectionTitle icon={ICONS.user} title="Colaborador y comprador" />

        <View style={gridStyle}>
          <View style={styles.inputItem}>
            <Select
              label="Colaborador que realiza la venta *"
              placeholder="Seleccione colaborador"
              options={opcionesColaboradores}
              value={colaboradorSeleccionado}
              onChange={handleColaboradorChange}
              selectStyle={errores.colaborador ? errorInputStyle : null}
            />
          </View>

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

        {compradorSeleccionado === COMPRADOR_MANUAL && (
          <Input
            label="Nombre del comprador *"
            placeholder="Escriba el nombre del comprador"
            value={compradorManual}
            onChangeText={(value) => {
              setCompradorManual(value);
              limpiarError("compradorManual");
            }}
            style={errores.compradorManual ? errorInputStyle : null}
          />
        )}

        {tipoMensaje === "error" && mensaje !== "" && (
          <Alert
            variant="danger"
            message={mensaje}
            style={styles.alert}
            textStyle={styles.alertText}
          />
        )}

        <View style={styles.buttonRow}>
          <Button
            onPress={guardarVenta}
            disabled={guardando}
            style={styles.saveButton}
          >
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={22} color={COLORS.white} />
              <Text style={styles.buttonText}>
                {guardando ? "Guardando..." : "Registrar venta"}
              </Text>
            </View>
          </Button>
        </View>

        <View style={styles.buttonRow}>
          <Button onPress={() => onDetalleVentas(ventas, fincaSeleccionada)} style={styles.saveButton}>
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.report} size={20} color={COLORS.white} />
              <Text style={styles.buttonText}>Mostrar detalles</Text>
            </View>
          </Button>
        </View>
      </Card>
      
    </ScrollView>
  );
}
