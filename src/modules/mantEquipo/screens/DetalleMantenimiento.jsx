/**
 * ============================================================
 * PANTALLA: DetalleMantenimiento
 * ============================================================
 * 
 * Módulo: Mantenimiento de Equipos
 * 
 * RESPONSABILIDAD:
 * - Presentación detallada de la información de un ticket de mantenimiento específico
 *   del sistema, con el desglose de tareas, máquina vinculada y costo.
 * 
 * FUNCIONALIDAD:
 * - Recupera el ID del ticket y muestra la ficha completa y desglose de costos.
 * - Despliega los detalles técnicos del equipo/máquina asociado a través de EquipoDetail.
 * - Muestra la lista de tareas asignadas (con badge dinámico de Realizada/Pendiente).
 * - Muestra un banner de éxito temporal si el ticket acaba de ser editado.
 * 
 * DATOS / VARIABLES:
 * - id: Identificador único del ticket seleccionado recuperado de useLocalSearchParams.
 * - ticket: Objeto cargado de forma reactiva con la información completa.
 * - equipo: Datos técnicos de la máquina vinculada obtenidos de EQUIPOS_MOCK.
 * 
 * VALIDACIONES / REGLAS:
 * - Comportamiento seguro si el ticket no existe en memoria.
 * - Muestra el badge de estado e icono correcto según si cada tarea está realizada o pendiente.
 * 
 * NAVEGACIÓN:
 * - "Regresar" y "Eliminar" (éxito) redirigen a /equipos/mantEquipo.
 * - "Editar" redirige a /equipos/EditarMantenimiento?id={id}.
 * 
 * DEPENDENCIAS:
 * - Card, Button, Icon, CustomText, Alert, BadgeEstado, ModalConfirmarEliminar, EquipoDetail
 * - mantEquipoService, colors, style, icons, typography
 * ============================================================
 */

import React from "react";
import { View, ScrollView } from "react-native";

import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Card from "../../../shared/components/Card.jsx";
import Alert from "../../../shared/components/Alert.jsx";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/mantEquipoStyles.js";
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";
import BadgeEstado from "../components/BadgeEstado.jsx";
import EquipoDetail from "../components/EquipoDetailTicket.jsx";
import { formatDate } from "../../../shared/utils/dateUtils.js";

import { useDetalleMantenimiento } from "../hooks/useDetalleMantenimiento.js";

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
    showConfirmModal,
    tareasCatalog,
    productosSeleccionados,
    abrirModalEliminar,
    cerrarModalEliminar,
    confirmDelete,
  } = useDetalleMantenimiento({ id, alertaTipo, alertaMensaje, onNavigateToMain });

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

        {/* Banner de alerta interna de edición */}
        {alerta && (
          <Alert variant={alerta.tipo} message={alerta.mensaje} style={styles.alertBottom} textStyle={{ color: "#000000" }} />
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
                const fullTask = tareasCatalog.find((d) => d.id === t.value) || t;
                const realizadaColor = t.realizada ? COLORS.success : COLORS.textTertiary;
                const realizadaBg    = t.realizada ? COLORS.successLight : COLORS.surface;
                return (
                  <View key={idx} style={styles.tareaItemContainer}>
                    <View style={styles.tareaItemHeader}>
                      <View style={styles.tareaItemLeft}>
                        <Icon icon={t.realizada ? ICONS.check : ICONS.clock} size={14} color={realizadaColor} />
                        <CustomText style={styles.tareaItemNombre}>
                          {fullTask.label || fullTask.nombre}
                        </CustomText>
                      </View>
                      <View style={{ borderWidth: 1, borderColor: realizadaColor, backgroundColor: realizadaBg, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <CustomText style={{ fontSize: 10, fontWeight: "600", color: realizadaColor }}>
                          {t.realizada ? "Realizada" : "Pendiente"}
                        </CustomText>
                      </View>
                    </View>
                    {fullTask.categoria && (
                      <CustomText style={styles.tareaItemMeta}>
                        Categoría: {fullTask.categoria === "preventivo" ? "Preventivo" : "Correctivo"}
                      </CustomText>
                    )}
                    {fullTask.duracionEstimada !== undefined && (
                      <CustomText style={styles.tareaItemMetaMin}>
                        Duración estimada: {fullTask.duracionEstimada} hrs
                      </CustomText>
                    )}
                    {fullTask.descripcion && (
                      <CustomText style={styles.tareaItemMetaTop}>
                        {fullTask.descripcion}
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

          <View style={styles.costoBox}>
            {productosSeleccionados.length > 0 ? (
              productosSeleccionados.map((p) => (
                <View key={p.id} style={[styles.equipoDetailRow, styles.costoProductoRow]}>
                  <CustomText style={styles.equipoDetailLabel}>Producto: {p.nombre}</CustomText>
                  <CustomText style={styles.equipoDetailVal}>₡{(p.precioUnidad || 0).toLocaleString("es-CR")}</CustomText>
                </View>
              ))
            ) : (
              <View style={[styles.equipoDetailRow, styles.costoProductoRow]}>
                <CustomText style={styles.equipoDetailLabel}>Productos utilizados:</CustomText>
                <CustomText style={[styles.equipoDetailVal, styles.costoItalic]}>Ninguno</CustomText>
              </View>
            )}

            <View style={styles.equipoDetailRow}>
              <CustomText style={styles.equipoDetailLabel}>Costo de Mano de Obra:</CustomText>
              <CustomText style={styles.equipoDetailVal}>₡{(ticket.costoManoObra || 0).toLocaleString("es-CR")}</CustomText>
            </View>
            <View style={[styles.equipoDetailRow, styles.costoTotalRow]}>
              <CustomText style={[styles.equipoDetailLabel, styles.costoTotalRowLabel]}>Costo Total:</CustomText>
              <CustomText style={[styles.equipoDetailVal, styles.costoTotalRowValor]}>₡{(ticket.costoTotal || 0).toLocaleString("es-CR")}</CustomText>
            </View>
          </View>
        </Card>

        {/* Botones de Acción */}
        <View style={styles.formFooter}>
          <Button
            variant="outline"
            onPress={() => onNavigateToEdit(ticket.id)}
            style={[styles.btnCancel, { flex: 1 }]}
          >
            <Icon icon={ICONS.edit} size={15} color={COLORS.primary} />
            <CustomText style={styles.btnTextPrimary}>Editar</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={() => abrirModalEliminar()}
            style={[styles.btnCancel, { flex: 1, borderColor: COLORS.error }]}
          >
            <Icon icon={ICONS.delete} size={15} color={COLORS.error} />
            <CustomText style={styles.btnTextError}>Eliminar</CustomText>
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
