/**
 * COMPONENTE: ModalAgregarMantenimiento
 * Ruta: src/modules/mantEquipo/screens/ModalAgregarMantenimiento.jsx
 *
 * Modal para crear o editar un ticket de mantenimiento.
 * Recibe el hook useAgregarMantenimiento completamente inicializado
 * y se limita a renderizar el estado que este expone.
 */

import React from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";

import Modal  from "../../../shared/components/Modal.jsx";
import Input  from "../../../shared/components/Input.jsx";
import Button from "../../../shared/components/Button.jsx";

import { styles } from "../styles/mantEquipoStyles.js";
import { COLORS } from "../../../theme/colors.js";
import {
  TEXTOS_MODAL_AGREGAR,
  LABELS_EQUIPO_DETALLE,
  OPCIONES_ESTADO_TICKET,
} from "../constants/mantEquipoMensajes.js";

// ── Componentes internos ──────────────────────────────────────

/**
 * Campo de texto con lista desplegable (dropdown) absolutamente posicionada.
 * Usado para buscar y seleccionar equipo o tarea.
 *
 * @param {string}   label        - Etiqueta visible sobre el campo.
 * @param {string}   value        - Texto actual del input.
 * @param {Function} onChangeText - Callback al escribir en el input.
 * @param {Function} onFocus      - Callback al enfocar el input (abre el dropdown).
 * @param {Array}    opciones      - Lista de opciones del dropdown.
 * @param {boolean}  mostrar      - Controla si el dropdown está visible.
 * @param {Function} onSeleccionar - Callback al elegir una opción.
 * @param {string}   placeholder  - Texto de placeholder del input.
 * @param {boolean}  error        - Indica si el campo tiene un error de validación.
 */
function Combobox({ label, value, onChangeText, onFocus, opciones = [], mostrar, onSeleccionar, placeholder, error }) {
  return (
    <View style={[styles.comboContainer, { zIndex: mostrar ? 10 : 1 }]}>
      <Text style={[styles.comboLabel, error && { color: COLORS.error }]}>{label}</Text>
      <TextInput
        style={[styles.comboInput, error && { borderColor: COLORS.error, backgroundColor: COLORS.errorLight }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textQuaternary}
      />
      {mostrar && opciones.length > 0 && (
        <View style={[styles.comboDropdown, { position: "absolute", top: 72, left: 0, right: 0, zIndex: 20 }]}>
          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{ maxHeight: 150 }}>
            {opciones.map((op) => (
              <Pressable key={op.value ?? op.id} style={styles.comboOption} onPress={() => onSeleccionar(op)}>
                <Text style={styles.comboOptionText}>{op.label ?? `${op.nombre} — ${op.serie}`}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

/**
 * Tarjeta con el detalle del equipo seleccionado en el combobox.
 * No renderiza nada si no hay equipo seleccionado.
 *
 * @param {object|null} equipo - Equipo seleccionado o null.
 */
function EquipoDetail({ equipo }) {
  if (!equipo) return null;
  return (
    <View style={styles.equipoDetailCard}>
      {LABELS_EQUIPO_DETALLE.map(([campo, etiqueta]) => (
        <View key={campo} style={styles.equipoDetailRow}>
          <Text style={styles.equipoDetailLabel}>{etiqueta}</Text>
          <Text style={styles.equipoDetailVal} numberOfLines={2}>{equipo[campo] ?? "—"}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Campo de solo lectura con la apariencia visual del Combobox.
 * Se usa para mostrar la fecha/hora y el usuario creador (no editables).
 *
 * @param {string} label - Etiqueta visible.
 * @param {string} value - Texto a mostrar.
 */
function CampoReadOnly({ label, value }) {
  return (
    <View style={styles.comboContainer}>
      <Text style={styles.comboLabel}>{label}</Text>
      <View style={[styles.comboInput, { backgroundColor: COLORS.surface }]}>
        <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>{value}</Text>
      </View>
    </View>
  );
}

/**
 * Selector de estado del ticket mediante botones tipo toggle.
 * Solo se muestra en modo edición. Al crear, el estado siempre
 * arranca en "fuera de servicio" y no es editable.
 *
 * @param {string}   value     - Valor del estado actualmente seleccionado.
 * @param {Function} onChange  - Callback al elegir una opción.
 * @param {string}   label     - Etiqueta visible sobre los botones.
 */
function SelectorEstado({ value, onChange, label }) {
  return (
    <View style={styles.comboContainer}>
      <Text style={styles.comboLabel}>{label}</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {OPCIONES_ESTADO_TICKET.map((op) => {
          const activo = value === op.value;
          return (
            <Pressable
              key={op.value}
              onPress={() => onChange(op.value)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor:     activo ? COLORS.primary : COLORS.secondary,
                backgroundColor: activo ? COLORS.primary : COLORS.white,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: activo ? COLORS.white : COLORS.textSecondary }}>
                {op.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Modal de creación/edición de ticket de mantenimiento.
 *
 * @param {{ hook: ReturnType<import('../hooks/useAgregarMantenimiento').useAgregarMantenimiento> }} props
 */
export default function ModalAgregarMantenimiento({ hook }) {
  const {
    visible, modoEdicion, form, busquedaEquipo, busquedaTarea,
    mostrarDropEquipo, mostrarDropTarea, equipoSeleccionado, errores,
    equiposFiltrados, tareasFiltradas, cerrar, actualizarCampo,
    setBusquedaEquipo, setBusquedaTarea,
    setMostrarDropEquipo, setMostrarDropTarea,
    seleccionarEquipo, seleccionarTarea, aceptar,
  } = hook;

  const T = TEXTOS_MODAL_AGREGAR;

  return (
    <Modal visible={visible} onClose={cerrar} showCloseButton={false} containerStyle={styles.modalContainer}>
      <Text style={[styles.modalTitle, { marginBottom: 14 }]}>
        {modoEdicion ? "Modificar Mantenimiento" : T.titulo}
      </Text>

      <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled" nestedScrollEnabled>

        {/* Fecha y Creado por — campos de solo lectura */}
        <View style={styles.row2}>
          <View style={styles.halfCol}>
            <CampoReadOnly label={T.labelFechaHora} value={form.fechaHora} />
          </View>
          <View style={styles.halfCol}>
            <CampoReadOnly label={T.labelCreadoPor} value={form.creadoPor} />
          </View>
        </View>

        {/* Título del ticket */}
        <Input
          label={T.labelTitulo}
          value={form.titulo}
          onChangeText={(v) => actualizarCampo("titulo", v)}
          placeholder={T.placeholderTitulo}
          style={errores.titulo && { borderColor: COLORS.error }}
        />

        {/* Selector de equipo */}
        <Combobox
          label={T.labelEquipo}
          value={busquedaEquipo}
          onChangeText={(v) => { setBusquedaEquipo(v); setMostrarDropEquipo(true); }}
          onFocus={() => setMostrarDropEquipo(true)}
          opciones={equiposFiltrados}
          mostrar={mostrarDropEquipo}
          onSeleccionar={seleccionarEquipo}
          placeholder={T.placeholderEquipo}
          error={errores.equipoId}
        />

        {/* Detalle del equipo seleccionado (visible solo cuando hay selección) */}
        <EquipoDetail equipo={equipoSeleccionado} />

        {/* Selector de tarea */}
        <Combobox
          label={T.labelTarea}
          value={busquedaTarea}
          onChangeText={(v) => { setBusquedaTarea(v); setMostrarDropTarea(true); }}
          onFocus={() => setMostrarDropTarea(true)}
          opciones={tareasFiltradas}
          mostrar={mostrarDropTarea}
          onSeleccionar={seleccionarTarea}
          placeholder={T.placeholderTarea}
          error={errores.tareaId}
        />

        {/* Selector de estado — solo visible en modo edición */}
        {modoEdicion && (
          <SelectorEstado
            label={T.labelEstado}
            value={form.estado}
            onChange={(v) => actualizarCampo("estado", v)}
          />
        )}

        {/* Descripción del problema */}
        <Input
          label={T.labelDescripcion}
          value={form.descripcion}
          onChangeText={(v) => actualizarCampo("descripcion", v)}
          placeholder={T.placeholderDesc}
          multiline
          style={[{ minHeight: 80 }, errores.descripcion && { borderColor: COLORS.error }]}
        />

      </ScrollView>

      <View style={styles.modalFooter}>
        <Button variant="outline" onPress={cerrar} style={styles.btnCancel}>{T.btnCancelar}</Button>
        <Button onPress={aceptar} style={styles.btnAccept}>{T.btnAceptar}</Button>
      </View>
    </Modal>
  );
}
