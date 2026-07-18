/**
 * ============================================================
 * PANTALLA: ManteniminetoPrincipal
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Vista principal que presenta el listado de todos los tickets de mantenimiento,
 *   con herramientas de búsqueda, filtrado y accesos directos al toolbar.
 * 
 * FUNCIONALIDAD:
 * - Renderiza el listado de tickets en una tabla responsiva.
 * - Barra de búsqueda reactiva por múltiples atributos del ticket y tareas.
 * - Filtros combinados por estado de ticket y estado del equipo.
 * - Notificaciones dinámicas de éxito/advertencia por banner superior.
 * 
 * DATOS / VARIABLES:
 * - tickets: Listado reactivo de tickets obtenidos del servicio.
 * - busqueda: Texto para el filtro reactivo.
 * - filtros: Criterios seleccionados para refinar la búsqueda.
 * 
 * VALIDACIONES / REGLAS:
 * - Filtrado en memoria reactivo.
 * - Búsqueda insensible a mayúsculas/minúsculas.
 * 
 * NAVEGACIÓN:
 * - "Ver detalles" redirige a /equipos/DetalleMantenimiento?id={id}.
 * - "+ Agregar Mantenimiento" redirige a /equipos/AgregarMantenimiento.
 * - "Ver Tareas" redirige a /equipos/tareas.
 * 
 * DEPENDENCIAS:
 * - Spinner, SearchBar, FilterButton, Icon, Button, Alert
 * - useMantEquipo, FilaTicket, COLORS, STYLE, styles
 * ============================================================
 */

import React, { useState, useMemo, useEffect } from "react";
import { View, ScrollView } from "react-native";

// Monkey patch de ScrollView para forzar la ocultación de scrollbars en todo el módulo
if (ScrollView.prototype && ScrollView.prototype.render) {
  const originalRender = ScrollView.prototype.render;
  ScrollView.prototype.render = function () {
    this.props = {
      ...this.props,
      showsVerticalScrollIndicator: false,
      showsHorizontalScrollIndicator: false,
    };
    return originalRender.apply(this, arguments);
  };
} else if (ScrollView.render) {
  const originalRender = ScrollView.render;
  ScrollView.render = function (props, ref) {
    const newProps = {
      ...props,
      showsVerticalScrollIndicator: false,
      showsHorizontalScrollIndicator: false,
    };
    return originalRender(newProps, ref);
  };
}

import Spinner from "../../../shared/components/Spinner.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import SearchBar from "../../inventarios/components/SearchBar.jsx";
import FilterButton from "../../inventarios/components/FilterButton";
import Icon from "../../../shared/components/Icons.jsx";
import Alert from "../../../shared/components/Alert.jsx";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { useMantEquipo } from "../hooks/useMantEquipo.js";
import FilaTicket from "../components/TablaTicket.jsx";

import {
  TEXTOS_PANTALLA,
  HEADERS_TABLA,
  LISTA_ESTADOS_EQUIPO,
  LISTA_ESTADOS_TICKET,
} from "../constants/mantEquipoMensajes.js";
import { obtenerTareas } from "../services/tareasService.js";
import * as MantService from "../services/mantEquipoService.js";

export default function ManteniminetoPrincipal({
  onNavigateToCreate = () => {},
  onNavigateToDetail = (id) => {},
  onNavigateToTareas = () => {},
  refreshTimestamp,
  alertaTipo,
  alertaMensaje
}) {

  const {
    tickets,
    busqueda,
    cargando,
    setBusqueda,
  } = useMantEquipo();

  const [filtros, setFiltros] = useState({
    estadosEquipo: [],
    estadosTicket: [],
    fecha: "",
  });

  const [alerta, setAlerta] = useState(null);
  const [tareasCatalog, setTareasCatalog] = useState([]);

  // Cargar catálogo de tareas al iniciar
  useEffect(() => {
    obtenerTareas().then(data => setTareasCatalog(data || []));
  }, []);

  // Cargar alerta si se pasa por props
  useEffect(() => {
    if (alertaTipo && alertaMensaje) {
      setAlerta({
        tipo: alertaTipo,
        mensaje: alertaMensaje,
      });
      const timer = setTimeout(() => {
        setAlerta(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alertaTipo, alertaMensaje, refreshTimestamp]);

  const ticketsFiltrados = useMemo(() => {
    let result = tickets;

    // 1. Filtrar por búsqueda de texto
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      result = result.filter((t) => {
        const coincideCampos = ["id", "descripcion", "titulo", "creadoPor", "estado"].some(
          (k) => String(t[k] ?? "").toLowerCase().includes(q)
        );
        const coincideTareas = Array.isArray(t.tareas) && t.tareas.some((tar) => {
          const fullTask = tareasCatalog.find((d) => d.id === tar.value) || tar;
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
        const estEq = equipo?.estado || "activo";
        return filtros.estadosEquipo.includes(estEq);
      });
    }

    // 3. Filtrar por estado de ticket seleccionado
    if (filtros.estadosTicket.length > 0) {
      result = result.filter((t) => filtros.estadosTicket.includes(t.estado));
    }

    return result;
  }, [tickets, busqueda, filtros, tareasCatalog]);

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
      <ScrollView style={STYLE.container} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>

          {/* Notificación Alerta */}
          {alerta && (
            <Alert
              variant={alerta.tipo}
              message={alerta.mensaje}
              style={{ marginBottom: 14 }}
              textStyle={{ color: "#000000" }}
            />
          )}

          {/* Toolbar: búsqueda y filtro */}
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
          </View>

          {/* Tabla de tickets */}
          <View style={styles.tableWrapper}>
            {/* Encabezado */}
            <View style={styles.tableHeader}>
              {[...HEADERS_TABLA, "Acciones"].map((h, i) => {
                const cols = [
                  styles.colTicket,
                  styles.colDue,
                  styles.colStatus,
                  styles.colTitle,
                  styles.colDesc,
                  styles.colBy,
                  styles.colActions
                ];
                return (
                  <View key={i} style={cols[i]}>
                    <CustomText style={styles.headerCell}>{h}</CustomText>
                  </View>
                );
              })}
            </View>

            {/* Filas */}
            {ticketsFiltrados.length === 0 ? (
              <View style={{ padding: 24, alignItems: "center" }}>
                <CustomText style={{ color: COLORS.textTertiary, fontSize: 14 }}>{TEXTOS_PANTALLA.sinTickets}</CustomText>
              </View>
            ) : (
              ticketsFiltrados.map((item) => (
                <FilaTicket
                  key={item.id}
                  ticket={item}
                  onVerDetalle={(t) => onNavigateToDetail(t.id)}
                />
              ))
            )}
          </View>

          {/* Botones de acción debajo de la tabla */}
          <View style={{ flexDirection: "row", width: "100%", gap: 12, marginTop: 16 }}>
            <Button
              variant="outline"
              onPress={onNavigateToCreate}
              style={[styles.btnAddMaint, { flex: 1 }]}
            >
              <Icon icon={ICONS.add} size={15} color={COLORS.primary} />
              <CustomText style={[styles.btnLabel, { color: COLORS.primary }]}>{TEXTOS_PANTALLA.btnAgregarMant}</CustomText>
            </Button>
            <Button
              variant="outline"
              onPress={onNavigateToTareas}
              style={[styles.btnAddTask, { flex: 1 }]}
            >
              <Icon icon={ICONS.clipboard} size={15} color={COLORS.warning} />
              <CustomText style={[styles.btnLabel, { color: COLORS.warning }]}>{TEXTOS_PANTALLA.btnAgregarTarea}</CustomText>
            </Button>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
