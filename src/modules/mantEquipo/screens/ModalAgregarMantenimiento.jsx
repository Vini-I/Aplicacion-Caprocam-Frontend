/**
 * ============================================================
 * MODAL: ModalAgregarMantenimiento
 * ============================================================
 * 
 * Componente modal de formulario para la creación y edición de tickets 
 * de mantenimiento, incluyendo selección de equipos y multi-tarea.
 * 
 * FUNCIONALIDAD:
 * 1. Formulario de ingreso de datos: Título, Equipo, Tareas y Descripción.
 * 2. Visualización de detalles de equipo y tareas seleccionadas en tarjetas.
 * 3. Botones para deseleccionar equipo o tareas con botón X.
 * 4. Botones de acción: Cancelar, Eliminar (si aplica) y Aceptar/Actualizar.
 * 
 * REGLAS/RESTRICCIONES:
 * - Los campos obligatorios muestran asterisco (*) desde el primer render.
 * - Los bordes de error rojos solo se muestran tras intentar guardar con campos vacíos.
 * - El card no se deforma al desplegar opciones de selects/comboboxes.
 * - Los botones usan variante outline excepto la acción principal de guardado.
 * 
 * DATOS:
 * - Datos del formulario y búsquedas manejadas por el hook useAgregarMantenimiento.
 * 
 * VALIDACIONES:
 * - Todos los campos requeridos (*): Título, Equipo, Tareas y Descripción.
 * 
 * NAVEGACIÓN:
 * - Cierre automático al cancelar, guardar o eliminar mediante callbacks.
 * 
 * DEPENDENCIAS:
 * - Components: Modal, CustomText, Button, Input.
 * - Services: mantEquipoService.js.
 */
import React from "react";
import { View, ScrollView } from "react-native";
import Modal      from "../../../shared/components/Modal.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import Button     from "../../../shared/components/Button.jsx";
import Input      from "../../../shared/components/Input.jsx";
import Icon       from "../../../shared/components/Icons.jsx";
import { ICONS }  from "../../../theme/icons.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { COLORS } from "../../../theme/colors.js";
import {
  TEXTOS_MODAL_AGREGAR, LABELS_EQUIPO_DETALLE,
  OPCIONES_ESTADO_TICKET, TAREAS_DEMO,
} from "../constants/mantEquipoMensajes.js";
import * as MantService from "../services/mantEquipoService.js";

// ── Combobox genérico con dropdown absoluto ───────────────────
function Combobox({ label, value, onChangeText, onFocus, opciones=[], mostrar, onSeleccionar, placeholder, error }) {
  return (
    <View style={[styles.comboContainer, { zIndex: mostrar ? 10 : 1 }]}>
      <CustomText style={styles.comboLabel}>{label}</CustomText>
      <Input value={value} onChangeText={onChangeText} onFocus={onFocus} placeholder={placeholder}
        containerStyle={{ marginBottom: 0 }}
        style={[styles.comboInput, error && { borderColor: COLORS.error }]} />
      {mostrar && opciones.length > 0 && (
        <View style={[styles.comboDropdown, { position: "absolute", top: 72, left: 0, right: 0, zIndex: 20 }]}>
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {opciones.map((op) => (
              <Button key={op.value ?? op.id} onPress={() => onSeleccionar(op)}
                variant="outline"
                style={[styles.comboOption, { marginTop: 0, backgroundColor: COLORS.white, borderRadius: 0 }]}
                textStyle={styles.comboOptionText}>
                {op.label ?? `${op.nombre} — ${op.serie}`}
              </Button>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ── Detalle del equipo seleccionado ──────────────────────────
function EquipoDetail({ equipo, onQuitar }) {
  if (!equipo) return null;
  return (
    <View style={styles.equipoDetailCard}>
      {LABELS_EQUIPO_DETALLE.map(([campo, etiqueta], idx) => (
        <View key={campo} style={[styles.equipoDetailRow, idx === 0 && { alignItems: "center" }]}>
          <CustomText style={styles.equipoDetailLabel}>{etiqueta}</CustomText>
          <CustomText style={styles.equipoDetailVal} numberOfLines={2}>{equipo[campo] ?? "—"}</CustomText>
          {idx === 0 && (
            <Button onPress={onQuitar} variant="outline"
              style={{ marginTop: 0, width: 28, height: 28, borderRadius: 99, paddingVertical: 0, paddingHorizontal: 0, justifyContent: "center", alignItems: "center", borderColor: COLORS.error }}
            >
              <Icon icon={ICONS.delete} size={13} color={COLORS.error} />
            </Button>
          )}
        </View>
      ))}
    </View>
  );
}

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
        {opciones.map((op) => (
          <Button key={op.value} variant={value === op.value ? "primary" : "outline"} onPress={() => onChange(op.value)}
            style={{ flex: 1, marginTop: 0, paddingVertical: 8, minWidth: 80 }}
            textStyle={{ fontSize: 11 }}>
            {op.label}
          </Button>
        ))}
      </View>
    </View>
  );
}

// ── Modal principal ───────────────────────────────────────────
export default function ModalAgregarMantenimiento({ hook }) {
  if (!hook.visible) return null;

  const {
    form, busquedaEquipo, busquedaTarea, modoEdicion,
    mostrarDropEquipo, mostrarDropTarea, equipoSeleccionado, tareasSeleccionadas, errores,
    equiposFiltrados, tareasFiltradas, cerrar, eliminar, actualizarCampo,
    setBusquedaEquipo, setBusquedaTarea, setMostrarDropEquipo, setMostrarDropTarea,
    seleccionarEquipo, seleccionarTarea, quitarEquipo, aceptar,
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

        {/* Combobox Equipo */}
        <Combobox label={T.labelEquipo} value={busquedaEquipo}
          onChangeText={(v) => { setBusquedaEquipo(v); setMostrarDropEquipo(true); }}
          onFocus={() => setMostrarDropEquipo(true)}
          opciones={equiposFiltrados} mostrar={mostrarDropEquipo}
          onSeleccionar={seleccionarEquipo} placeholder={T.placeholderEquipo} error={errores.equipoId} />
        <EquipoDetail equipo={equipoSeleccionado} onQuitar={quitarEquipo} />

        {/* Estado del equipo */}
        {equipoSeleccionado && (
          <SelectorEstado label={T.labelEstadoEquipo} value={form.estadoEquipo}
            onChange={(v) => actualizarCampo("estadoEquipo", v)} opciones={MantService.ESTADOS_EQUIPO} />
        )}

        {/* Combobox Tareas — multi-selección */}
        <Combobox label={T.labelTarea} value={busquedaTarea}
          onChangeText={(v) => { setBusquedaTarea(v); setMostrarDropTarea(true); }}
          onFocus={() => setMostrarDropTarea(true)}
          opciones={tareasFiltradas} mostrar={mostrarDropTarea}
          onSeleccionar={seleccionarTarea} placeholder={T.placeholderTarea} error={errores.tareas} />

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
                    <Button onPress={() => hook.seleccionarTarea(fullTask)} variant="outline"
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
              Revisa los campos obligatorios antes de guardar.
            </CustomText>
          </View>
        )}

      </ScrollView>

      {/* Footer / Botones */}
      <View style={styles.modalFooter}>
        <Button
          variant="outline"
          onPress={cerrar}
          style={[styles.btnCancel, { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]}
        >
          <Icon icon={ICONS.exit} size={15} color={COLORS.primary} />
          <CustomText style={{ color: COLORS.primary, fontWeight: "600", fontSize: 13 }}>Cancelar</CustomText>
        </Button>
        {modoEdicion && (
          <Button
            variant="outline"
            onPress={eliminar}
            style={[styles.btnAccept, { borderColor: COLORS.error, flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]}
          >
            <Icon icon={ICONS.delete} size={15} color={COLORS.error} />
            <CustomText style={{ color: COLORS.error, fontWeight: "600", fontSize: 13 }}>Eliminar</CustomText>
          </Button>
        )}
        <Button
          variant="primary"
          onPress={aceptar}
          style={[styles.btnAccept, { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]}
        >
          <Icon icon={modoEdicion ? ICONS.save : ICONS.check} size={15} color={COLORS.white} />
          <CustomText style={{ color: COLORS.white, fontWeight: "700", fontSize: 13 }}>
            {modoEdicion ? "Actualizar" : "Crear"}
          </CustomText>
        </Button>
      </View>
    </Modal>
  );
}
