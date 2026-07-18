/**
 * PANTALLA: ScreenMantEquipo
 * Ruta: src/modules/mantEquipo/screens/ScreenMantEquipo.jsx
 *
 * Vista principal del módulo de mantenimiento de equipos.
 * Muestra la tabla de tickets, la toolbar de búsqueda/filtro y
 * orquesta los modales de creación/edición y detalle.
 */

import React, { useState, useMemo } from "react";
import { View, Pressable, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Spinner from "../../../shared/components/Spinner.jsx";
import Button  from "../../../shared/components/Button.jsx";
import Modal   from "../../../shared/components/Modal.jsx";
import SearchBar from "../../inventarios/components/SearchBar.jsx";
import Badge from "../../../shared/components/Badge.jsx";
import FilterButton from "../../inventarios/components/FilterButton";
import Icon from "../../../shared/components/Icons.jsx";
import { ICONS } from "../../../theme/icons.js";

import { COLORS } from "../../../theme/colors.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { useMantEquipo }           from "../hooks/useMantEquipo.js";
import { useAgregarMantenimiento } from "../hooks/useAgregarMantenimiento.js";
import ModalAgregarMantenimiento   from "./ModalAgregarMantenimiento.jsx";

import {
  formatearFechaCorta, etiquetaPorEstado, variantePorEstado,
} from "../utils/mantEquipoUtils.js";
import {
  TEXTOS_PANTALLA,
  HEADERS_TABLA,   TEXTOS_MODAL_DETALLE, TAREAS_DEMO,
} from "../constants/mantEquipoMensajes.js";
import * as MantService from "../services/mantEquipoService.js";

// ── Componentes internos ──────────────────────────────────────

/**
 * Badge de estado de un ticket. Si el ticket está "fuera de servicio",
 * el badge es presionable para avanzarlo a "en mantenimiento".
 *
 * @param {object}   ticket   - Ticket que contiene el estado a mostrar.
 * @param {Function} onToggle - Callback al presionar el badge (solo activo en estado FUERA_DE_SERVICIO).
 */
function BadgeEstado({ ticket }) {
  const label = etiquetaPorEstado(ticket.estado);
  const variant = variantePorEstado(ticket.estado);

  let textColor = COLORS.textSecondary;
  if (variant === "success") {
    textColor = COLORS.success;
  } else if (variant === "warning") {
    textColor = COLORS.warning;
  } else if (variant === "info") {
    textColor = COLORS.primary;
  }

  return (
    <Badge
      label={label}
      variant={variant}
      textStyle={{ color: textColor, fontWeight: "600", fontSize: 11 }}
      style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: "flex-start", marginTop: 0 }}
    />
  );
}

/**
 * Fila de la tabla que representa un ticket de mantenimiento.
 *
 * @param {object}   ticket      - Datos del ticket.
 * @param {Function} onToggle    - Callback para cambiar el estado del ticket.
 * @param {Function} onVerDetalle - Callback al presionar la fila (abre el modal de detalle).
 */
function FilaTicket({ ticket, onVerDetalle }) {
  return (
    <Pressable style={styles.row} onPress={() => onVerDetalle(ticket)}>
      <View style={styles.colTicket}><Text style={styles.ticketLink}>{ticket.id}</Text></View>
      <View style={styles.colDue}><Text style={styles.cellText}>{formatearFechaCorta(ticket.fechaCreacion)}</Text></View>
      <View style={styles.colStatus}><BadgeEstado ticket={ticket} /></View>
      <View style={styles.colTool}><Text style={styles.cellText}>{ticket.herramienta}</Text></View>
      <View style={styles.colTareas}>
        {ticket.tareas && ticket.tareas.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            {ticket.tareas.map((t, idx) => {
              const fullTask = TAREAS_DEMO.find((d) => d.value === t.value) || t;
              return (
                <Badge key={idx} label={fullTask.nombre || fullTask.label} variant="info" 
                  style={{ paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, maxWidth: "100%" }} 
                  textStyle={{ fontSize: 10, flexShrink: 1, flexWrap: "wrap" }} />
              );
            })}
          </View>
        ) : (
          <Text style={styles.cellText}>—</Text>
        )}
      </View>
      <View style={styles.colDesc}><Text style={styles.cellText} numberOfLines={2}>{ticket.descripcion}</Text></View>
      <View style={styles.colBy}>
        <Text style={styles.cellText}>{ticket.creadoPor}</Text>
        <Text style={styles.cellTextSub}>{MantService.EMPLEADOS_MOCK[ticket.creadoPor]?.id || "—"}</Text>
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <BadgeEstado ticket={ticket} />
          <Button
            variant="outline"
            onPress={onClose}
            style={{ width: 32, height: 32, borderRadius: 99, alignItems: "center", justifyContent: "center", marginTop: 0, paddingVertical: 0, paddingHorizontal: 0, borderColor: COLORS.primary }}
          >
            <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
          </Button>
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
        <Button
          variant="outline"
          onPress={() => { onClose(); onModificar(ticket); }}
          style={[styles.btnCancel, { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]}
        >
          <Icon icon={ICONS.edit} size={15} color={COLORS.primary} />
          <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 14 }}>Editar</Text>
        </Button>
        <Button
          variant="outline"
          onPress={() => { onEliminar(ticket.id); onClose(); }}
          style={[styles.btnAccept, { borderColor: COLORS.error, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }]}
        >
          <Icon icon={ICONS.delete} size={15} color={COLORS.error} />
          <Text style={{ color: COLORS.error, fontWeight: "600", fontSize: 14 }}>Eliminar</Text>
        </Button>
      </View>
    </Modal>
  );
}

const LISTA_ESTADOS_EQUIPO = [
  { label: "En funcionamiento", value: "funcionamiento" },
  { label: "En mantenimiento", value: "mantenimiento" },
  { label: "Fuera de servicio", value: "fuera_servicio" },
];

const LISTA_ESTADOS_TICKET = [
  { label: "En espera", value: "en_espera" },
  { label: "En mantenimiento", value: "en_mantenimiento" },
  { label: "Terminado", value: "Terminado" },
];

/**
 * Pantalla raíz del módulo de mantenimiento de equipos.
 * Orquesta la carga de datos, la tabla y los modales.
 */
export default function ScreenMantEquipo() {
  const router = useRouter();

  const {
    tickets, busqueda, cargando,
    setBusqueda, agregarTicket, eliminarTicket, actualizarTicket, actualizarEstadoEquipo,
  } = useMantEquipo();

  const modalHook = useAgregarMantenimiento(
    tickets,
    agregarTicket,
    actualizarTicket,
    actualizarEstadoEquipo,
    eliminarTicket
  );

  const [ticketAbierto, setTicketAbierto] = useState(null);

  const [filtros, setFiltros] = useState({
    estadosEquipo: [],
    estadosTicket: [],
    fecha: "",
  });

  const ticketsFiltrados = useMemo(() => {
    let result = tickets;

    // 1. Filtrar por búsqueda de texto
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      result = result.filter((t) => {
        const coincideCampos = ["id", "herramienta", "descripcion", "titulo", "creadoPor", "estado"].some(
          (k) => String(t[k] ?? "").toLowerCase().includes(q)
        );
        const coincideTareas = Array.isArray(t.tareas) && t.tareas.some((tar) => {
          const fullTask = TAREAS_DEMO.find((d) => d.value === tar.value) || tar;
          return (fullTask.nombre || fullTask.label || "").toLowerCase().includes(q) ||
                 (fullTask.descripcion || "").toLowerCase().includes(q);
        });
        return coincideCampos || coincideTareas;
      });
    }

    // 2. Filtrar por estado de equipo seleccionado
    if (filtros.estadosEquipo.length > 0) {
      result = result.filter((t) => {
        const equipo = MantService.EQUIPOS_MOCK?.find((e) => e.id === t.equipoId);
        const estEq = equipo?.estadoEquipo || "funcionamiento";
        return filtros.estadosEquipo.includes(estEq);
      });
    }

    // 3. Filtrar por estado de ticket seleccionado
    if (filtros.estadosTicket.length > 0) {
      result = result.filter((t) => filtros.estadosTicket.includes(t.estado));
    }

    // 4. Filtrar por fecha
    if (filtros.fecha) {
      result = result.filter((t) => {
        const d = new Date(t.fechaCreacion);
        const p = (n) => String(n).padStart(2, "0");
        const formattedT = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
        return formattedT === filtros.fecha;
      });
    }

    return result;
  }, [tickets, busqueda, filtros]);

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

          {/* Toolbar: búsqueda y acciones */}
          <View style={[styles.toolbar, { zIndex: 10, marginTop: 12 }]}>
            <SearchBar
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder={TEXTOS_PANTALLA.placeholderBuscar}
              containerStyle={{ flex: 1, minWidth: 180 }}
            />
            <FilterButton
              categories={LISTA_ESTADOS_TICKET}
              suppliers={LISTA_ESTADOS_EQUIPO}
              activeFilters={{
                categories: filtros.estadosTicket,
                suppliers: filtros.estadosEquipo,
                units: [],
                lowStock: false,
                expiryDate: filtros.fecha,
              }}
              showLowStock={false}
              showExpiryDate={true}
              buttonStyle={{ paddingVertical: 12, paddingHorizontal: 20, marginTop: 0 }}
              onApply={(pending) => {
                setFiltros({
                  estadosTicket: pending.categories || [],
                  estadosEquipo: pending.suppliers || [],
                  fecha: pending.expiryDate || "",
                });
              }}
            />
            <Button
              variant="outline"
              onPress={() => router.push("/mantEquipo/tareas")}
              style={[styles.btnAddTask, { borderColor: COLORS.warning, marginTop: 0, flexDirection: "row", alignItems: "center", gap: 6 }]}
            >
              <Icon icon={ICONS.clipboard} size={15} color={COLORS.warning} />
              <Text style={[styles.btnLabel, { color: COLORS.warning }]}>{TEXTOS_PANTALLA.btnAgregarTarea}</Text>
            </Button>
            <Button
              variant="outline"
              onPress={modalHook.abrir}
              style={[styles.btnAddMaint, { marginTop: 0, flexDirection: "row", alignItems: "center", gap: 6 }]}
            >
              <Icon icon={ICONS.add} size={15} color={COLORS.primary} />
              <Text style={[styles.btnLabel, { color: COLORS.primary }]}>{TEXTOS_PANTALLA.btnAgregarMant}</Text>
            </Button>
          </View>

          {/* Tabla de tickets */}
          <View style={styles.tableWrapper}>
            {/* Encabezado */}
            <View style={styles.tableHeader}>
              {[styles.colTicket, styles.colDue, styles.colStatus, styles.colTool, styles.colTareas, styles.colDesc, styles.colBy].map((col, i) => (
                <View key={i} style={col}>
                  <Text style={styles.headerCell}>{HEADERS_TABLA[i]}</Text>
                </View>
              ))}
            </View>

            {/* Filas */}
            {ticketsFiltrados.length === 0 ? (
              <View style={{ padding: 24, alignItems: "center" }}>
                <Text style={{ color: COLORS.textTertiary, fontSize: 14 }}>{TEXTOS_PANTALLA.sinTickets}</Text>
              </View>
            ) : (
              ticketsFiltrados.map((item) => (
                <FilaTicket key={item.id} ticket={item} onVerDetalle={setTicketAbierto} />
              ))
            )}
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
