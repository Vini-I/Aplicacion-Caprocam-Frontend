/**
 * ============================================================
 * PANTALLA: ManteniminetoPrincipal
 * ============================================================
 *
 * Vista principal del módulo de mantenimiento de equipos.
 * Presenta el listado de todos los tickets en una tabla responsiva
 * con búsqueda, filtrado y accesos rápidos al toolbar.
 *
 * @dependencies - Spinner, SearchBar, Icon, Button, Alert, FilterButton (shared)
 *               - useMantPrincipalScreen, FilaTicket, COLORS, STYLE, mantEquipoStyles
 * @validations  - Filtrado en memoria; búsqueda insensible a mayúsculas.
 *               - tableContent se construye una sola vez y se reutiliza en móvil
 *                 y PC para que ambas versiones no se desincronicen.
 *               - Sin estilos inline; todo vive en mantEquipoStyles.js.
 * @navigation   - Tocar un card → /equipos/DetalleMantenimiento?id={id}.
 *               - "Registrar Ticket" → /equipos/AgregarMantenimiento.
 *               - "Ver Tareas" → /equipos/tareas.
 */

import React from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";

import Spinner from "../../../shared/components/Spinner.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import FilterButton from "../../../shared/components/FilterButton.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Alert from "../../../shared/components/Alert.jsx";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { useMantPrincipalScreen } from "../hooks/useMantPrincipalScreen.js";
import FilaTicket from "../components/TablaTicket.jsx";

import {
  TEXTOS_PANTALLA,
  HEADERS_TABLA,
  LISTA_ESTADOS_TICKET,
  LISTA_ESTADOS_EQUIPO,
} from "../constants/mantEquipoMensajes.js";
import * as MantService from "../services/mantEquipoService.js";

const TABLE_COLS_DESKTOP = [
  "colTicket", "colDue", "colStatus", "colTitle", "colDesc", "colBy",
];

const TABLE_COLS_MOBILE = [
  "colTicket", "colDue", "colStatus", "colTitleMobile", "colDescMobile", "colBy",
];

export default function ManteniminetoPrincipal({
  onNavigateToCreate = () => { },
  onNavigateToDetail = (id) => { },
  onNavigateToTareas = () => { },
  refreshTimestamp,
  alertaTipo,
  alertaMensaje
}) {

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const {
    ticketsFiltrados,
    busqueda,
    setBusqueda,
    cargando,
    filtros,
    setFiltros,
    alerta,
  } = useMantPrincipalScreen({ alertaTipo, alertaMensaje, refreshTimestamp });

  // FilterButton usa categories/suppliers como keys — las mapeamos a estadosTicket/estadosEquipo
  const activeFiltersForButton = {
    categories: filtros.estadosTicket || [],
    suppliers: filtros.estadosEquipo || [],
    units: [],
    lowStock: false,
    expiryDate: "",
  };

  const handleApplyFilter = (pending) => {
    setFiltros({
      estadosTicket: pending.categories || [],
      estadosEquipo: pending.suppliers || [],
      fecha: "",
    });
  };

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
  // la versión de escritorio (estática).
  const cols = isMobile ? TABLE_COLS_MOBILE : TABLE_COLS_DESKTOP;

  const tableContent = (
    <View style={styles.tableContentInner}>
      <View style={styles.tableHeader}>
        {HEADERS_TABLA.map((h, i) => (
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
      <ScrollView
        style={STYLE.container}
        contentContainerStyle={styles.screenScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
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

          {/* Toolbar: búsqueda + filtro */}
          <View style={[styles.toolbar, styles.toolbarWithZIndex]}>
            <SearchBar
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder={TEXTOS_PANTALLA.placeholderBuscar}
              containerStyle={styles.searchBarFlex}
            />
            <FilterButton
              categories={LISTA_ESTADOS_TICKET}
              suppliers={LISTA_ESTADOS_EQUIPO}
              activeFilters={activeFiltersForButton}
              onApply={handleApplyFilter}
              showLowStock={false}
              showExpiryDate={false}
              buttonStyle={styles.filterBtn}
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

        </View>
      </ScrollView>

      {/* Botones de acción flotantes en la parte inferior */}
      <View style={styles.floatingFooter}>
        <View style={STYLE.contentWrapper}>
          <View style={styles.bottomButtonsRow}>
            <Button
              variant="outline"
              onPress={onNavigateToCreate}
              style={[styles.btnAddMaint, styles.btnFooterFlex]}
            >
              <Icon icon={ICONS.add} size={15} color={COLORS.primary} />
              <CustomText style={[styles.btnLabel, styles.btnLabelPrimary]}>{TEXTOS_PANTALLA.btnAgregarMant}</CustomText>
            </Button>
            <Button
              variant="outline"
              onPress={onNavigateToTareas}
              style={[styles.btnAddTask, styles.btnFooterFlex]}
            >
              <Icon icon={ICONS.clipboard} size={15} color={COLORS.warning} />
              <CustomText style={[styles.btnLabel, styles.btnLabelWarning]}>{TEXTOS_PANTALLA.btnAgregarTarea}</CustomText>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
