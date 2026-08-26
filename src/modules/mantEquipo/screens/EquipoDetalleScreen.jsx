/**
 * ============================================================
 * COMPONENTE: EquipoDetalleScreen
 * ============================================================
 *
 * Muestra el detalle completo de un equipo: información, horas
 * de uso, estado actual y acciones de editar/eliminar/encender.
 * Se monta como modal o componente hijo de EquiposListScreen.
 *
 * @dependencies - useEquipoDetalleScreen (hooks)
 *               - Spinner, Button, Icon, CustomText, Badge (shared)
 *               - equiposListStyles
 * @validations  - equipoId requerido; sin él no se carga nada.
 *               - onClose/onEdit/onDelete/onToggle son callbacks externos obligatorios.
 * @navigation   - Ninguna interna. Toda navegación se delega a los callbacks de props.
 */

import React from "react";
import { View, ScrollView } from "react-native";
import Spinner from "../../../shared/components/Spinner";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import { styles, ICON_SIZE } from "../styles/equipoDetalleStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { useEquipoDetalleScreen } from "../hooks/useEquipoDetalleScreen";

export default function EquipoDetalleScreen({
  equipoId,
  onClose,
  onEdit,
  onDelete,
  onToggle,
}) {
  const {
    equipo,
    estanque,
    loading,
    error,
    tipoLabel,
    tipoIcon,
    estadoLabel,
    estadoVariant,
    horasRestantes,
    necesitaMant,
    horasUsoFormateado,
    handleTogglePress,
  } = useEquipoDetalleScreen({ equipoId, onToggle });

  if (loading) return <Spinner text="Cargando detalle..." />;
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;
  if (!equipo) return null;


  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          {/* Cabecera */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Icon icon={tipoIcon} size={32} color={COLORS.primary} />
            </View>
            <View style={styles.equipoInfo}>
              <Title level={4}>{equipo.nombre}</Title>
              <Badge
                label={estadoLabel}
                variant={estadoVariant}
                style={styles.badgeEstado}
              />
              <Badge
                label={`Código: ${equipo.codigo}`}
                style={styles.badgeCodigo}
                textStyle={styles.badgeCodigoTexto}
              />
              <Badge
                label={equipo.encendido ? "Encendido" : "Apagado"}
                variant={equipo.encendido ? "success" : "default"}
                style={styles.badgeCodigo}
              />
            </View>
          </View>

          {/* Horas de uso y mantenimiento */}
          <View style={styles.horasContainer}>
            <View style={styles.horasRow}>
              <View style={styles.horasLabelContainer}>
                <Icon
                  icon={ICONS.clock}
                  size={16}
                  color={COLORS.textTertiary}
                  style={styles.horasIcon}
                />
                <CustomText style={styles.horasLabel}>Horas de uso</CustomText>
              </View>
              <CustomText
                style={[styles.horasValor, necesitaMant && styles.horasValorCritico]}
              >
                {horasUsoFormateado}
              </CustomText>
            </View>
            <View style={styles.horasRow}>
              <View style={styles.horasLabelContainer}>
                <Icon
                  icon={ICONS.tools}
                  size={16}
                  color={COLORS.textTertiary}
                  style={styles.horasIcon}
                />
                <CustomText style={styles.horasLabel}>
                  {necesitaMant ? "Mantenimiento requerido" : "Horas para mantenimiento"}
                </CustomText>
              </View>
              <View style={styles.horasValueRow}>
                {necesitaMant && (
                  <Icon
                    icon={ICONS.alertTriangle}
                    size={18}
                    color={COLORS.error}
                    style={styles.horasAlertIcon}
                  />
                )}
                <CustomText
                  style={[styles.horasValor, necesitaMant && styles.horasValorCritico]}
                >
                  {necesitaMant ? "0 h" : `${Math.round(horasRestantes)} h`}
                </CustomText>
              </View>
            </View>
          </View>

          {/* Información del equipo - con íconos alineados */}
          <View style={styles.seccion}>
            <CustomText style={styles.seccionTitulo}>Información del equipo</CustomText>

            <View style={styles.filaDetalle}>
              <View style={styles.filaDetalleIcono}>
                <Icon icon={ICONS.gear} size={16} color={COLORS.textTertiary} />
              </View>
              <View style={styles.filaDetalleContenido}>
                <CustomText style={styles.filaEtiqueta}>Tipo</CustomText>
                <CustomText style={styles.filaValor}>{tipoLabel}</CustomText>
              </View>
            </View>

            <View style={styles.filaDetalle}>
              <View style={styles.filaDetalleIcono}>
                <Icon icon={ICONS.calendar} size={16} color={COLORS.textTertiary} />
              </View>
              <View style={styles.filaDetalleContenido}>
                <CustomText style={styles.filaEtiqueta}>Fecha de instalación</CustomText>
                <CustomText style={styles.filaValor}>{equipo.fechaInstalacion || "—"}</CustomText>
              </View>
            </View>

            <View style={styles.filaDetalle}>
              <View style={styles.filaDetalleIcono}>
                <Icon icon={ICONS.engine} size={16} color={COLORS.textTertiary} />
              </View>
              <View style={styles.filaDetalleContenido}>
                <CustomText style={styles.filaEtiqueta}>Función</CustomText>
                <CustomText style={styles.filaValor}>{equipo.funcionEquipo || "—"}</CustomText>
              </View>
            </View>

            {/* Estanque asociado */}
            <View style={styles.filaDetalle}>
              <View style={styles.filaDetalleIcono}>
                <Icon icon={ICONS.water} size={16} color={COLORS.textTertiary} />
              </View>
              <View style={styles.filaDetalleContenido}>
                <CustomText style={styles.filaEtiqueta}>Estanque asociado</CustomText>
                <CustomText style={styles.filaValor}>
                  {estanque ? estanque.label : "No asociado"}
                </CustomText>
              </View>
            </View>

            <View style={styles.filaDetalle}>
              <View style={styles.filaDetalleIcono}>
                <Icon icon={ICONS.tools} size={16} color={COLORS.textTertiary} />
              </View>
              <View style={styles.filaDetalleContenido}>
                <CustomText style={styles.filaEtiqueta}>Horas para mantenimiento</CustomText>
                <CustomText style={styles.filaValor}>
                  {equipo.horasMantenimiento ?? "—"}
                </CustomText>
              </View>
            </View>
          </View>

          {/* Descripción */}
          {equipo.descripcion && (
            <View style={styles.seccion}>
              <CustomText style={styles.seccionTitulo}>Descripción</CustomText>
              <CustomText style={styles.filaValor}>{equipo.descripcion}</CustomText>
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Botones de acción fijos en la parte inferior */}
      <View style={styles.footerContainer}>
        <View style={styles.footerButtonsContainer}>
          <Button
            variant="outline"
            onPress={() => onEdit?.(equipo)}
            style={[styles.boton, styles.botonEditar]}
          >
            <Icon icon={ICONS.edit} size={ICON_SIZE.boton} color={COLORS.primary} />
            <CustomText style={styles.botonTexto}>Editar</CustomText>
          </Button>
          <Button
            variant="outline"
            disabled={!equipo.encendido && (equipo.estado === "mantenimiento" || equipo.estado === "inactivo")}
            onPress={handleTogglePress}
            style={[
              styles.boton,
              styles.botonEditar,
              !equipo.encendido && (equipo.estado === "mantenimiento" || equipo.estado === "inactivo") && { opacity: 0.4 },
            ]}
          >
            <Icon
              icon={equipo.encendido ? ICONS.close : ICONS.check}
              size={ICON_SIZE.boton}
              color={
                !equipo.encendido && (equipo.estado === "mantenimiento" || equipo.estado === "inactivo")
                  ? COLORS.textTertiary
                  : COLORS.primary
              }
            />
            <CustomText
              style={[
                styles.botonTexto,
                !equipo.encendido && (equipo.estado === "mantenimiento" || equipo.estado === "inactivo") && { color: COLORS.textTertiary },
              ]}
            >
              {equipo.encendido ? "Apagar" : "Encender"}
            </CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={() => onDelete?.(equipo.id)}
            style={[styles.boton, styles.botonEliminar]}
          >
            <Icon icon={ICONS.delete} size={ICON_SIZE.boton} color={COLORS.error} />
            <CustomText style={styles.botonTextoEliminar}>Eliminar</CustomText>
          </Button>
        </View>
        <Button
          variant="outline"
          onPress={onClose}
          style={[styles.botonCerrar, styles.botonCerrarFull]}
        >
          <View style={styles.botonContent}>
            <Icon icon={ICONS.exit} size={ICON_SIZE.boton} color={COLORS.primary} />
            <CustomText style={styles.botonTexto}>Cerrar</CustomText>
          </View>
        </Button>
      </View>
    </View>
  );
}