import { ScrollView, View } from "react-native";

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
import { STYLE } from "../../../theme/style.js";

import { CLIENTE_GENERICO, formatearMontoColones } from "../hooks/useVenta.js";
import { useVentaEditar } from "../hooks/useVentaEditar.js";
import { styles } from "../styles/VentaStyles.js";

function SectionTitle({ icon, title }) {
  return (
    <View style={styles.sectionTitle}>
      <Icon icon={icon} size={18} color={COLORS.primary} style={styles.sectionIcon} />
      <Text style={styles.sectionText}>{title}</Text>
    </View>
  );
}

export default function VentaEditarScreen({ id, onVenta }) {
  const {
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
  } = useVentaEditar({ id, onGuardado: onVenta });

  const gridStyle = isWide ? styles.inputRow : styles.inputGrid;
  const errorInputStyle = {
    borderColor: COLORS.error,
    backgroundColor: COLORS.surface,
  };

  if (cargandoVenta) {
    return (
      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <Card style={STYLE.contentWrapper}>
          <Text>Cargando venta...</Text>
        </Card>
      </ScrollView>
    );
  }

  if (!ventaOriginal) {
    return (
      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <Card style={STYLE.contentWrapper}>
          <Text>No se encontró la venta que se quiere editar.</Text>
        </Card>
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false}>
        <Card style={STYLE.contentWrapper}>
          <View style={styles.headerRow}>
            <Icon
              icon={ICONS.shrimp}
              size={22}
              color={COLORS.primary}
              style={styles.headerIcon}
            />
            <Text style={styles.cardTitle}>Editar venta</Text>
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
              onPress={guardarCambios}
              disabled={guardando}
              style={styles.saveButton}
            >
              <View style={styles.buttonContent}>
                <Icon icon={ICONS.edit} size={22} color={COLORS.primary} />
                <Text style={styles.buttonText}>
                  {guardando ? "Editando..." : "Editar Venta"}
                </Text>
              </View>
            </Button>
          </View>
        </Card>
      </ScrollView>
    </>
  );
}
