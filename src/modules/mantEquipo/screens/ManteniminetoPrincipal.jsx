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
 * - El encabezado y las filas de la tabla se arman una sola vez (tableContent)
 *   y se reutilizan tanto en móvil (con scroll horizontal) como en PC (estático),
 *   para evitar que ambas versiones se desincronicen entre sí.
 * - Ningún estilo va inline: todo vive en mantEquipoStyles.js.
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
import { View, ScrollView, useWindowDimensions } from "react-native";


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
  LISTA_ESTADOS_TICKET,
} from "../constants/mantEquipoMensajes.js";
import { obtenerTareas } from "../services/tareasService.js";
import * as MantService from "../services/mantEquipoService.js";

const TABLE_COLS_DESKTOP = [
  "colTicket", "colDue", "colStatus", "colTitle", "colDesc", "colBy", "colActions",
];

const TABLE_COLS_MOBILE = [
  "colTicket", "colDue", "colStatus", "colTitleMobile", "colDescMobile", "colBy", "colActions",
];

export default function ManteniminetoPrincipal({
  onNavigateToCreate = () => {},
  onNavigateToDetail = (id) => {},
  onNavigateToTareas = () => {},
  refreshTimestamp,
  alertaTipo,
  alertaMensaje
}) {

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

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
      <View style={[STYLE.container, styles.spinnerContainer]}>
        <Spinner />
      </View>
    );
  }

  // Encabezado + filas de la tabla: se arma UNA sola vez y se reutiliza
  // tanto en la versión móvil (dentro del ScrollView horizontal) como en
  // la versión de escritorio (estática), para que nunca queden desincronizadas.
const cols = isMobile ? TABLE_COLS_MOBILE : TABLE_COLS_DESKTOP;

  const tableContent = (
    <View style={styles.tableContentInner}>
      <View style={styles.tableHeader}>
        {[...HEADERS_TABLA, "Acciones"].map((h, i) => (
          <View key={i} style={styles[cols[i]]}>
            <CustomText style={styles.headerCell}>{h}</CustomText>
          </View>
        ))}
      </View>

      {ticketsFiltrados.length === 0 ? (
        <View style={styles.emptyState}>
          <CustomText style={styles.emptyStateText}>{TEXTOS_PANTALLA.sinTickets}</CustomText>
        </View>
      ) : (
        ticketsFiltrados.map((item) => (
          <FilaTicket
            key={item.id}
            ticket={item}
            isMobile={isMobile}
            onVerDetalle={(t) => onNavigateToDetail(t.id)}
          />
        ))
      )}
    </View>
  );

  return (
    <View style={styles.screenRoot}>
      <ScrollView style={STYLE.container} contentContainerStyle={styles.screenScrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={STYLE.contentWrapper}>

          {/* Notificación Alerta */}
          {alerta && (
            <Alert
              variant={alerta.tipo}
              message={alerta.mensaje}
              style={styles.alertBottom}
              textStyle={styles.alertTextDark}
            />
          )}

          {/* Toolbar: búsqueda y filtro */}
          <View style={[styles.toolbar, styles.toolbarWithZIndex]}>
            <SearchBar
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder={TEXTOS_PANTALLA.placeholderBuscar}
              containerStyle={styles.searchBarFlex}
            />
            <FilterButton
              categories={LISTA_ESTADOS_TICKET}
              suppliers={MantService.ESTADOS_EQUIPO}
              activeFilters={{
                categories: filtros.estadosTicket,
                suppliers: filtros.estadosEquipo,
                units: [],
                lowStock: false,
                expiryDate: "",
              }}
              showLowStock={false}
              showExpiryDate={false}
              buttonStyle={styles.filterButtonSpacing}
              onApply={(pending) => {
                setFiltros({
                  estadosTicket: pending.categories || [],
                  estadosEquipo: pending.suppliers || [],
                  fecha: "",
                });
              }}
            />
          </View>

          {/* Tabla de tickets: Estática en PC, scroll en Móvil */}
          <View style={styles.tableWrapper}>
            {isMobile ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={true} persistentScrollbar={true}>
                <View style={styles.tableMobileScroll}>
                  {tableContent}
                </View>
              </ScrollView>
            ) : (
              tableContent
            )}
          </View>

          {/* Botones de acción debajo de la tabla */}
          <View style={styles.bottomButtonsRow}>
            <Button
              variant="outline"
              onPress={onNavigateToCreate}
              style={[styles.btnAddMaint, { flex: 1 }]}
            >
              <Icon icon={ICONS.add} size={15} color={COLORS.primary} />
              <CustomText style={[styles.btnLabel, styles.btnLabelPrimary]}>{TEXTOS_PANTALLA.btnAgregarMant}</CustomText>
            </Button>
            <Button
              variant="outline"
              onPress={onNavigateToTareas}
              style={[styles.btnAddTask, { flex: 1 }]}
            >
              <Icon icon={ICONS.clipboard} size={15} color={COLORS.warning} />
              <CustomText style={[styles.btnLabel, styles.btnLabelWarning]}>{TEXTOS_PANTALLA.btnAgregarTarea}</CustomText>
            </Button>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}