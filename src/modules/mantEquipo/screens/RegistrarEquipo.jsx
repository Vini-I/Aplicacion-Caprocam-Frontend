/**
 * ============================================================
 * PANTALLA: RegistrarEquipo
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Formulario para registrar un nuevo equipo en el sistema.
 * Solicita la información necesaria y aplica validaciones
 * con retroalimentación visual (Alert) al usuario.
 *
 * Funcionalidad:
 * - Muestra campos para número de serie, nombre, descripción,
 *   tipo, modelo, fecha de instalación, función, estanque
 *   asociado (opcional), horas para mantenimiento y estado.
 * - Valida campos obligatorios al intentar guardar.
 * - Muestra alerta de éxito al guardar correctamente y redirige
 *   a la lista de equipos.
 * - Muestra alerta de error si hay campos incompletos o inválidos,
 *   con mensajes específicos por campo.
 * - Botón "Guardar" (relleno azul, con ícono) y "Cancelar"
 *   (outline azul, con ícono) que navega de vuelta a la lista.
 *
 * Componentes utilizados:
 * - Button, Card, Input, NumberInput, Select, Text, Alert
 * - EquipoFechaInput, RegistrarEquipoHeader
 *
 * Dependencias:
 * - useRegistrarEquipo (hook con lógica y estado)
 * - equiposService (para obtener estanques disponibles)
 * - STYLE (estilos globales)
 * ============================================================
 */

import React, { useState, useRef, useEffect } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";
import { STYLE } from "../../../theme/style";
import { ICONS } from "../../../theme/icons";

import EquipoFechaInput from "../components/EquipoFechaInput";
import RegistrarEquipoHeader from "../components/RegistrarEquipoHeader";
import { useRegistrarEquipo } from "../hooks/useRegistrarEquipo";
import { equiposService } from "../services/equiposService";
import { styles } from "../styles/RegistrarEquipoStyles";

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
    resetFormulario,
  } = useRegistrarEquipo();

  const estanquesDisponibles = equiposService.getEstanquesDisponibles() || [];
  const hasErrors = Object.values(errores).some((valor) => valor !== "");

  // Estado para alertas
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  // Función para mostrar alerta con auto-cierre
  const showAlert = (type, message) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // Manejar guardado
  const handleGuardar = async () => {
    try {
      await guardarEquipo();
      // Si llegamos aquí, el guardado fue exitoso (el hook no lanzó error)
      showAlert("success", "Equipo registrado correctamente.");
      // Redirigir a la lista de equipos después de un breve delay
      setTimeout(() => {
        router.replace("/mantEquipo/equipos");
      }, 1500);
    } catch (error) {
      // El hook lanza error con el mensaje detallado
      showAlert("danger", error.message || "Ocurrió un error al guardar el equipo.");
    }
  };

  // Manejar cancelar / cerrar
  const handleCancelar = () => {
    router.replace("/mantEquipo/equipos");
  };

  // Función auxiliar para renderizar mensaje de error solo si hay mensaje
  const renderError = (mensaje) => {
    if (mensaje && typeof mensaje === "string" && mensaje.trim().length > 0) {
      return (
        <Text size={12} color={COLORS.error} style={styles.fieldErrorText}>
          {mensaje}
        </Text>
      );
    }
    return null;
  };

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

          {/* Fecha de instalación */}
          <EquipoFechaInput
            label="Fecha de instalación *"
            value={formulario.fechaInstalacion}
            onChangeText={(valor) => actualizarCampo("fechaInstalacion", valor)}
            placeholder="Seleccione la fecha de instalación"
            inputStyle={submitted && errores.fechaInstalacion ? styles.invalidField : undefined}
            labelStyle={{ fontFamily: TYPOGRAPHY.fontFamily.medium }}
          />
          {renderError(errores.fechaInstalacion)}

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

          {/* Estanque asociado (opcional) */}
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

        {/* Alerta de éxito/error después de la acción */}
        {alert && (
          <View style={{ marginBottom: 12 }}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        {/* Botones: Cancelar (outline) y Guardar (primary) */}
        <View style={styles.buttonRow}>
          <Button
            variant="outline"
            onPress={handleCancelar}
            style={[styles.cancelButton, { flexDirection: "row", alignItems: "center", gap: 8 }]}
            disabled={guardando}
          >
            <Icon icon={ICONS.exit} size={18} color={COLORS.primary} />
            <Text style={{ color: COLORS.primary, fontWeight: "600" }}>Cancelar</Text>
          </Button>

<Button
  variant="outline"
  onPress={handleGuardar}
  disabled={guardando}
  style={{
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  }}
>
  <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
  <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
    {guardando ? "Guardando..." : "Guardar equipo"}
  </Text>
</Button>
        </View>
      </View>
    </ScrollView>
  );
}