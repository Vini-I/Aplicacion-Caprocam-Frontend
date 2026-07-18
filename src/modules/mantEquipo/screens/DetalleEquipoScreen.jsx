/**
 * ============================================================
 * PANTALLA: DetalleEquipoScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Muestra el detalle completo de un equipo en una pantalla independiente.
 * Incluye información general, horas de uso, alerta de mantenimiento,
 * historial de encendidos, y acciones (editar, eliminar).
 *
 * Datos:
 * - Obtiene el id del equipo desde los parámetros de ruta.
 * - Carga el equipo usando equiposService.getEquipoById.
 * - Obtiene el estanque asociado para mostrar enlace subrayado.
 *
 * Validaciones:
 * - Si el equipo no existe, muestra mensaje de error.
 *
 * Navegación:
 * - Botón "Volver" (NavbarRegistro) regresa a la lista.
 * - Botón "Editar" abre el formulario de edición (modal o screen).
 * - Botón "Eliminar" abre ModalEliminar y, al confirmar, elimina y regresa.
 * - Clic en el estanque asociado navega a detalle del estanque.
 *
 * Dependencias:
 * - equiposService
 * - shared/components (NavbarRegistro, Card, Icon, Button, ModalEliminar, Alert, etc.)
 * - styles/tareasStyles (reutiliza algunos estilos)
 * ============================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';

import NavbarRegistro from '../../../shared/components/NavbarRegistro';
import Card from '../../../shared/components/Card';
import Icon from '../../../shared/components/Icons';
import Button from '../../../shared/components/Button';
import CustomText from '../../../shared/components/Text';
import Spinner from '../../../shared/components/Spinner';
import ModalEliminar from '../../../shared/components/ModalEliminar';
import Alert from '../../../shared/components/Alert';

import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { STYLE } from '../../../theme/style';
import { equiposService, getEstanqueById, horasRestantesMantenimiento } from '../services/equiposService';
import { styles, detalleStyles, equipoDetalleStyles } from '../styles/tareasStyles';

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

// Componente para fila con ícono alineado a la izquierda
function FilaDetalleIcono({ icon, label, value, valueColor, onPress }) {
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
          <CustomText style={[detalleStyles.valor, valueColor && { color: valueColor }]}>
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

  const [equipo, setEquipo] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState(null);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await equiposService.getEquipoById(id);
      setEquipo(data);
      if (data.estanqueId) {
        const est = getEstanqueById(data.estanqueId);
        setEstanque(est);
      } else {
        setEstanque(null);
      }
    } catch (err) {
      setError(err.message || 'No se pudo cargar el equipo.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) cargarDatos();
    else setError('ID de equipo no proporcionado.');
  }, [id, cargarDatos]);

  useFocusEffect(
    useCallback(() => {
      if (id) cargarDatos();
    }, [id, cargarDatos])
  );

  const handleEditar = () => {
    router.push(`/equipos/registrarEquipo?edit=${equipo.id}`);
  };

  const handleEliminarPress = () => {
    setDeleteTarget(equipo);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await equiposService.deleteEquipo(equipo.id);
      setAlert({ type: 'warning', message: `Equipo "${equipo.nombre}" eliminado.` });
      setShowConfirmModal(false);
      setTimeout(() => router.replace('/equipos/equipos'), 1500);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'No se pudo eliminar el equipo.' });
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTarget(null);
  };

  const handleEstanquePress = () => {
    if (estanque) {
      router.push(`/estanques/detalle?id=${estanque.id}`);
    }
  };

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
          <CustomText style={{ color: COLORS.error }}>
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
          {equipo.subcategoria && (
            <FilaDetalleIcono icon={ICONS.info} label="Subcategoría" value={equipo.subcategoria} />
          )}
          <FilaDetalleIcono icon={ICONS.user} label="Marca" value={equipo.marca || '—'} />
          <FilaDetalleIcono icon={ICONS.certificate} label="Modelo" value={equipo.modelo || '—'} />
          <FilaDetalleIcono icon={ICONS.id} label="Serie" value={equipo.serie || '—'} />
          <FilaDetalleIcono icon={ICONS.calendar} label="Fecha de instalación" value={equipo.fechaInstalacion || '—'} />
          <FilaDetalleIcono icon={ICONS.location} label="Ubicación" value={equipo.ubicacion || '—'} />
          <FilaDetalleIcono
            icon={ICONS.engine}
            label="Función"
            value={equipo.funcionEquipo || '—'}
          />
          <FilaDetalleIcono
            icon={ICONS.water}
            label="Estanque asociado"
            value={estanque ? `${estanque.label} · ${estanque.finca}` : 'No asociado'}
            onPress={estanque ? handleEstanquePress : undefined}
          />
          <FilaDetalleIcono
            icon={ICONS.tools}
            label="Último mantenimiento"
            value={equipo.ultimoMantenimiento || '—'}
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

        {equipo.registrosEncendido && equipo.registrosEncendido.length > 0 && (
          <Card title="Historial de uso" titleStyle={equipoDetalleStyles.historialTitle}>
            {equipo.registrosEncendido.slice(-5).reverse().map((registro, index) => {
              const inicio = new Date(registro.inicio);
              const fechaStr = inicio.toLocaleDateString('es-CR');
              const horaStr = inicio.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
              const horas = registro.horas || 0;
              return (
                <View key={index} style={equipoDetalleStyles.registroItem}>
                  <CustomText style={equipoDetalleStyles.registroFecha}>
                    {fechaStr} {horaStr}
                    {!registro.fin && ' (En curso)'}
                  </CustomText>
                  <CustomText style={equipoDetalleStyles.registroHoras}>
                    {horas > 0 ? `${horas} h` : '—'}
                  </CustomText>
                </View>
              );
            })}
          </Card>
        )}

        {alert && (
          <View style={equipoDetalleStyles.alertWrapper}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        <View style={equipoDetalleStyles.botonesContainer}>
          <Button
            variant="outline"
            onPress={handleEditar}
            style={[equipoDetalleStyles.boton, equipoDetalleStyles.botonEditar]}
          >
            <Icon icon={ICONS.edit} size={18} color={COLORS.primary} />
            <CustomText style={equipoDetalleStyles.botonTexto}>Editar</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={handleEliminarPress}
            style={[equipoDetalleStyles.boton, equipoDetalleStyles.botonEliminar]}
          >
            <Icon icon={ICONS.delete} size={18} color={COLORS.error} />
            <CustomText style={equipoDetalleStyles.botonTextoEliminar}>Eliminar</CustomText>
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