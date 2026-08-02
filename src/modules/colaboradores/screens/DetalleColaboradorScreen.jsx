/**
 * ============================================================
 * PANTALLA: DetalleColaboradorScreen
 * ============================================================
 * Módulo: Colaboradores
 *
 * Responsabilidad:
 * Muestra el detalle completo de un colaborador en una pantalla independiente.
 * Incluye información personal, estadísticas de actividad y,
 * si es dueño externo, la lista de trabajadores a su cargo.
 *
 * Datos:
 * - Obtiene el id del colaborador desde los parámetros de ruta.
 * - Carga el colaborador usando useColaboradorDetalle.
 *
 * Validaciones:
 * - Si el colaborador no existe, muestra mensaje de error.
 *
 * Navegación:
 * - Botón "Volver" (NavbarRegistro) regresa a la lista.
 * - Botón "Editar" navega a la lista con parámetro editId para abrir el modal de edición.
 * - Botón "Eliminar" abre ModalEliminar y, al confirmar, elimina y regresa.
 * - Clic en un trabajador externo navega a su detalle.
 *
 * Dependencias:
 * - useColaboradorDetalle
 * - shared/components (NavbarRegistro, Card, Icon, Button, ModalEliminar, Alert, etc.)
 * - styles/DetalleColaboradorStyles
 * ============================================================
 */

import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useColaboradorDetalle } from '../hooks/useColaboradorDetalle';
import { colaboradoresService } from '../services/colaboradoresService';

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
import { styles } from '../styles/DetalleColaboradorStyles';

// Constantes de etiquetas y variantes para roles
const ROL_LABELS = {
  camprocam_worker: 'Trabajador Camprocam',
  external_owner: 'Dueño Externo',
  external_worker: 'Trabajador Externo',
};

const ROL_VARIANTS = {
  camprocam_worker: 'info',
  external_owner: 'warning',
  external_worker: 'success',
};

// Componente interno para fila con ícono alineado a la izquierda
function FilaDetalleIcono({ icon, label, value, onPress }) {
  const content = (
    <View style={styles.fila}>
      <View style={styles.iconoWrapper}>
        <Icon icon={icon} size={18} color={COLORS.textTertiary} />
      </View>
      <View style={styles.contenido}>
        <CustomText style={styles.etiqueta}>{label}</CustomText>
        {onPress ? (
          <TouchableOpacity onPress={onPress}>
            <CustomText style={[styles.valor, { color: COLORS.primary, textDecorationLine: 'underline' }]}>
              {value || '—'}
            </CustomText>
          </TouchableOpacity>
        ) : (
          <CustomText style={styles.valor}>{value || '—'}</CustomText>
        )}
      </View>
    </View>
  );
  return content;
}

export default function DetalleColaboradorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  // Obtener datos del colaborador
  const {
    colaborador,
    trabajadores,
    estadisticas,
    loading,
    error,
  } = useColaboradorDetalle(id);

  // Manejadores
  const handleEditar = () => {
    // Navegar a la lista con el id para que abra el modal de edición
    router.push({
      pathname: '/(drawer)/colaboradores',
      params: { editId: colaborador.id },
    });
  };

  const handleEliminarPress = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!colaborador) return;
    setEliminando(true);
    try {
      await colaboradoresService.deleteColaborador(colaborador.id);
      // Navegar a la lista con alerta de éxito (verde)
      router.replace({
        pathname: '/(drawer)/colaboradores',
        params: {
          alertType: 'success',
          alertMessage: `Colaborador "${colaborador.nombre}" eliminado correctamente.`
        }
      });
    } catch (err) {
      // Error: mostrar alerta roja en esta misma pantalla
      setAlert({ type: 'danger', message: err.message || 'No se pudo eliminar el colaborador.' });
      setShowConfirmModal(false);
    } finally {
      setEliminando(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  // Navegar al detalle de un trabajador externo
  const handleSelectTrabajador = (trabajadorId) => {
    router.push({
      pathname: '/(drawer)/colaboradores/detalle',
      params: { id: trabajadorId },
    });
  };

  // Estados de carga y error
  if (loading) {
    return (
      <View style={[STYLE.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Spinner />
      </View>
    );
  }

  if (error || !colaborador) {
    return (
      <>
        <NavbarRegistro Titulo="Detalle de Colaborador" Subtitulo="Error" Icono="user" />
        <View style={[STYLE.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <CustomText style={{ color: COLORS.error }}>
            {error || 'Colaborador no encontrado'}
          </CustomText>
        </View>
      </>
    );
  }

  const rolLabel = ROL_LABELS[colaborador.rol] || colaborador.rol;
  const rolVariant = ROL_VARIANTS[colaborador.rol] || 'info';

  return (
    <>
      <ScrollView style={STYLE.container} contentContainerStyle={STYLE.contentWrapper}>
        {/* Información personal */}
        <Card>
          {/* Cabecera: nombre + rol */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <CustomText style={styles.avatarIniciales}>
                {colaborador.nombre
                  .split(' ')
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()}
              </CustomText>
            </View>
            <View style={styles.info}>
              <CustomText style={styles.nombre}>{colaborador.nombre}</CustomText>
              <Badge
                label={rolLabel}
                variant={rolVariant}
                style={styles.badge}
                textStyle={styles.badgeTexto}
              />
            </View>
          </View>

          <FilaDetalleIcono
            icon={ICONS.id}
            label="Cédula"
            value={colaborador.cedula}
          />
          <FilaDetalleIcono
            icon={ICONS.phone}
            label="Teléfono"
            value={colaborador.telefono}
          />
          <FilaDetalleIcono
            icon={ICONS.user}
            label="Correo"
            value={colaborador.email}
          />
          <FilaDetalleIcono
            icon={ICONS.location}
            label="Finca ID"
            value={colaborador.fincaId}
          />
        </Card>

        {/* Estadísticas de actividad */}
        {estadisticas && (
          <Card title="Actividad del colaborador" titleStyle={styles.statsTitle}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <CustomText style={styles.statValue}>{estadisticas.alimentaciones}</CustomText>
                <CustomText style={styles.statLabel}>Alimentaciones</CustomText>
              </View>
              <View style={styles.statItem}>
                <CustomText style={styles.statValue}>{estadisticas.estanquesCreados}</CustomText>
                <CustomText style={styles.statLabel}>Estanques creados</CustomText>
              </View>
              <View style={styles.statItem}>
                <CustomText style={styles.statValue}>{estadisticas.siembrasRegistradas}</CustomText>
                <CustomText style={styles.statLabel}>Siembras registradas</CustomText>
              </View>
            </View>
            {estadisticas.ultimaActividad && (
              <CustomText style={styles.lastActive}>
                Última actividad: {estadisticas.ultimaActividad}
              </CustomText>
            )}
          </Card>
        )}

        {/* Si es dueño externo, mostrar trabajadores a cargo */}
        {colaborador.rol === 'external_owner' && (
          <Card title="Trabajadores a cargo" titleStyle={styles.statsTitle}>
            {trabajadores && trabajadores.length > 0 ? (
              trabajadores.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => handleSelectTrabajador(t.id)}
                  style={styles.trabajadorItem}
                >
                  <View style={styles.trabajadorInfo}>
                    <CustomText style={styles.trabajadorNombre}>{t.nombre}</CustomText>
                    <CustomText style={styles.trabajadorDetalle}>
                      {t.cedula} · {t.telefono}
                    </CustomText>
                  </View>
                  <Icon icon={ICONS.enter} size={16} color={COLORS.textTertiary} />
                </TouchableOpacity>
              ))
            ) : (
              <CustomText style={styles.emptyText}>No hay trabajadores registrados.</CustomText>
            )}
          </Card>
        )}

        {/* Alertas de error (solo errores de eliminación) */}
        {alert && (
          <View style={{ marginBottom: 12 }}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.botonesContainer}>
          <Button
            variant="outline"
            onPress={handleEditar}
            style={[styles.boton, { borderColor: COLORS.primary }]}
          >
            <Icon icon={ICONS.edit} size={18} color={COLORS.primary} />
            <CustomText style={{ color: COLORS.primary, fontWeight: '600' }}>Editar Colaborador</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={handleEliminarPress}
            style={[styles.boton, { borderColor: COLORS.error }]}
            disabled={eliminando}
          >
            <Icon icon={ICONS.delete} size={18} color={COLORS.error} />
            <CustomText style={{ color: COLORS.error, fontWeight: '600' }}>
              {eliminando ? 'Eliminando Colaborador...' : 'Eliminar Colaborador'}
            </CustomText>
          </Button>
        </View>
      </ScrollView>

      {/* Modal de confirmación de eliminación */}
      <ModalEliminar
        visible={showConfirmModal}
        title="colaborador"
        message={colaborador.nombre}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}