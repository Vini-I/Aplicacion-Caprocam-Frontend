/**
 * ============================================================
 * PANTALLA: DetalleEquipoScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Muestra el detalle completo de un equipo en una pantalla independiente.
 * Incluye información general, horas de uso, alerta de mantenimiento,
 * y acciones (editar, eliminar).
 *
 * @dependencies - NavbarRegistro, Card, Icon, Button, CustomText, Spinner,
 *               - ModalEliminar, Alert de shared/components
 *               - equiposService
 *               - styles/tareasStyles, theme/colors, theme/style, theme/icons
 * @validations  - Si el equipo no existe muestra mensaje de error
 * @navigation   - "✎ Editar Equipo" → /equipos/registrarEquipo?edit={id}
 *               - "🗑 Eliminar Equipo" → ModalEliminar y luego /equipos/equipos
 *               - Clic en estanque → /estanques/detalle?id={estanqueId}
 *
 * NOTA: "marca", "modelo", "serie", "subcategoria", "ultimoMantenimiento"
 * y "registrosEncendido" se quitaron porque el backend real no tiene esos campos.
 * ============================================================
 */

import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import NavbarRegistro from '../../../shared/components/NavbarRegistro';
import Card from '../../../shared/components/Card';
import Icon from '../../../shared/components/Icons';
import Button from '../../../shared/components/Button';
import CustomText from '../../../shared/components/Text';
import Spinner from '../../../shared/components/Spinner';
import ModalEliminar from '../../../shared/components/ModalEliminar';
import Alert from '../../../shared/components/Alert';
import Badge from '../../../shared/components/Badge';

import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { STYLE } from '../../../theme/style';
import { styles, detalleStyles, equipoDetalleStyles } from '../styles/tareasStyles';
import { useDetalleEquipoScreen } from '../hooks/useDetalleEquipoScreen';

// Mapeo de tipos a iconos
const TIPOS_ICONS = {
  aireacion: ICONS.wind,
  bombeo: ICONS.waterFlow,
  alimentacion: ICONS.food,
  monitoreo: ICONS.chemicalContainer,
  mantenimiento: ICONS.tools,
  otro: ICONS.gear,
};

const TIPOS_LABELS = {
  aireacion: 'Aireación',
  bombeo: 'Bombeo',
  alimentacion: 'Alimentación',
  monitoreo: 'Monitoreo',
  mantenimiento: 'Mantenimiento',
  otro: 'Otro',
};

const ESTADO_LABELS = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  mantenimiento: 'Mantenimiento',
};

const ESTADO_VARIANTS = {
  activo: 'success',
  inactivo: 'danger',
  mantenimiento: 'warning',
};

// Calcula las horas restantes para el próximo mantenimiento.
function horasRestantesMantenimiento(equipo) {
  if (!equipo.horasMantenimiento) return 0;
  const restantes = equipo.horasMantenimiento - equipo.horasUso;
  return restantes > 0 ? restantes : 0;
}

// Componente para fila con ícono alineado a la izquierda
// valueColor es un string de color (ej: COLORS.primary) o undefined;
// se aplica mediante un objeto de estilo plano para cumplir el estándar
// sin usar estilos inline {{ ... }} en el JSX.
function FilaDetalleIcono({ icon, label, value, valueColor, onPress }) {
  const valorEstilo = valueColor
    ? [detalleStyles.valor, { color: valueColor }]
    : detalleStyles.valor;
  return (
    <View style={detalleStyles.fila}>
      <View style={detalleStyles.iconoWrapper}>
        <Icon icon={icon} size={18} color={COLORS.textTertiary} />
      </View>
      <View style={detalleStyles.contenido}>
        <CustomText style={detalleStyles.etiqueta}>{label}</CustomText>
        {onPress ? (
          <TouchableOpacity onPress={onPress}>
            <CustomText style={detalleStyles.valorLink}>{value || '—'}</CustomText>
          </TouchableOpacity>
        ) : (
          <CustomText style={valorEstilo}>
            {value || '—'}
          </CustomText>
        )}
      </View>
    </View>
  );
}

export default function DetalleEquipoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    equipo,
    estanque,
    loading,
    error,
    alert,
    showConfirmModal,
    deleteTarget,
    handleEditar,
    handleEliminarPress,
    confirmDelete,
    cancelDelete,
    handleEstanquePress,
  } = useDetalleEquipoScreen({ id, router });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Spinner />
      </View>
    );
  }

  if (error || !equipo) {
    return (
      <>
        <NavbarRegistro Titulo="Detalle de Equipo" Subtitulo="Error" Icono="tools" />
        <View style={styles.centerContainer}>
          <CustomText style={styles.errorTextLine}>
            {error || 'Equipo no encontrado'}
          </CustomText>
        </View>
      </>
    );
  }

  const tipoIcon = TIPOS_ICONS[equipo.tipo] || ICONS.gear;
  const tipoLabel = TIPOS_LABELS[equipo.tipo] || equipo.tipo;
  const estadoLabel = ESTADO_LABELS[equipo.estado] || equipo.estado;
  const estadoVariant = ESTADO_VARIANTS[equipo.estado] || 'info';
  const horasRestantes = horasRestantesMantenimiento(equipo);
  const necesitaMant = horasRestantes === 0;
  const horasUsoFormateado = equipo.horasUso < 1
    ? `${Math.round(equipo.horasUso * 60)} min`
    : `${Math.round(equipo.horasUso)} h`;

  return (
    <>
      <ScrollView style={STYLE.container} contentContainerStyle={STYLE.contentWrapper}>
        <Card>
          <View style={equipoDetalleStyles.header}>
            <View style={equipoDetalleStyles.avatar}>
              <Icon icon={tipoIcon} size={28} color={COLORS.primary} />
            </View>
            <View style={equipoDetalleStyles.info}>
              <CustomText style={equipoDetalleStyles.nombre}>{equipo.nombre}</CustomText>
              <View style={equipoDetalleStyles.badges}>
                <CustomText style={equipoDetalleStyles.codigo}>Código: {equipo.codigo}</CustomText>
                <View style={equipoDetalleStyles.estadoBadgeContainer}>
                  <CustomText style={equipoDetalleStyles.estadoBadgeText}>
                    {estadoLabel}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>

          <View style={equipoDetalleStyles.horasContainer}>
            <View style={equipoDetalleStyles.horasRow}>
              <View style={equipoDetalleStyles.horasLabelContainer}>
                <Icon icon={ICONS.clock} size={16} color={COLORS.textTertiary} />
                <CustomText style={equipoDetalleStyles.horasLabel}>Horas de uso</CustomText>
              </View>
              <CustomText style={[equipoDetalleStyles.horasValor, necesitaMant && equipoDetalleStyles.horasValorCritico]}>
                {horasUsoFormateado}
              </CustomText>
            </View>
            <View style={equipoDetalleStyles.horasRow}>
              <View style={equipoDetalleStyles.horasLabelContainer}>
                <Icon icon={ICONS.tools} size={16} color={COLORS.textTertiary} />
                <CustomText style={equipoDetalleStyles.horasLabel}>
                  {necesitaMant ? 'Mantenimiento requerido' : 'Horas para mantenimiento'}
                </CustomText>
              </View>
              <View style={equipoDetalleStyles.horasValueRow}>
                {necesitaMant && (
                  <Icon icon={ICONS.alertTriangle} size={18} color={COLORS.error} style={equipoDetalleStyles.horasAlertIcon} />
                )}
                <CustomText style={[equipoDetalleStyles.horasValor, necesitaMant && equipoDetalleStyles.horasValorCritico]}>
                  {necesitaMant ? '0 h' : `${Math.round(horasRestantes)} h`}
                </CustomText>
              </View>
            </View>
          </View>

          <FilaDetalleIcono icon={ICONS.water} label="Tipo" value={tipoLabel} />
          <FilaDetalleIcono icon={ICONS.calendar} label="Fecha de instalación" value={equipo.fechaInstalacion || '—'} />
          <FilaDetalleIcono
            icon={ICONS.engine}
            label="Función"
            value={equipo.funcionEquipo || '—'}
          />
          <FilaDetalleIcono
            icon={ICONS.water}
            label="Estanque asociado"
            value={estanque ? estanque.label : 'No asociado'}
            onPress={estanque ? handleEstanquePress : undefined}
          />
        </Card>

        {equipo.descripcion && (
          <Card>
            <FilaDetalleIcono
              icon={ICONS.document}
              label="Descripción"
              value={equipo.descripcion}
            />
          </Card>
        )}

        {/* Alertas de error (solo errores de eliminación) */}
        {alertError && (
          <View style={equipoDetalleStyles.alertWrapper}>
            <Alert variant={alertError.type} message={alertError.message} />
          </View>
        )}

        <View style={equipoDetalleStyles.botonesContainer}>
          <Button
            variant="outline"
            onPress={handleEditar}
            style={[equipoDetalleStyles.boton, equipoDetalleStyles.botonEditar]}
          >
            <Icon icon={ICONS.edit} size={18} color={COLORS.primary} />
            <CustomText style={equipoDetalleStyles.botonTexto}>Editar Equipo</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={handleEliminarPress}
            style={[equipoDetalleStyles.boton, equipoDetalleStyles.botonEliminar]}
          >
            <Icon icon={ICONS.delete} size={18} color={COLORS.error} />
            <CustomText style={equipoDetalleStyles.botonTextoEliminar}>Eliminar Equipo</CustomText>
          </Button>
        </View>
      </ScrollView>

      <ModalEliminar
        visible={showConfirmModal}
        title="Equipo"
        message={deleteTarget ? deleteTarget.nombre : ''}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}