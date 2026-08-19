/**
 * PANTALLA: TareaFormScreen
 * Formulario para crear una nueva tarea de mantenimiento o modificar una existente.
 *
 * @dependencies - NavbarRegistro.jsx, Card.jsx, Input.jsx, Select.jsx, Button.jsx, NumberInput.jsx (shared/components), useTareaForm.js (hooks)
 * @validations  - Valida que los campos requeridos (nombre, descripción, categoría, duración) estén completos.
 * @navigation   - Redirige a la lista de tareas ('/equipos/tareas') al guardar o cancelar.
 */

import React from "react";
import { View, ScrollView } from "react-native";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/TareaFormStyles";

import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import Title from "../../../shared/components/Title";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button";
import Alert from "../../../shared/components/Alert";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import NumberInput from "../../../shared/components/NumberInput";

import { useTareaForm } from "../hooks/useTareaForm";
import { OPCIONES_CATEGORIA } from "../constants/tareasMensajes";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

export default function TareaFormScreen() {
  const {
    nombre,
    descripcion,
    categoria,
    duracion,
    errores,
    submitted,
    loading,
    cargandoDatos,
    isEditing,
    alert,
    handleChange,
    guardar,
    cancelar,
  } = useTareaForm();

  if (cargandoDatos) {
    return <View style={STYLE.container} />;
  }

  // Determinar qué mensaje mostrar: prioridad al error del servidor
  const mensajeError = errores.general || (submitted && Object.keys(errores).some(k => k !== "general" && errores[k]) ? "Revisa los campos obligatorios marcados con *" : "");

  return (
    <View style={STYLE.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={STYLE.contentWrapper}>
          {/* Formulario dentro del Card */}
          <Card style={styles.card}>
            <View style={styles.sectionTitle}>
            <Icon icon={ICONS.save} size={20} color={COLORS.primary} />
            <Title level={3}>{isEditing ? ' Editar Tarea' : ' Nueva Tarea'}</Title>
            </View>
            {/* Nombre */}
            <Input
              label="Nombre de la tarea *"
              value={nombre}
              onChangeText={(v) => handleChange("nombre", v)}
              placeholder="Ej: Cambio de aceite"
              style={submitted && errores.nombre ? styles.inputError : null}
              labelStyle={styles.label}
            />

            {/* Descripción */}
            <Input
              label="Descripción *"
              value={descripcion}
              onChangeText={(v) => handleChange("descripcion", v)}
              placeholder="Describe la tarea en detalle"
              multiline
              style={[styles.textArea, submitted && errores.descripcion ? styles.inputError : null]}
              labelStyle={styles.label}
            />

            {/* Categoría */}
            <Select
              label="Categoría *"
              options={OPCIONES_CATEGORIA}
              value={categoria}
              onChange={(v) => handleChange("categoria", v)}
              placeholder="Seleccionar categoría"
              selectStyle={submitted && errores.categoria ? styles.inputError : null}
              labelStyle={styles.label}
            />

            {/* Duración estimada */}
            <NumberInput
              label="Duración estimada (horas) *"
              value={duracion}
              onChangeText={(v) => handleChange("duracion", v)}
              min={0.5}
              max={100}
              step={0.5}
              style={submitted && errores.duracion ? styles.inputError : null}
              labelStyle={styles.label}
            />

          </Card>

          {/* ─── MENSAJES DE ERROR Y BOTÓN FUERA DEL CARD ─── */}
          <View style={styles.alertSection}>
            {/* Mostrar una sola alerta: prioridad a la del hook (server/client). */}
            {alert ? (
              <Alert variant={alert.type} message={alert.message} style={styles.alert} textStyle={styles.alertText} />
            ) : (
              mensajeError !== "" && (
                <Alert
                  variant="danger"
                  message={mensajeError}
                  style={styles.alert}
                  textStyle={styles.alertText}
                />
              )
            )}

            <View style={styles.botonesContainer}>
              <Button
                variant="outline"
                onPress={guardar}
                style={styles.btnGuardar}
                disabled={loading}
              >
                <View style={styles.contenidoBoton}>
                  <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
                  <CustomText style={styles.botonLabelPrimary}>
                    {loading ? (isEditing ? "Editando..." : "Registrando...") : (isEditing ? "Editar Tarea" : "Registrar Tarea")}
                  </CustomText>
                </View>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}