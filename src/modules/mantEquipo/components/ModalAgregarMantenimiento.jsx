/**
 * ============================================================
 * MODAL: ModalAgregarMantenimiento
 * ============================================================
 * 
 * Responsabilidad: Formulario modal para la creación y edición de tickets 
 * de mantenimiento, incluyendo selección de equipos y tareas asignadas.
 * 
 * Datos:
 * - form: Campos reactivos del ticket (titulo, descripcion, etc.).
 * - equipoSeleccionado: Datos del equipo elegido.
 * - tareasSeleccionadas: Array de tareas asignadas al ticket.
 * 
 * Validaciones:
 * - Requeridos (*): Título, Equipo, Tareas y Descripción. Borde rojo se activa post-intento.
 * 
 * Navegación:
 * - Controla el cierre automático del modal al guardar, cancelar o eliminar.
 * 
 * Dependencias:
 * - Select, Input, Button, Modal, CustomText, Icon
 * - useAgregarMantenimiento.js, EquipoDetailTicket.jsx, mantEquipoMensajes.js
 */

import React from "react";
import { View, ScrollView } from "react-native";
import Modal from "../../../shared/components/Modal.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Input from "../../../shared/components/Input.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Select from "../../../shared/components/Select.jsx";
import { ICONS } from "../../../theme/icons.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import {
  TEXTOS_MODAL_AGREGAR,
  OPCIONES_ESTADO_TICKET, TAREAS_DEMO,
} from "../constants/mantEquipoMensajes.js";
import * as MantService from "../services/mantEquipoService.js";

import EquipoDetail from "./EquipoDetailTicket.jsx";

// ── Campo solo lectura ────────────────────────────────────────
function CampoReadOnly({ label, value }) {
  return (
    <View style={styles.comboContainer}>
      <CustomText style={styles.comboLabel}>{label}</CustomText>
      <View style={[styles.comboInput, { backgroundColor: COLORS.surface }]}>
        <CustomText style={{ fontSize: 14, color: COLORS.textSecondary }}>{value}</CustomText>
      </View>
    </View>
  );
}

// ── Selector de estado (pills) ────────────────────────────────
function SelectorEstado({ value, onChange, label, opciones }) {
  return (
    <View style={styles.comboContainer}>
      <CustomText style={styles.comboLabel}>{label}</CustomText>
      <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
        {opciones.map((op) => {
          const isActive = value === op.value;
          return (
            <Button
              key={op.value}
              variant="outline"
              onPress={() => onChange(op.value)}
              style={[
                { flex: 1, marginTop: 0, paddingVertical: 8, minWidth: 80, borderColor: COLORS.primary },
                isActive && { backgroundColor: "rgba(2, 136, 209, 0.1)" }
              ]}
              textStyle={{ fontSize: 11, color: COLORS.primary, fontWeight: isActive ? "700" : "600" }}
            >
              {op.label}
            </Button>
          );
        })}
      </View>
    </View>
  );
}

// ── Modal principal ───────────────────────────────────────────
export default function ModalAgregarMantenimiento({ hook }) {
  if (!hook.visible) return null;

  const {
    form, modoEdicion,
    equipoSeleccionado, tareasSeleccionadas, errores,
    opcionesEquipos, opcionesTareas,
    cerrar, eliminar, actualizarCampo,
    seleccionarEquipoById, seleccionarTareaById, quitarEquipo, aceptar,
  } = hook;

  const T = TEXTOS_MODAL_AGREGAR;

  return (
    <Modal visible onClose={cerrar} showCloseButton={false} containerStyle={styles.modalContainer}>

      {/* Encabezado */}
      <View style={styles.detalleEncabezado}>
        <CustomText style={styles.modalTitle}>{modoEdicion ? T.tituloEdicion : T.titulo}</CustomText>
        <Button
          variant="outline"
          onPress={cerrar}
          style={{ width: 32, height: 32, borderRadius: 99, alignItems: "center", justifyContent: "center", marginTop: 0, paddingVertical: 0, paddingHorizontal: 0, borderColor: COLORS.primary }}
        >
          <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
        </Button>
      </View>

      <ScrollView style={styles.modalScroll} nestedScrollEnabled keyboardShouldPersistTaps="handled">

        {/* Fecha y Creador lado a lado */}
        <View style={styles.row2}>
          <View style={styles.halfCol}><CampoReadOnly label={T.labelFechaHora} value={form.fechaHora} /></View>
          <View style={styles.halfCol}><CampoReadOnly label={T.labelCreadoPor} value={form.creadoPor} /></View>
        </View>

        {/* Título */}
        <View style={styles.comboContainer}>
          <CustomText style={styles.comboLabel}>{T.labelTitulo}</CustomText>
          <Input value={form.titulo} onChangeText={(v) => actualizarCampo("titulo", v)} placeholder={T.placeholderTitulo}
            containerStyle={{ marginBottom: 0 }}
            style={[styles.comboInput, errores.titulo && { borderColor: COLORS.error }]} />
        </View>

        {/* Selector de Equipo */}
        <Select
          label={T.labelEquipo}
          value={form.equipoId}
          options={opcionesEquipos}
          onChange={seleccionarEquipoById}
          placeholder={T.placeholderEquipo}
          containerStyle={{ marginBottom: 12 }}
          selectStyle={[styles.comboInput, { minHeight: 45 }, errores.equipoId && { borderColor: COLORS.error }]}
          labelStyle={styles.comboLabel}
        />
        <EquipoDetail equipo={equipoSeleccionado} onQuitar={quitarEquipo} />

        {/* Estado del equipo */}
        {equipoSeleccionado && (
          <SelectorEstado label={T.labelEstadoEquipo} value={form.estadoEquipo}
            onChange={(v) => actualizarCampo("estadoEquipo", v)} opciones={MantService.ESTADOS_EQUIPO} />
        )}

        {/* Selector de Tareas — multi-selección */}
        <Select
          label={T.labelTarea}
          value=""
          options={opcionesTareas}
          onChange={seleccionarTareaById}
          placeholder={T.placeholderTarea}
          containerStyle={{ marginBottom: 12 }}
          selectStyle={[styles.comboInput, { minHeight: 45 }, errores.tareas && { borderColor: COLORS.error }]}
          labelStyle={styles.comboLabel}
        />

        {/* Detalles de Tareas Seleccionadas */}
        {tareasSeleccionadas.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            {tareasSeleccionadas.map((t) => {
              const fullTask = TAREAS_DEMO.find(td => td.value === t.value) || t;
              return (
                <View key={fullTask.value} style={[styles.equipoDetailCard, { marginBottom: 6 }]}>
                  <View style={[styles.equipoDetailRow, { alignItems: "center" }]}>
                    <CustomText style={styles.equipoDetailLabel}>Tarea</CustomText>
                    <CustomText style={styles.equipoDetailVal}>{fullTask.nombre || fullTask.label}</CustomText>
                    <Button onPress={() => seleccionarTareaById(fullTask.value)} variant="outline"
                      style={{ marginTop: 0, width: 28, height: 28, borderRadius: 99, paddingVertical: 0, paddingHorizontal: 0, justifyContent: "center", alignItems: "center", borderColor: COLORS.error }}
                    >
                      <Icon icon={ICONS.delete} size={13} color={COLORS.error} />
                    </Button>
                  </View>
                  <View style={styles.equipoDetailRow}>
                    <CustomText style={styles.equipoDetailLabel}>Descripción</CustomText>
                    <CustomText style={styles.equipoDetailVal}>{fullTask.descripcion}</CustomText>
                  </View>
                  <View style={styles.equipoDetailRow}>
                    <CustomText style={styles.equipoDetailLabel}>Duración</CustomText>
                    <CustomText style={styles.equipoDetailVal}>{fullTask.duracionEstimada} hrs</CustomText>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Estado del ticket (solo en edición) */}
        {modoEdicion && (
          <SelectorEstado label={T.labelEstado} value={form.estado}
            onChange={(v) => actualizarCampo("estado", v)} opciones={OPCIONES_ESTADO_TICKET} />
        )}

        {/* Descripción multilinea */}
        <View style={styles.comboContainer}>
          <CustomText style={styles.comboLabel}>{T.labelDescripcion}</CustomText>
          <Input value={form.descripcion} onChangeText={(v) => actualizarCampo("descripcion", v)} placeholder={T.placeholderDesc}
            multiline numberOfLines={3} containerStyle={{ marginBottom: 0 }}
            style={[styles.comboInput, { height: 80, textAlignVertical: "top" }, errores.descripcion && { borderColor: COLORS.error }]} />
        </View>

        {/* Alerta de validación obligatoria */}
        {Object.keys(errores).length > 0 && (
          <View style={{ padding: 12, backgroundColor: COLORS.errorLight, borderRadius: 8, marginTop: 10 }}>
            <CustomText style={{ color: COLORS.error, fontSize: 13, fontWeight: "600" }}>
              {T.errorValidacion}
            </CustomText>
          </View>
        )}

      </ScrollView>

      {/* Footer / Botones */}
      <View style={styles.modalFooter}>
        <Button
          variant="outline"
          onPress={cerrar}
          style={styles.btnCancel}
        >
          <Icon icon={ICONS.exit} size={15} color={COLORS.primary} />
          <CustomText style={styles.btnTextPrimary}>Cancelar</CustomText>
        </Button>
        {modoEdicion && (
          <Button
            variant="outline"
            onPress={eliminar}
            style={styles.btnDelete}
          >
            <Icon icon={ICONS.delete} size={15} color={COLORS.error} />
            <CustomText style={styles.btnTextError}>Eliminar</CustomText>
          </Button>
        )}
        <Button
          variant="outline"
          onPress={aceptar}
          style={styles.btnAccept}
        >
          <Icon icon={modoEdicion ? ICONS.save : ICONS.check} size={15} color={COLORS.primary} />
          <CustomText style={styles.btnTextPrimaryBold}>
            {modoEdicion ? "Actualizar" : "Crear"}
          </CustomText>
        </Button>
      </View>
    </Modal>
  );
}
