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

import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import CustomText from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Card from "../../../shared/components/Card.jsx";
import Alert from "../../../shared/components/Alert.jsx";

import { ICONS } from "../../../theme/icons.js";
import { COLORS } from "../../../theme/colors.js";
import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/mantEquipoStyles.js";
import { obtenerTareas } from "../services/tareasService.js";
import * as MantService from "../services/mantEquipoService.js";
import ModalEliminar from "../../../shared/components/ModalEliminar.jsx";
import BadgeEstado from "../components/BadgeEstado.jsx";
import EquipoDetail from "../components/EquipoDetailTicket.jsx";
import { getProductoById, getProductosInventario } from "../../inventarios/services/InventarioService.js";
import { formatDate } from "../../../shared/utils/dateUtils.js";



export default function DetalleMantenimientoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const [ticket, setTicket] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tareasCatalog, setTareasCatalog] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // Cargar catálogo de tareas al iniciar
  useEffect(() => {
    obtenerTareas().then(data => setTareasCatalog(data || []));
  }, []);

  // Cargar ticket y equipo
  useEffect(() => {
    const t = MantService.TICKETS_MOCK.find(x => x.id === id);
    if (t) {
      setTicket(t);
      const eq = MantService.EQUIPOS_MOCK.find(e => e.id === t.equipoId);
      setEquipo(eq);
      if (t.productos) {
        const list = getProductosInventario() || [];
        const mapped = t.productos.map(tp => list.find(p => String(p.id) === String(tp.id))).filter(Boolean);
        setProductosSeleccionados(mapped);
      } else if (t.productoId) {
        const prod = getProductoById(t.productoId);
        setProductosSeleccionados(prod ? [prod] : []);
      } else {
        setProductosSeleccionados([]);
      }
    }
  }, [id, MantService.TICKETS_MOCK]);

  // Cargar alertas de éxito si se redirigió desde edición
  useEffect(() => {
    if (params.alertaTipo && params.alertaMensaje) {
      setAlerta({
        tipo: params.alertaTipo,
        mensaje: params.alertaMensaje,
      });
      const timer = setTimeout(() => {
        setAlerta(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [params.alertaTipo, params.alertaMensaje]);

  const confirmDelete = () => {
    setShowConfirmModal(false);
    MantService.eliminarTicket(id);
    router.replace({
      pathname: "/equipos/mantEquipo",
      params: {
        alertaTipo: "danger",
        alertaMensaje: `El ticket ${id} ha sido eliminado correctamente del sistema.`,
      }
    });
  };

  if (!ticket) {
    return (
      <View style={[STYLE.container, { justifyContent: "center", alignItems: "center" }]}>
        <CustomText style={{ color: COLORS.error }}>Ticket no encontrado.</CustomText>
        <Button variant="outline" onPress={() => router.replace("/equipos/mantEquipo")} style={{ marginTop: 12 }}>
          Regresar a lista
        </Button>
      </View>
    );
  }

  const SectionTitle = ({ icon, title }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <Icon icon={icon} size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
      <CustomText style={{ fontSize: 14, fontWeight: "700", color: COLORS.textPrimary, letterSpacing: 0.3 }}>
        {title}
      </CustomText>
    </View>
  );

  return (
    <ScrollView style={STYLE.container} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={[STYLE.contentWrapper, { paddingBottom: 40, gap: 16 }]}>

        {/* Banner de alerta interna de edición */}
        {alerta && (
          <Alert variant={alerta.tipo} message={alerta.mensaje} style={{ marginBottom: 14 }} textStyle={{ color: "#000000" }} />
        )}

        {/* Sección: IDENTIFICACIÓN Y GENERAL */}
        <Card style={[styles.card, { padding: 16 }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <SectionTitle icon={ICONS.document} title={`TICKET #${ticket.id}`} />
            <BadgeEstado estado={ticket.estado} />
          </View>

          {/* Información Básica */}
          <View style={{ marginBottom: 16 }}>
            <CustomText style={{ fontSize: 12, color: COLORS.textTertiary, marginBottom: 2 }}>Título</CustomText>
            <CustomText style={{ fontSize: 15, fontWeight: "600", color: COLORS.textSecondary }}>{ticket.titulo}</CustomText>
          </View>

          <View style={{ flexDirection: "row", marginBottom: 16, gap: 16 }}>
            <View style={{ flex: 1 }}>
              <CustomText style={{ fontSize: 12, color: COLORS.textTertiary, marginBottom: 2 }}>Creado Por</CustomText>
              <CustomText style={{ fontSize: 14, fontWeight: "600", color: COLORS.textSecondary }}>{ticket.creadoPor}</CustomText>
            </View>
            <View style={{ flex: 1 }}>
              <CustomText style={{ fontSize: 12, color: COLORS.textTertiary, marginBottom: 2 }}>Fecha Creación</CustomText>
              <CustomText style={{ fontSize: 14, fontWeight: "600", color: COLORS.textSecondary }}>
                {formatDate(new Date(ticket.fechaCreacion))}
              </CustomText>
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <CustomText style={{ fontSize: 12, color: COLORS.textTertiary, marginBottom: 2 }}>Tipo de Personal Asignado</CustomText>
            <CustomText style={{ fontSize: 14, fontWeight: "600", color: COLORS.textSecondary }}>
              {ticket.tipoPersonal === "externo" ? "Trabajador Externo" : "Trabajador Interno"}
            </CustomText>
          </View>

          {/* Descripción */}
          <View style={{ marginBottom: 4 }}>
            <CustomText style={{ fontSize: 12, color: COLORS.textTertiary, marginBottom: 2 }}>Descripción</CustomText>
            <CustomText style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 }}>
              {ticket.descripcion}
            </CustomText>
          </View>
        </Card>

        {/* Sección: DETALLES DEL EQUIPO */}
        <Card style={[styles.card, { padding: 16 }]}>
          <SectionTitle icon={ICONS.tools} title="DETALLES DEL EQUIPO" />
          <EquipoDetail equipo={equipo} horasUsoIngreso={ticket.horasUsoIngreso} />
        </Card>

        {/* Sección: TAREAS ASIGNADAS */}
        <Card style={[styles.card, { padding: 16 }]}>
          <SectionTitle icon={ICONS.clipboard} title="TAREAS ASIGNADAS" />
          <View style={{ gap: 6 }}>
           {ticket.tareas && ticket.tareas.length > 0 ? (
              ticket.tareas.map((t, idx) => {
                const fullTask = tareasCatalog.find((d) => d.id === t.value) || t;
                return (
                  <View key={idx} style={{ paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: COLORS.secondary, borderRadius: 6, backgroundColor: COLORS.white }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Icon icon={t.realizada ? ICONS.check : ICONS.clock} size={14} color={t.realizada ? COLORS.success : COLORS.textTertiary} />
                        <CustomText style={{ fontSize: 13, fontWeight: "700", color: COLORS.textSecondary, marginLeft: 8 }}>
                          {fullTask.label || fullTask.nombre}
                        </CustomText>
                      </View>
                      <View style={{
                        borderWidth: 1,
                        borderColor: t.realizada ? COLORS.success : COLORS.textTertiary,
                        backgroundColor: t.realizada ? COLORS.successLight : COLORS.surface,
                        borderRadius: 4,
                        paddingHorizontal: 6,
                        paddingVertical: 2
                      }}>
                        <CustomText style={{ fontSize: 10, fontWeight: "600", color: t.realizada ? COLORS.success : COLORS.textTertiary }}>
                          {t.realizada ? "Realizada" : "Pendiente"}
                        </CustomText>
                      </View>
                    </View>
                    {fullTask.categoria && (
                      <CustomText style={{ fontSize: 11, color: COLORS.textTertiary, marginLeft: 22, marginTop: 2 }}>
                        Categoría: {fullTask.categoria === "preventivo" ? "Preventivo" : "Correctivo"}
                      </CustomText>
                    )}
                    {fullTask.duracionEstimada !== undefined && (
                      <CustomText style={{ fontSize: 11, color: COLORS.textTertiary, marginLeft: 22, marginTop: 1 }}>
                        Duración estimada: {fullTask.duracionEstimada} hrs
                      </CustomText>
                    )}
                    {fullTask.descripcion && (
                      <CustomText style={{ fontSize: 11, color: COLORS.textTertiary, marginLeft: 22, marginTop: 4, lineHeight: 16 }}>
                        {fullTask.descripcion}
                      </CustomText>
                    )}
                  </View>
                );
              })
            ) : (
              <CustomText style={{ fontSize: 12, color: COLORS.textTertiary }}>Ninguna tarea asignada.</CustomText>
            )}
          </View>
        </Card>

        {/* Sección: COSTOS DEL TICKET */}
        <Card style={[styles.card, { padding: 16 }]}>
          <SectionTitle icon={ICONS.money} title="COSTOS DEL TICKET" />

          <View style={{ backgroundColor: COLORS.surface, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: COLORS.secondary }}>
            {productosSeleccionados.length > 0 ? (
              productosSeleccionados.map((p) => (
                <View key={p.id} style={[styles.equipoDetailRow, { marginBottom: 6 }]}>
                  <CustomText style={styles.equipoDetailLabel}>Producto: {p.nombre}</CustomText>
                  <CustomText style={styles.equipoDetailVal}>₡{(p.precioUnidad || 0).toLocaleString("es-CR")}</CustomText>
                </View>
              ))
            ) : (
              <View style={[styles.equipoDetailRow, { marginBottom: 6 }]}>
                <CustomText style={styles.equipoDetailLabel}>Productos utilizados:</CustomText>
                <CustomText style={[styles.equipoDetailVal, { color: COLORS.textTertiary, fontStyle: "italic" }]}>Ninguno</CustomText>
              </View>
            )}

            <View style={styles.equipoDetailRow}>
              <CustomText style={styles.equipoDetailLabel}>Costo de Mano de Obra:</CustomText>
              <CustomText style={styles.equipoDetailVal}>₡{(ticket.costoManoObra || 0).toLocaleString("es-CR")}</CustomText>
            </View>
            <View style={[styles.equipoDetailRow, { borderTopWidth: 1, borderTopColor: COLORS.secondary, paddingTop: 6, marginTop: 4 }]}>
              <CustomText style={[styles.equipoDetailLabel, { fontWeight: "700", color: COLORS.primary }]}>Costo Total:</CustomText>
              <CustomText style={[styles.equipoDetailVal, { fontWeight: "700", color: COLORS.primary }]}>₡{(ticket.costoTotal || 0).toLocaleString("es-CR")}</CustomText>
            </View>
          </View>
        </Card>

        {/* Botones de acción inferiores */}
        <View style={[styles.modalFooter, { borderTopWidth: 1, borderTopColor: COLORS.secondary, paddingTop: 16 }]}>
          <Button
            variant="outline"
            onPress={() => router.replace("/equipos/mantEquipo")}
            style={[styles.btnCancel, { flex: 1 }]}
          >
            <Icon icon={ICONS.exit} size={15} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>Regresar</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={() => router.push({ pathname: "/equipos/EditarMantenimiento", params: { id: ticket.id } })}
            style={[styles.btnCancel, { flex: 1 }]}
          >
            <Icon icon={ICONS.edit} size={15} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, fontWeight: "600" }}>Editar</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={() => setShowConfirmModal(true)}
            style={[styles.btnCancel, { flex: 1, borderColor: COLORS.error }]}
          >
            <Icon icon={ICONS.delete} size={15} color={COLORS.error} />
            <CustomText style={{ color: COLORS.error, fontWeight: "600" }}>Eliminar</CustomText>
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
        onCancel={() => setShowConfirmModal(false)}
      />
    </ScrollView>
  );
}
