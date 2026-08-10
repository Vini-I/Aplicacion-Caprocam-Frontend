/**
 * ============================================================
 * PANTALLA: DetalleColaboradorScreen
 * ============================================================
 * Módulo: Colaboradores
 *
 * Responsabilidad:
 * Muestra la información detallada de un colaborador, incluyendo
 * datos personales y, si es dueño externo, la lista de trabajadores
 * a su cargo.
 *
 * @dependencies - useColaboradorDetalle, shared components.
 * @validations  - N/A
 * @navigation   - Botones para editar y eliminar; clic en trabajador
 *                 navega a su detalle.
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
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
import Badge from '../../../shared/components/Badge';

import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { STYLE } from '../../../theme/style';
import { styles } from '../styles/DetalleColaboradorStyles';
import { useError } from '../../../shared/context/ErrorContext';

// ─── Mapeo de roles ─────────────────────────────────────────────
const rolLabels = {
  camprocam_worker: 'Colaborador Camprocam',
  external_owner: 'Propietario Externo',
  external_worker: 'Colaborador Externo',
};

const rolVariant = {
  camprocam_worker: 'info',
  external_owner: 'warning',
  external_worker: 'success',
};

// ─── Componente interno: fila con icono y valor ──────────────
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
            <CustomText style={[styles.valor, styles.valorLink]}>
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

// ─── Componente principal ──────────────────────────────────────

export default function DetalleColaboradorScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // ─── Obtener datos del colaborador ────────────────────────────
  const {
    colaborador,
    trabajadores,
    fincaNombre,
    loading,
    error,
  } = useColaboradorDetalle(id);

  // ─── Manejadores ───────────────────────────────────────────────

  const [alert, setAlert] = useState(null);

  const alertTimeout = { current: null };
  useEffect(() => () => { if (alertTimeout.current) clearTimeout(alertTimeout.current); }, []);
  const showAlert = (type, message, ms = 3000) => {
    if (alertTimeout.current) clearTimeout(alertTimeout.current);
    setAlert({ type, message });
    alertTimeout.current = setTimeout(() => setAlert(null), ms);
  };

  // Leer alert desde params (por ejemplo, después de editar)
  const params = useLocalSearchParams();
  useEffect(() => {
    if (params?.alertMessage) {
      const type = params.alertType || 'success';
      let message = params.alertMessage;
      try {
        message = decodeURIComponent(params.alertMessage);
      } catch (e) {
        // No hubo necesidad de decodificar
      }
      showAlert(type, message);
      router.setParams({ alertType: undefined, alertMessage: undefined });
    }
  }, [params?.alertMessage, params?.alertType, router]);

  const handleEditar = () => {
    router.push({
      pathname: '/(drawer)/colaboradores',
      params: { editId: colaborador.id },
    });
  };

  const handleEliminarPress = () => {
    setErrorMessage("");
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!colaborador) return;
    setEliminando(true);
    try {
      await colaboradoresService.deleteColaborador(colaborador.id);
      router.replace({
        pathname: '/(drawer)/colaboradores',
        params: {
          alertType: 'success',
          alertMessage: `Colaborador "${colaborador.nombre}" eliminado correctamente.`
        }
      });
    } catch (err) {
      const status = err.response?.status;
      if (status === 400 || status === 422) {
        setShowConfirmModal(false);
        showAlert('danger', err?.message || 'No se pudo eliminar el colaborador');
      } else {
        setShowConfirmModal(false);
        showAlert('danger', err?.message || 'No se pudo eliminar el colaborador');
      }
    } finally {
      setEliminando(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleSelectTrabajador = (trabajadorId) => {
    router.push({
      pathname: '/(drawer)/colaboradores/detalle',
      params: { id: trabajadorId },
    });
  };

  // ─── Estados de carga y error ──────────────────────────────────
  if (loading) {
    return (
      <View style={[STYLE.container, styles.centeredContainer]}>
        <Spinner />
      </View>
    );
  }

  if (!colaborador) {
    return (
      <>
        <View style={[STYLE.container, styles.centeredContainer]}>
          <CustomText style={{ color: COLORS.error }}>
            {error || 'Colaborador no encontrado'}
          </CustomText>
        </View>
      </>
    );
  }

  // ─── Render ────────────────────────────────────────────────────
  return (
    <>
      <ScrollView style={STYLE.container} contentContainerStyle={STYLE.contentWrapper}>
        {/* Información personal */}
        <Card>
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
            </View>
          </View>

          {/* Badge de rol alineado con el contenido de las filas */}
          <View style={styles.badgeRow}>
            <Badge
              label={rolLabels[colaborador.rol] || colaborador.rol}
              variant={rolVariant[colaborador.rol] || 'info'}
              style={styles.badgeRol}
            />
          </View>

          <View style={styles.separator} />
          <CustomText style={styles.sectionTitle}>Información general</CustomText>

          <FilaDetalleIcono icon={ICONS.id} label="Cédula" value={colaborador.cedula} />
          <FilaDetalleIcono icon={ICONS.phone} label="Teléfono" value={colaborador.telefono} />
          <FilaDetalleIcono icon={ICONS.user} label="Correo" value={colaborador.email} />
          <FilaDetalleIcono icon={ICONS.location} label="Finca" value={fincaNombre} />
        </Card>

        {/* Trabajadores a cargo (si es dueño externo) */}
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

        {/* Botones de acción */}
        <View style={styles.botonesContainer}>
          <Button
            variant="outline"
            onPress={handleEditar}
            style={[styles.boton, styles.botonEditar]}
          >
            <Icon icon={ICONS.edit} size={18} color={COLORS.primary} />
            <CustomText style={styles.botonTextoEditar}>Editar Colaborador</CustomText>
          </Button>
          <Button
            variant="outline"
            onPress={handleEliminarPress}
            style={[styles.boton, styles.botonEliminar]}
            disabled={eliminando}
          >
            <Icon icon={ICONS.delete} size={18} color={COLORS.error} />
            <CustomText style={styles.botonTextoEliminar}>
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