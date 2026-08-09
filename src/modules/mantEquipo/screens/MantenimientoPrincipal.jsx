/**
 * ============================================================
 * PANTALLA: ManteniminetoPrincipal
 * ============================================================
 *
 * Vista principal del módulo de mantenimiento de equipos.
 * Presenta el listado de todos los tickets en una tabla responsiva
 * con búsqueda, filtrado y accesos rápidos al toolbar.
 *
 * @dependencies - Spinner, SearchBar, Icon, Button, Alert, FilterButton, ModalError (shared)
 *               - useError (shared/context/ErrorContext) para disparar el
 *                 ModalError global cuando falla la carga de equipos o
 *                 mantenimientos (ej. backend/docker apagado).
 *               - useMantPrincipalScreen, FilaTicket, COLORS, STYLE, mantEquipoStyles
 * @validations  - Filtrado en memoria; búsqueda insensible a mayúsculas.
 *               - tableContent se construye una sola vez y se reutiliza en móvil
 *                 y PC para que ambas versiones no se desincronicen.
 *               - Sin estilos inline; todo vive en mantEquipoStyles.js.
 *               - Errores de carga (equipos/mantenimientos) se muestran con
 *                 ModalError global en lugar de un texto rojo en pantalla.
 * @navigation   - Tocar un card → /equipos/DetalleMantenimiento?id={id}.
 *               - "Registrar Ticket" → /equipos/AgregarMantenimiento.
 *               - "Ver Tareas" → /equipos/tareas.
 */

import React from "react";
import { View, ScrollView } from "react-native";

import Spinner from "../../../shared/components/Spinner.jsx";
import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import SearchBar from "../../../shared/components/SearchBar.jsx";
import FilterButton from "../../../shared/components/FilterButton.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Alert from "../../../shared/components/Alert.jsx";
import CardPress from "../../../shared/components/CardPress.jsx";
import { useError } from "../../../shared/context/ErrorContext.js";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { useMantPrincipalScreen } from "../hooks/useMantPrincipalScreen.js";
import BadgeEstado from "../components/BadgeEstado.jsx";
import { formatearFechaCorta } from "../utils/mantEquipoUtils.js";

import {
  TEXTOS_PANTALLA,
  LISTA_ESTADOS_TICKET,
  LISTA_ESTADOS_EQUIPO,
} from "../constants/mantEquipoMensajes.js";

export default function ManteniminetoPrincipalScreen(props) {
  return <ManteniminetoPrincipal {...props} />;
}

function ManteniminetoPrincipal({
  onNavigateToCreate = () => { },
  onNavigateToDetail = (id) => { },
  onNavigateToTareas = () => { },
  refreshTimestamp,
  alertaTipo,
  alertaMensaje
}) {

  const {
    ticketsFiltrados,
    busqueda,
    setBusqueda,
    cargando,
    error,
    alerta,
    activeFiltersForButton,
    handleApplyFilter,
  } = useMantPrincipalScreen({ alertaTipo, alertaMensaje, refreshTimestamp });

  const { mostrarError } = useError();

  if (error) {
    return mostrarError(error);
  }

  // Muestra spinner centrado mientras se cargan los tickets iniciales.
  if (cargando) {
    return (
      <View style={[STYLE.container, styles.spinnerContainer]}>
        <Spinner />
      </View>
    );
  }

  return (
    <>
      
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

          {ticketsFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <CustomText style={styles.emptyStateText}>{TEXTOS_PANTALLA.sinTickets}</CustomText>
            </View>
          ) : (
            <View>
              {ticketsFiltrados.map((ticket) => (
                <CardPress
                  key={ticket.id}
                  onPress={() => onNavigateToDetail(ticket.id)}
                >
                  <View style={styles.ticketCardRow}>
                    <View style={styles.ticketCardHeader}>
                      <CustomText style={styles.ticketCardId}>Ticket #{ticket.id}</CustomText>
                      <BadgeEstado estado={ticket.estado} />
                    </View>

                    <CustomText style={styles.ticketCardTitle} numberOfLines={2}>
                      {ticket.titulo}
                    </CustomText>
                    {/* Descripción ocultada en lista; solo en detalle */}
                    <View style={styles.ticketCardMetaRow}>
                      <CustomText style={styles.ticketCardMeta}>
                        {ticket.descripcion}
                      </CustomText>
                    </View>
                    <View style={styles.ticketCardMetaRow}>
                      <CustomText style={styles.ticketCardMeta}>
                        {formatearFechaCorta(ticket.fechaCreacion)}
                      </CustomText>
                    </View>
                  </View>
                </CardPress>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Botones de acción flotantes fijos en la parte inferior respetando márgenes y centrado */}
      <View style={styles.floatingFooter}>
        <View style={STYLE.contentWrapper}>
          <View style={styles.bottomButtonsRow}>
            <Button
              variant="outline"
              onPress={onNavigateToCreate}
              style={styles.btnAddMaint}
            >
              <Icon icon={ICONS.add} size={15} color={COLORS.primary} />
              <CustomText style={[styles.btnLabel, styles.btnLabelPrimary]}>{TEXTOS_PANTALLA.btnAgregarMant}</CustomText>
            </Button>
            <Button
              variant="outline"
              onPress={onNavigateToTareas}
              style={styles.btnAddTask}
            >
              <Icon icon={ICONS.clipboard} size={15} color={COLORS.warning} />
              <CustomText style={[styles.btnLabel, styles.btnLabelWarning]}>{TEXTOS_PANTALLA.btnAgregarTarea}</CustomText>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}