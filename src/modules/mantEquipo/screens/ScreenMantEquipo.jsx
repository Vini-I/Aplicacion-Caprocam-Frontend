/**
 * PANTALLA: ScreenMantEquipo
 * Ruta: src/modules/mantEquipo/screens/ScreenMantEquipo.jsx
 *
 * Vista principal del módulo de mantenimiento de equipos.
 * Muestra la tabla de tickets, la toolbar de búsqueda/filtro y
 * orquesta los modales de creación/edición y detalle.
 */

import React, { useState } from "react";
import { View, FlatList, TextInput, Pressable, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Spinner from "../../../shared/components/Spinner.jsx";
import Button  from "../../../shared/components/Button.jsx";
import Modal   from "../../../shared/components/Modal.jsx";

import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { useMantEquipo }           from "../hooks/useMantEquipo.js";
import { useAgregarMantenimiento } from "../hooks/useAgregarMantenimiento.js";
import ModalAgregarMantenimiento   from "./ModalAgregarMantenimiento.jsx";

import { formatearFechaCorta, etiquetaPorEstado } from "../utils/mantEquipoUtils.js";
import {
  OPCIONES_FILTRO, TEXTOS_PANTALLA,
  HEADERS_TABLA,   TEXTOS_MODAL_DETALLE,
} from "../constants/mantEquipoMensajes.js";
import * as MantService from "../services/mantEquipoService.js";

// ── Componentes internos ──────────────────────────────────────

/**
 * Select personalizado con dropdown absolutamente posicionado.
 * Permite al usuario elegir por qué campo filtrar la tabla.
 *
 * @param {string}   value       - Opción actualmente seleccionada.
 * @param {Array}    options     - Lista de opciones { label, value }.
 * @param {Function} onChange    - Callback al seleccionar una opción.
 * @param {string}   placeholder - Texto cuando no hay selección.
 */
function FiltroSelect({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const label = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <View style={{ minWidth: 160, zIndex: 100 }}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={{ height: 42, borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, backgroundColor: COLORS.white, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 }}
      >
        <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>{label}</Text>
        <Text style={{ fontSize: 16, color: COLORS.textTertiary }}>▾</Text>
      </Pressable>

      {open && (
        <View style={{ position: "absolute", top: 46, left: 0, right: 0, borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 8, backgroundColor: COLORS.white, zIndex: 200, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 10 }}>
          {options.map((op) => (
            <Pressable
              key={op.value}
              onPress={() => { onChange(op.value); setOpen(false); }}
              style={{ paddingVertical: 11, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: COLORS.secondary }}
            >
              <Text style={{ fontSize: 14, color: COLORS.textPrimary }}>{op.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Badge de estado de un ticket. Si el ticket está "fuera de servicio",
 * el badge es presionable para avanzarlo a "en mantenimiento".
 *
 * @param {object}   ticket   - Ticket que contiene el estado a mostrar.
 * @param {Function} onToggle - Callback al presionar el badge (solo activo en estado FUERA_DE_SERVICIO).
 */
function BadgeEstado({ ticket, onToggle }) {
  const esFuera = ticket.estado === MantService.ESTADOS?.FUERA_DE_SERVICIO;
  return (
    <Pressable
      onPress={(e) => { e.stopPropagation?.(); esFuera && onToggle(ticket.id); }}
      accessibilityRole="button"
    >
      <View style={esFuera ? styles.badgeFuera : styles.badgeEnMant}>
        <Text style={esFuera ? styles.badgeTextFuera : styles.badgeText}>
          {etiquetaPorEstado(ticket.estado)}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Fila de la tabla que representa un ticket de mantenimiento.
 *
 * @param {object}   ticket      - Datos del ticket.
 * @param {Function} onToggle    - Callback para cambiar el estado del ticket.
 * @param {Function} onVerDetalle - Callback al presionar la fila (abre el modal de detalle).
 */
function FilaTicket({ ticket, onToggle, onVerDetalle }) {
  return (
    <Pressable style={styles.row} onPress={() => onVerDetalle(ticket)}>
      <View style={styles.colTicket}><Text style={styles.ticketLink}>{ticket.id}</Text></View>
      <View style={styles.colDue}><Text style={styles.cellText}>{formatearFechaCorta(ticket.fechaCreacion)}</Text></View>
      <View style={styles.colStatus}><BadgeEstado ticket={ticket} onToggle={onToggle} /></View>
      <View style={styles.colTool}><Text style={styles.cellText}>{ticket.herramienta}</Text></View>
      <View style={styles.colDesc}><Text style={styles.cellText} numberOfLines={2}>{ticket.descripcion}</Text></View>
      <View style={styles.colBy}>
        <Text style={styles.cellText}>{ticket.creadoPor}</Text>
        <Text style={styles.cellTextSub}>{formatearFechaCorta(ticket.fechaCreacion)}</Text>
      </View>
    </Pressable>
  );
}

/**
 * Modal con el detalle completo de un ticket. Permite modificarlo o cancelarlo.
 * No renderiza nada si no se pasa un ticket.
 *
 * @param {object|null} ticket      - Ticket a mostrar, o null para no renderizar.
 * @param {Function}    onClose     - Cierra el modal.
 * @param {Function}    onModificar - Abre el modal de edición con el ticket actual.
 * @param {Function}    onEliminar  - Elimina el ticket y cierra el modal.
 */
function ModalDetalleTicket({ ticket, onClose, onModificar, onEliminar }) {
  if (!ticket) return null;

  const T      = TEXTOS_MODAL_DETALLE;
  const esFuera = ticket.estado === MantService.ESTADOS?.FUERA_DE_SERVICIO;

  const campos = [
    [T.campoTicketId,  ticket.id],
    [T.campoTitulo,    ticket.titulo || "—"],
    [T.campoEquipo,    ticket.herramienta],
    [T.campoEstado,    etiquetaPorEstado(ticket.estado)],
    [T.campoDesc,      ticket.descripcion],
    [T.campoCreadoPor, ticket.creadoPor],
    [T.campoFechaC,    formatearFechaCorta(ticket.fechaCreacion)],
  ];

  return (
    <Modal visible onClose={onClose} showCloseButton={false} containerStyle={styles.modalContainer}>
      <View style={styles.detalleEncabezado}>
        <Text style={styles.modalTitle}>{T.titulo}</Text>
        <View style={esFuera ? styles.badgeFuera : styles.badgeEnMant}>
          <Text style={esFuera ? styles.badgeTextFuera : styles.badgeText}>
            {etiquetaPorEstado(ticket.estado)}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.modalScroll} nestedScrollEnabled>
        {campos.map(([label, valor]) => (
          <View key={label} style={styles.detalleRow}>
            <Text style={styles.equipoDetailLabel}>{label}</Text>
            <Text style={[styles.equipoDetailVal, { flex: 2 }]}>{valor ?? "—"}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.modalFooter}>
        <Button variant="outline" onPress={() => { onClose(); onModificar(ticket); }} style={styles.btnCancel}>
          {T.btnModificar}
        </Button>
        <Button variant="danger" onPress={() => { onEliminar(ticket.id); onClose(); }} style={styles.btnAccept}>
          {T.btnCancelar}
        </Button>
      </View>
    </Modal>
  );
}

// ── Pantalla principal ────────────────────────────────────────

/**
 * Pantalla raíz del módulo de mantenimiento de equipos.
 * Orquesta la carga de datos, la tabla y los modales.
 */
export default function ScreenMantEquipo() {
  const router = useRouter();

  const {
    tickets, ticketsFiltrados, busqueda, cargando,
    setBusqueda, toggleEstado, agregarTicket, eliminarTicket, actualizarTicket,
  } = useMantEquipo();

  const modalHook = useAgregarMantenimiento(tickets, agregarTicket, actualizarTicket);

  const [filtro,        setFiltro]        = useState("");
  const [ticketAbierto, setTicketAbierto] = useState(null);

  // Muestra spinner centrado mientras se cargan los tickets iniciales.
  if (cargando) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <Spinner />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>

          {/* Botón de retroceso */}
          <Pressable onPress={() => router.back()} style={{ marginBottom: 12, alignSelf: "flex-start", padding: 4 }}>
            <Text style={{ fontSize: 22, color: COLORS.primary }}>←</Text>
          </Pressable>

          {/* Toolbar: filtro, búsqueda y acciones */}
          <View style={[styles.toolbar, { zIndex: 10 }]}>
            <FiltroSelect
              value={filtro}
              options={OPCIONES_FILTRO}
              onChange={setFiltro}
              placeholder={TEXTOS_PANTALLA.filtrarPor}
            />
            <View style={styles.searchBox}>
              <Text style={{ color: COLORS.textTertiary, fontSize: 14 }}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                value={busqueda}
                onChangeText={setBusqueda}
                placeholder={TEXTOS_PANTALLA.placeholderBuscar}
                placeholderTextColor={COLORS.textQuaternary}
              />
            </View>
            {/* TODO: conectar con el módulo de tareas cuando esté disponible */}
            <Pressable style={styles.btnAddTask}>
              <Text style={styles.btnLabel}>{TEXTOS_PANTALLA.btnAgregarTarea}</Text>
            </Pressable>
            <Pressable style={styles.btnAddMaint} onPress={modalHook.abrir}>
              <Text style={styles.btnLabel}>{TEXTOS_PANTALLA.btnAgregarMant}</Text>
            </Pressable>
          </View>

          {/* Tabla de tickets */}
          <View style={styles.tableWrapper}>
            {/* Encabezado */}
            <View style={styles.tableHeader}>
              {[styles.colTicket, styles.colDue, styles.colStatus, styles.colTool, styles.colDesc, styles.colBy].map((col, i) => (
                <View key={i} style={col}>
                  <Text style={styles.headerCell}>{HEADERS_TABLA[i]}</Text>
                </View>
              ))}
            </View>

            {/* Filas */}
            <FlatList
              data={ticketsFiltrados}
              keyExtractor={(t) => t.id}
              renderItem={({ item }) => (
                <FilaTicket ticket={item} onToggle={toggleEstado} onVerDetalle={setTicketAbierto} />
              )}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={{ padding: 24, alignItems: "center" }}>
                  <Text style={{ color: COLORS.textTertiary, fontSize: 14 }}>{TEXTOS_PANTALLA.sinTickets}</Text>
                </View>
              }
            />
          </View>

        </View>
      </ScrollView>

      {/* Modal crear / editar ticket */}
      <ModalAgregarMantenimiento hook={modalHook} />

      {/* Modal detalle ticket (visible solo cuando hay un ticket abierto) */}
      {ticketAbierto && (
        <ModalDetalleTicket
          ticket={ticketAbierto}
          onClose={() => setTicketAbierto(null)}
          onModificar={(t) => modalHook.abrirEdicion(t)}
          onEliminar={(id) => eliminarTicket(id)}
        />
      )}
    </View>
  );
}
