/**
 * ============================================================
 * COMPONENTE: EquipoDetalleScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Pantalla que muestra el detalle completo de un equipo,
 * incluyendo su información, horas de uso y estado actual.
 *
 * Props:
 * - equipoId: string - ID del equipo a mostrar
 * - onClose: función - se ejecuta al cerrar la pantalla
 * - onEdit: función - se ejecuta al presionar editar
 * - onDelete: función - se ejecuta al presionar eliminar
 * - onToggle: función - se ejecuta al presionar encender/apagar
 *
 * Ejemplo:
 * <EquipoDetalleScreen
 *   equipoId="12"
 *   onClose={() => setModalVisible(false)}
 *   onEdit={(equipo) => abrirFormulario(equipo)}
 *   onDelete={(id) => confirmarEliminacion(id)}
 *   onToggle={(id) => toggleEquipo(id)}
 * />
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { equiposService } from "../services/equiposService";
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

const TIPOS_LABELS = {
  aireacion: "Aireación",
  bombeo: "Bombeo",
  alimentacion: "Alimentación",
  monitoreo: "Monitoreo",
  mantenimiento: "Mantenimiento",
  otro: "Otro",
};

const TIPOS_ICONS = {
  aireacion: ICONS.wind,
  bombeo: ICONS.waterFlow,
  alimentacion: ICONS.food,
  monitoreo: ICONS.chemicalContainer,
  mantenimiento: ICONS.tools,
  otro: ICONS.gear,
};

const ESTADO_LABELS = {
  activo: "Activo",
  inactivo: "Inactivo",
  mantenimiento: "Mantenimiento",
};

const ESTADO_VARIANTS = {
  activo: "success",
  inactivo: "danger",
  mantenimiento: "warning",
};

export default function EquipoDetalleScreen({
  equipoId,
  onClose,
  onEdit,
  onDelete,
  onToggle,
}) {
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estanque, setEstanque] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await equiposService.getEquipoById(equipoId);
        setEquipo(data);

        if (data.estanqueId) {
          // Los estanques vienen del backend real; se busca el que
          // coincide con el estanqueId del equipo.
          const estanques = await equiposService.getEstanquesDisponibles();
          const est = estanques.find((e) => e.value === String(data.estanqueId));
          setEstanque(est || null);
        } else {
          setEstanque(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (equipoId) {
      loadData();
    }
  }, [equipoId]);

  const handleTogglePress = () => {
    if (onToggle && equipo) {
      onToggle(equipo.id);
    }
  };

  if (loading) return <Spinner text="Cargando detalle..." />;
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;
  if (!equipo) return null;

  const tipoLabel = TIPOS_LABELS[equipo.tipo] || equipo.tipo;
  const tipoIcon = TIPOS_ICONS[equipo.tipo] || ICONS.gear;
  const estadoLabel = ESTADO_LABELS[equipo.estado] || equipo.estado;
  const estadoVariant = ESTADO_VARIANTS[equipo.estado] || "info";
  const horasRestantes = Math.max(0, (equipo.horasMantenimiento || 0) - (equipo.horasUso || 0));
  const necesitaMant = equipo.horasMantenimiento ? horasRestantes === 0 : false;
  const horasUsoFormateado =
    equipo.horasUso < 1
      ? `${Math.round(equipo.horasUso * 60)} min`
      : `${Math.round(equipo.horasUso)} h`;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
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
            onPress={handleTogglePress}
            style={[styles.boton, styles.botonEditar]}
          >
            <Icon
              icon={equipo.encendido ? ICONS.close : ICONS.check}
              size={ICON_SIZE.boton}
              color={COLORS.primary}
            />
            <CustomText style={styles.botonTexto}>
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