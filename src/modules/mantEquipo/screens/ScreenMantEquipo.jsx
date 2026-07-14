/**
 * ============================================================
 * PANTALLA: ScreenMantEquipo
 * ============================================================
 * 
 * Responsabilidad: Vista principal del módulo de mantenimiento de equipos.
 * 
 * Datos:
 * - tickets: Lista de tickets de mantenimiento cargados.
 * - busqueda: Texto de búsqueda reactiva.
 * - filtros: Criterios activos de estados y fecha.
 * 
 * Validaciones:
 * - Filtrado en memoria reactivo combinando búsqueda y múltiples filtros.
 * 
 * Navegación:
 * - Enlace directo a la pantalla de gestión de tareas.
 * 
 * Dependencias:
 * - Spinner, Button, SearchBar, FilterButton, Icon
 * - useMantEquipo, useAgregarMantenimiento, ModalAgregarMantenimiento, FilaTicket, ModalDetalleTicket, filtrarTicketsConFiltros
 */

import React, { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Spinner from "../../../shared/components/Spinner.jsx";
import Button from "../../../shared/components/Button.jsx";
import SearchBar from "../../inventarios/components/SearchBar.jsx";
import FilterButton from "../../inventarios/components/FilterButton";
import Icon from "../../../shared/components/Icons.jsx";
import { ICONS } from "../../../theme/icons.js";

import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { useMantEquipo } from "../hooks/useMantEquipo.js";
import { useAgregarMantenimiento } from "../hooks/useAgregarMantenimiento.js";
import ModalAgregarMantenimiento from "../components/ModalAgregarMantenimiento.jsx";
import FilaTicket from "../components/FilaTicket.jsx";
import ModalDetalleTicket from "../components/ModalDetalleTicket.jsx";

import {
  TEXTOS_PANTALLA,
  HEADERS_TABLA, TAREAS_DEMO,
  LISTA_ESTADOS_EQUIPO, LISTA_ESTADOS_TICKET,
} from "../constants/mantEquipoMensajes.js";
import * as MantService from "../services/mantEquipoService.js";

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

    return result;
  }, [tickets, busqueda, filtros]);

  // Muestra spinner centrado mientras se cargan los tickets iniciales.
  if (cargando) {
    return (
      <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
        <Spinner />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView style={STYLE.container} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={STYLE.contentWrapper}>

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
                expiryDate: "",
              }}
              showLowStock={false}
              showExpiryDate={false}
              buttonStyle={{ paddingVertical: 12, paddingHorizontal: 20, marginTop: 0 }}
              onApply={(pending) => {
                setFiltros({
                  estadosTicket: pending.categories || [],
                  estadosEquipo: pending.suppliers || [],
                  fecha: "",
                });
              }}
            />
            <Button
              variant="outline"
              onPress={() => router.push("/equipos/tareas")}
              style={styles.btnAddTask}
            >
              <Icon icon={ICONS.clipboard} size={15} color={COLORS.warning} />
              <Text style={[styles.btnLabel, { color: COLORS.warning }]}>{TEXTOS_PANTALLA.btnAgregarTarea}</Text>
            </Button>
            <Button
              variant="outline"
              onPress={modalHook.abrir}
              style={styles.btnAddMaint}
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
