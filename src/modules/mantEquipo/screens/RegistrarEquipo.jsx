/**
 * ============================================================
 * PANTALLA: RegistrarEquipo
 * ============================================================
 *
 * Responsabilidad:
 * Formulario para registrar un nuevo equipo en el sistema.
 * Solicita la misma información que el modal "Agregar Equipo"
 * y aplica validaciones con alertas de campos obligatorios.
 *
 * Datos:
 * - Número de serie/identificador
 * - Nombre
 * - Descripción
 * - Tipo de equipo (Aireación, Bombeo, etc.)
 * - Modelo
 * - Fecha de instalación (defecto: hoy, editable)
 * - Función del equipo
 * - Estanque asociado (opcional, con mocks)
 * - Horas para mantenimiento (opcional, defecto: 500)
 * - Estado (Activo, Inactivo, Mantenimiento)
 *
 * Validaciones:
 * - Todos los campos excepto estanque y horas son obligatorios.
 * - El borde rojo y los mensajes de error solo aparecen tras
 *   el primer intento de guardado.
 *
 * Navegación:
 * - Al guardar exitosamente, muestra alerta y limpia el formulario.
 * - Pendiente: redirigir al listado de equipos.
 *
 * Dependencias:
 * - useRegistrarEquipo (hook)
 * - equiposService (para obtener estanques mock)
 * - Componentes compartidos: Button, Card, Input, NumberInput,
 *   Select, EquipoFechaInput, Alert.
 * ============================================================
 */

import { Dimensions, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Input from "../../../shared/components/Input.jsx";
import NumberInput from "../../../shared/components/NumberInput.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";

import { COLORS } from "../../../theme/colors.js";
import { TYPOGRAPHY } from "../../../theme/typography.js";
import { STYLE } from "../../../theme/style.js";

import EquipoFechaInput from "../components/EquipoFechaInput.jsx";
import RegistrarEquipoHeader from "../components/RegistrarEquipoHeader.jsx";
import { useRegistrarEquipo } from "../hooks/useRegistrarEquipo.js";
import { equiposService } from "../services/equiposService.js";
import { styles } from "../styles/RegistrarEquipoStyles.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export default function RegistrarEquipoScreen() {
  const router = useRouter();

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

  const estanquesDisponibles = equiposService.getEstanquesDisponibles() || [];
  const hasErrors = Object.values(errores).some((valor) => valor !== "");

  return (
    <ScrollView
      style={STYLE.container}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: isLargeScreen ? 40 : 16 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={STYLE.contentWrapper}>

        <Card style={styles.card}>
          {/* Número de serie / Identificador */}
          <Input
            label="Número de serie / Identificador *"
            value={formulario.codigoInterno}
            onChangeText={(valor) => actualizarCampo("codigoInterno", valor)}
            placeholder="Ej: EQ-001"
            style={submitted && errores.codigoInterno ? styles.invalidField : undefined}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />

          {/* Nombre */}
          <Input
            label="Nombre del equipo *"
            value={formulario.nombre}
            onChangeText={(valor) => actualizarCampo("nombre", valor)}
            placeholder="Ej: Aireador principal"
            style={submitted && errores.nombre ? styles.invalidField : undefined}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />

          {/* Descripción */}
          <Input
            label="Descripción *"
            value={formulario.descripcion}
            onChangeText={(valor) => actualizarCampo("descripcion", valor)}
            placeholder="Ej: Aireador de paletas para oxigenación"
            style={submitted && errores.descripcion ? styles.invalidField : undefined}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />

          {/* Tipo de equipo */}
          <Select
            label="Tipo de equipo *"
            value={formulario.tipo}
            onChange={(valor) => actualizarCampo("tipo", valor)}
            options={tiposEquipo}
            placeholder="Seleccione el tipo"
            selectStyle={submitted && errores.tipo ? styles.invalidField : undefined}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />

          {/* Modelo */}
          <Input
            label="Modelo *"
            value={formulario.modelo}
            onChangeText={(valor) => actualizarCampo("modelo", valor)}
            placeholder="Ej: MX-2000"
            style={submitted && errores.modelo ? styles.invalidField : undefined}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />

          {/* Fecha de instalación (editable con calendario) */}
          <EquipoFechaInput
            label="Fecha de instalación *"
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

          {/* Función del equipo */}
          <Input
            label="Función del equipo *"
            value={formulario.funcionEquipo}
            onChangeText={(valor) => actualizarCampo("funcionEquipo", valor)}
            placeholder="Ej: Mantener la oxigenación constante"
            multiline
            style={[
              styles.textArea,
              submitted && errores.funcionEquipo ? styles.invalidField : undefined,
            ]}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />

          {/* Estanque asociado */}
          <Select
            label="Estanque asociado"
            value={formulario.estanqueId}
            onChange={(valor) => actualizarCampo("estanqueId", valor)}
            options={estanquesDisponibles}
            placeholder="Seleccione un estanque (opcional)"
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />

          {/* Horas para mantenimiento */}
          <NumberInput
            label="Horas para mantenimiento"
            value={String(formulario.horasMantenimiento ?? "")}
            onChangeText={(valor) => actualizarCampo("horasMantenimiento", valor)}
            min={0}
            max={99999}
            step={1}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />

          {/* Estado */}
          <Select
            label="Estado *"
            value={formulario.estado}
            onChange={(valor) => actualizarCampo("estado", valor)}
            options={estadosEquipo}
            placeholder="Seleccione el estado actual"
            selectStyle={submitted && errores.estado ? styles.invalidField : undefined}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />
        </Card>

        {/* Alerta de errores generales */}
        {submitted && hasErrors && (
          <View style={styles.errorBox}>
            <Text size={14} color={COLORS.error} style={styles.errorText}>
              Revisa los campos obligatorios marcados con * antes de guardar.
            </Text>
          </View>
        )}

        {/* Botón Guardar (outline) */}
        <Button
          variant="outline"
          onPress={guardarEquipo}
          disabled={guardando}
          style={styles.saveButton}
        >
          {guardando ? "Guardando..." : "Registrar Equipo"}
        </Button>
      </View>
    </ScrollView>
  );
}