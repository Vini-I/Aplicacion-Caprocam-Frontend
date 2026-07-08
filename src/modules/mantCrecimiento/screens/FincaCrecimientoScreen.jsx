/**
 * ============================================================
 * PANTALLA DE CRECIMIENTO POR FINCA
 * ============================================================
 *
 * Gestiona el registro del peso actual del estanque y muestra
 * información contextual como días de cultivo y peso anterior.
 *
 * Funcionalidad:
 * - Permite seleccionar finca y estanque.
 * - Muestra información relevante del estanque.
 * - Valida campos obligatorios antes de guardar.
 * - Usa componentes compartidos para mantener el estilo del módulo.
 */

import { ScrollView, View } from "react-native";
import { styles } from "../../../modules/mantCrecimiento/styles/CrecimientoStyle.js";
import Alert from "../../../shared/components/Alert.jsx";
import BadgeLabel from "../../../shared/components/Badge.jsx";
import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";
import NumberInput from "../../../shared/components/NumberInput.jsx";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text.jsx";
import Title from "../../../shared/components/Title.jsx";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { useFincaCrecimiento } from "../hooks/useFincaCrecimiento.js";

export default function FincaCrecimientoScreen() {
  const {
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoActual,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    estanque,
    setEstanqueSeleccionado,
    setPesoActual,
    handleFincaChange,
    guardarDatos,
    submitted,
    errors,
    successMessage,
  } = useFincaCrecimiento();

  if (!estanque) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentScroll}>
        <Card style={styles.contentWrapper}>
          <Text>No se encontró un estanque válido.</Text>
        </Card>
      </ScrollView>
    );
  }

  const pesoAnteriorLabel =
    estanqueSeleccionadoObj?.pesoSemanaAnterior !== undefined &&
    estanqueSeleccionadoObj?.pesoSemanaAnterior !== null
      ? `Peso anterior: ${estanqueSeleccionadoObj.pesoSemanaAnterior} g`
      : "Peso anterior: -";

  return (
    <View style={styles.screenContainer}>
      <NavbarRegistro Titulo="Crecimiento" Subtitulo="Registro de peso" Icono="growth" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentScroll}>
        <Card style={styles.contentWrapper}>
          <View style={styles.headerRow}>
            <Icon
              icon={ICONS.growth}
              size={22}
              color={COLORS.primary}
              style={styles.headerIcon}
            />
            <Text style={styles.cardTitle}>Peso y crecimiento</Text>
          </View>

          <Select
            label="Seleccione la finca *"
            placeholder="Seleccione una finca"
            options={opcionesFincas}
            value={fincaSeleccionada}
            onChange={handleFincaChange}
          />
          {submitted && errors.finca ? <Text style={styles.errorText}>{errors.finca}</Text> : null}

          <Select
            label="Seleccione el estanque *"
            placeholder="Seleccione un estanque"
            options={estanquesFiltrados}
            value={estanqueSeleccionado}
            onChange={setEstanqueSeleccionado}
            disabled={estanqueSeleccionado !== "" && estanquesFiltrados.length === 0}
          />
          {submitted && errors.estanque ? <Text style={styles.errorText}>{errors.estanque}</Text> : null}

          <View style={styles.badgeRow}>
            <BadgeLabel
              label={`Días de cultivo: ${estanqueSeleccionadoObj?.diasCultivo ?? "-"}`}
              variant="success"
              style={styles.badgeItem}
            />
            <BadgeLabel label={pesoAnteriorLabel} variant="warning" style={styles.badgeItem} />
          </View>

          <View style={styles.inputColumn}>
            <View style={styles.inputItem}>
              <Title level={5}>Peso actual (g) *</Title>
              <NumberInput
                style={styles.sameInput}
                value={pesoActual}
                onChangeText={setPesoActual}
                step={0.5}
                min={0}
                max={1000}
              />
              {submitted && errors.peso ? <Text style={styles.errorText}>{errors.peso}</Text> : null}
            </View>
          </View>

          <Button variant="outline" onPress={guardarDatos} style={styles.submitButton}>
            Guardar
          </Button>
        </Card>
      </ScrollView>

      {successMessage ? (
        <Alert variant="success" message={successMessage} style={styles.successAlert} />
      ) : null}
    </View>
  );
}