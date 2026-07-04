/**
 * ============================================================
 * PANTALLA: RegistrarEquipo
 * ============================================================
 *
 * Formulario para registrar un equipo del módulo de mantenimiento.
 * La validación se muestra solo después del primer intento de guardado.
 * Ruta: src/modules/mantEquipo/screens/RegistrarEquipo.jsx
 * Dependencias: useRegistrarEquipo, EquipoSelect, DateInput, Input.
 */

import { Dimensions, ScrollView, View } from "react-native";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Input from "../../../shared/components/Input.jsx";
import Text from "../../../shared/components/Text.jsx";

import { COLORS } from "../../../theme/colors.js";
import { TYPOGRAPHY } from "../../../theme/typography.js";

import EquipoSelect from "../components/EquipoSelect.jsx";
import EquipoFechaInput from "../components/EquipoFechaInput.jsx";
import RegistrarEquipoHeader from "../components/RegistrarEquipoHeader.jsx";
import { useRegistrarEquipo } from "../hooks/useRegistrarEquipo.js";
import { styles } from "../styles/RegistrarEquipoStyles.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export default function RegistrarEquipoScreen() {
  const {
    formulario,
    errores,
    submitted,
    guardando,
    tiposEquipo,
    estadosEquipo,
    actualizarCampo,
    guardarEquipo,
  } = useRegistrarEquipo();

  const hasErrors = Object.values(errores).some((valor) => valor !== "");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: isLargeScreen ? 40 : 16 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.contentWrapper}>
        <RegistrarEquipoHeader
          title="Registro de Equipo"
          subtitle="Mantenimiento de equipos > Registro de Equipo"
        />

        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Input
                label="Identificador*"
                value={formulario.codigoInterno}
                onChangeText={(valor) => actualizarCampo("codigoInterno", valor)}
                placeholder="Ej: EQ-001"
                style={submitted && errores.codigoInterno ? styles.invalidField : undefined}
                labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
              />
            </View>

            <View style={styles.column}>
              <Input
                label="Descripción*"
                value={formulario.descripcion}
                onChangeText={(valor) => actualizarCampo("descripcion", valor)}
                placeholder="Ej: Aireador principal del estanque 3"
                style={submitted && errores.descripcion ? styles.invalidField : undefined}
                labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
              />
            </View>
          </View>

          <View style={styles.sectionSpacer} />

          <View style={styles.row}>
            <View style={styles.column}>
              <EquipoFechaInput
                label="Fecha de instalación*"
                value={formulario.fechaInstalacion}
                onChangeText={(valor) => actualizarCampo("fechaInstalacion", valor)}
                placeholder="Seleccione la fecha de instalación"
                inputStyle={submitted && errores.fechaInstalacion ? styles.invalidField : undefined}
                labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
              />
              {submitted && errores.fechaInstalacion && (
                <Text size={12} color={COLORS.error} style={styles.fieldErrorText}>
                  {errores.fechaInstalacion}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.sectionSpacer} />

          <Input
            label="Función del equipo*"
            value={formulario.funcionEquipo}
            onChangeText={(valor) => actualizarCampo("funcionEquipo", valor)}
            placeholder="Ej: Mantener la oxigenación constante en el estanque"
            multiline
            containerStyle={styles.fullWidth}
            style={[
              styles.textArea,
              submitted && errores.funcionEquipo ? styles.invalidField : undefined,
            ]}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />

          <View style={styles.selectsArea}>
            <EquipoSelect
              label="Tipo*"
              value={formulario.tipo}
              onChange={(valor) => actualizarCampo("tipo", valor)}
              options={tiposEquipo}
              placeholder="Seleccione el tipo de equipo"
              selectStyle={submitted && errores.tipo ? styles.invalidField : undefined}
              labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
            />

            <EquipoSelect
              label="Estado*"
              value={formulario.estado}
              onChange={(valor) => actualizarCampo("estado", valor)}
              options={estadosEquipo}
              placeholder="Seleccione el estado actual"
              selectStyle={submitted && errores.estado ? styles.invalidField : undefined}
              labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
            />
          </View>
        </Card>

        {submitted && hasErrors && (
          <View style={styles.errorBox}>
            <Text size={14} color={COLORS.error} style={styles.errorText}>
              Revisa los campos obligatorios marcados con * antes de guardar.
            </Text>
          </View>
        )}

        <Button onPress={guardarEquipo} disabled={guardando} style={styles.saveButton}>
          <View style={styles.buttonContent}>
            <Text size={16} color={COLORS.white} style={styles.buttonText}>
              {guardando ? "Guardando..." : "Registrar Equipo"}
            </Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  );
}