/**
 * ============================================================
 * PANTALLA: DetalleMantenimiento
 * ============================================================
 *
 * Muestra la ficha completa de un ticket de mantenimiento:
 * datos del ticket, equipo asociado, lista de tareas con su
 * estado, desglose de costos y banner temporal de éxito.
 *
 * @dependencies - useDetalleMantenimiento (hooks)
 *               - Card, Button, Icon, CustomText, Alert, BadgeEstado (shared)
 *               - ModalConfirmarEliminar, EquipoDetail (mantEquipo)
 *               - mantEquipoStyles, getTareaBadgeStyle, getTareaBadgeTextStyle
 * @validations  - Comportamiento seguro si el ticket no existe (estado null).
 *               - Badge de estado e icono dinámicos por tarea (realizada/pendiente).
 * @navigation   - "Regresar" y éxito de eliminar → /equipos/mantEquipo.
 *               - "Editar" → /equipos/EditarMantenimiento?id={id}.
 */

import React from "react";
import { View, ScrollView } from "react-native";

import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Card from "../../../shared/components/Card.jsx";
import Alert from "../../../shared/components/Alert.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/mantEquipoStyles.js";
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";
import BadgeEstado from "../components/BadgeEstado.jsx";
import EquipoDetail from "../components/EquipoDetailTicket.jsx";
import { formatDate } from "../../../shared/utils/dateUtils.js";

import { useDetalleMantenimiento } from "../hooks/useDetalleMantenimiento.js";
import { getTareaBadgeStyle, getTareaBadgeTextStyle } from "../styles/mantEquipoStyles.js";
import { TEXTOS_MODAL_AGREGAR } from "../constants/mantEquipoMensajes.js";

export default function DetalleMantenimientoScreen({
  id,
  alertaTipo,
  alertaMensaje,
  onNavigateToEdit = (id) => {},
  onNavigateToMain = (params) => {}
}) {

  const {
    ticket,
    equipo,
    alerta,
    cargando,
    showConfirmModal,
    tareasCatalog,
    productosSeleccionados,
    abrirModalEliminar,
    cerrarModalEliminar,
    confirmDelete,
  } = useDetalleMantenimiento({ id, alertaTipo, alertaMensaje, onNavigateToMain });

  if (cargando) {
    return (
      <View style={[STYLE.container, styles.spinnerContainer]}>
        <Spinner />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={[STYLE.container, styles.spinnerContainer]}>
        <CustomText style={styles.errorText}>Ticket no encontrado.</CustomText>
        <Button variant="outline" onPress={() => onNavigateToMain({})} style={styles.btnMarginTop}>
          Regresar a lista
        </Button>
      </View>
    );
  }

  const SectionTitle = ({ icon, title }) => (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={18} color={COLORS.primary} style={styles.sectionTitleIcon} />
      <CustomText style={styles.sectionTitleText}>{title}</CustomText>
    </View>
  );

  return (
    <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={[STYLE.contentWrapper, styles.screenFormContent]}>

        {alerta && (
          <Alert variant={alerta.tipo} message={alerta.mensaje} style={styles.alertBottom} textStyle={styles.alertTextDark} />
        )}

        {/* Sección: IDENTIFICACIÓN Y GENERAL */}
        <Card style={[styles.card, styles.cardSection]}>
          <View style={styles.ticketHeaderRow}>
            <SectionTitle icon={ICONS.document} title={`TICKET #${ticket.id}`} />
            <BadgeEstado estado={ticket.estado} />
          </View>

          {/* Información Básica */}
          <View style={styles.infoBlock}>
            <CustomText style={styles.infoLabel}>Título</CustomText>
            <CustomText style={styles.infoValueLg}>{ticket.titulo}</CustomText>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoRowItem}>
              <CustomText style={styles.infoLabel}>Creado Por</CustomText>
              <CustomText style={styles.infoValue}>{ticket.creadoPor}</CustomText>
            </View>
            <View style={styles.infoRowItem}>
              <CustomText style={styles.infoLabel}>Fecha Creación</CustomText>
              <CustomText style={styles.infoValue}>
                {formatDate(new Date(ticket.fechaCreacion))}
              </CustomText>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <CustomText style={styles.infoLabel}>Tipo de Personal Asignado</CustomText>
            <CustomText style={styles.infoValue}>
              {ticket.tipoPersonal === "externo" ? "Trabajador Externo" : "Trabajador Interno"}
            </CustomText>
          </View>

          {/* Descripción */}
          <View style={styles.infoBlockSmall}>
            <CustomText style={styles.infoLabel}>Descripción</CustomText>
            <CustomText style={styles.infoValueDesc}>
              {ticket.descripcion}
            </CustomText>
          </View>
        </Card>

        {/* Sección: DETALLES DEL EQUIPO */}
        <Card style={[styles.card, styles.cardSection]}>
          <SectionTitle icon={ICONS.tools} title="DETALLES DEL EQUIPO" />
          <EquipoDetail equipo={equipo} horasUsoIngreso={ticket.horasUsoIngreso} />
        </Card>

        {/* Sección: TAREAS ASIGNADAS */}
        <Card style={[styles.card, styles.cardSection]}>
          <SectionTitle icon={ICONS.clipboard} title="TAREAS ASIGNADAS" />
          <View style={styles.tareaGapList}>
        {ticket.tareas && ticket.tareas.length > 0 ? (
              ticket.tareas.map((t, idx) => {
                const realizadaColor = t.realizada ? COLORS.success : COLORS.textTertiary;
                return (
                  <View key={idx} style={styles.tareaItemContainer}>
                    <View style={styles.tareaItemHeader}>
                      <View style={styles.tareaItemLeft}>
                        <Icon icon={t.realizada ? ICONS.check : ICONS.clock} size={14} color={realizadaColor} />
                        <CustomText style={styles.tareaItemNombre}>
                          {t.nombre || t.label}
                        </CustomText>
                      </View>
                      <View style={[styles.tareaBadgeBase, getTareaBadgeStyle(t.realizada)]}>
                        <CustomText style={[styles.tareaBadgeTextBase, getTareaBadgeTextStyle(t.realizada)]}>
                          {t.realizada ? "Realizada" : "Pendiente"}
                        </CustomText>
                      </View>
                    </View>
                    {t.categoria && (
                      <CustomText style={styles.tareaItemMeta}>
                        Categoría: {t.categoria === "preventivo" || t.categoria === "Preventivo" ? "Preventivo" : "Correctivo"}
                      </CustomText>
                    )}
                    {t.duracionEstimada !== undefined && t.duracionEstimada > 0 && (
                      <CustomText style={styles.tareaItemMetaMin}>
                        Duración estimada: {t.duracionEstimada} hrs
                      </CustomText>
                    )}
                    {t.descripcion && (
                      <CustomText style={styles.tareaItemMetaTop}>
                        {t.descripcion}
                      </CustomText>
                    )}
                  </View>
                );
              })
            ) : (
              <CustomText style={styles.tareaEmptyText}>Ninguna tarea asignada.</CustomText>
            )}
          </View>
        </Card>

        {/* Sección: COSTOS DEL TICKET */}
        <Card style={[styles.card, styles.cardSection]}>
          <SectionTitle icon={ICONS.money} title="COSTOS DEL TICKET" />

          {(() => {
            const costoManoObraVal = parseFloat(ticket.costoManoObra) || 0;
            const costoProductosTotal = productosSeleccionados.reduce((sum, p) => {
              const cant = parseInt(p.cantidad || 1, 10);
              const pu = parseFloat(p.precioUnidad || p.precio || 0);
              const sub = p.subtotal !== undefined ? parseFloat(p.subtotal) : (cant * pu);
              return sum + sub;
            }, 0);

            const costoTotalCalculado = costoManoObraVal + costoProductosTotal;
            const costoTotalFinal = (ticket.costoTotal !== undefined && ticket.costoTotal >= costoTotalCalculado)
              ? ticket.costoTotal
              : costoTotalCalculado;

            return (
              <View style={styles.costoBox}>
                {/* Subtítulo de productos en negrita al estilo 'Detalles de la máquina' */}
                <View style={styles.equipoDetailHeader}>
                  <CustomText style={styles.equipoDetailTitle}>Productos utilizados</CustomText>
                </View>

                {productosSeleccionados.length > 0 ? (
                  productosSeleccionados.map((p) => {
                    const cant = parseInt(p.cantidad || 1, 10);
                    const pu = parseFloat(p.precioUnidad || p.precio || 0);
                    const subtotal = p.subtotal !== undefined ? parseFloat(p.subtotal) : (cant * pu);
                    return (
                      <View key={p.id || p.productoId} style={[styles.equipoDetailRow, styles.costoProductoRow]}>
                        <CustomText style={styles.equipoDetailLabel}>{p.nombre} {cant > 1 ? `(x${cant})` : ""}</CustomText>
                        <CustomText style={styles.equipoDetailVal}>₡{subtotal.toLocaleString("es-CR")}</CustomText>
                      </View>
                    );
                  })
                ) : (
                  <View style={[styles.equipoDetailRow, styles.costoProductoRow]}>
                    <CustomText style={[styles.equipoDetailVal, styles.costoItalic]}>Ninguno</CustomText>
                  </View>
                )}

                <View style={[styles.equipoDetailRow, styles.equipoDetailRowTop]}>
                  <CustomText style={styles.equipoDetailLabel}>Costo de Mano de Obra:</CustomText>
                  <CustomText style={styles.equipoDetailVal}>₡{costoManoObraVal.toLocaleString("es-CR")}</CustomText>
                </View>

                <View style={[styles.equipoDetailRow, styles.costoTotalRow]}>
                  <CustomText style={[styles.equipoDetailLabel, styles.costoTotalRowLabel]}>Costo Total:</CustomText>
                  <CustomText style={[styles.equipoDetailVal, styles.costoTotalRowValor]}>₡{costoTotalFinal.toLocaleString("es-CR")}</CustomText>
                </View>
              </View>
            );
          })()}
        </Card>

        <View style={styles.formFooter}>
          <Button
            variant="outline"
            onPress={() => onNavigateToEdit(ticket.id)}
            style={[styles.btnCancel, styles.btnFooterFlex]}
          >
            <Icon icon={ICONS.edit} size={15} color={COLORS.primary} />
            <CustomText style={styles.btnTextPrimary}>{TEXTOS_MODAL_AGREGAR.btnActualizar}</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={() => abrirModalEliminar()}
            style={[styles.btnCancel, styles.btnFooterFlexError]}
          >
            <Icon icon={ICONS.delete} size={15} color={COLORS.error} />
            <CustomText style={styles.btnTextError}>{TEXTOS_MODAL_AGREGAR.btnEliminar}</CustomText>
          </Button>
        </View>

      </View>

      {/* Modal de confirmación de eliminación */}
      <ModalEliminar
        visible={showConfirmModal}
        title="ticket de mantenimiento"
        message={ticket ? ticket.id : ""}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cerrarModalEliminar}
      />
    </ScrollView>
  );
}
