/**
 * ============================================================
 * PANTALLA: DetalleTareaScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Muestra el detalle completo de una tarea en una pantalla independiente.
 * Es de solo lectura, pero permite navegar a la edición o eliminar la tarea.
 *
 * Datos:
 * - Obtiene el id de la tarea desde los parámetros de ruta.
 * - Carga la tarea usando tareasService.obtenerTareaPorId.
 *
 * Validaciones:
 * - Si la tarea no existe, muestra un mensaje de error.
 *
 * Navegación:
 * - Botón "Volver" (NavbarRegistro) regresa a la lista.
 * - Botón "Editar" navega a /equipos/tareaForm?id={id}.
 * - Botón "Eliminar" abre ModalEliminar y, al confirmar, elimina y regresa.
 *
 * Dependencias:
 * - tareasService (para obtener la tarea)
 * - shared/components (NavbarRegistro, Card, Icon, Button, ModalEliminar, etc.)
 * - styles/tareasStyles (reutiliza algunos estilos)
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

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
import { styles, detalleStyles } from '../styles/tareasStyles';

import * as tareasService from '../services/tareasService';
import { OPCIONES_CATEGORIA, OPCIONES_ESTADO } from '../constants/tareasMensajes';

// Componente interno para fila con ícono alineado a la izquierda
function FilaDetalleIcono({ icon, label, value }) {
  return (
    <View style={detalleStyles.fila}>
      <View style={detalleStyles.iconoWrapper}>
        <Icon icon={icon} size={18} color={COLORS.textTertiary} />
      </View>
      <View style={detalleStyles.contenido}>
        <CustomText style={detalleStyles.etiqueta}>{label}</CustomText>
        <CustomText style={detalleStyles.valor}>{value || '—'}</CustomText>
      </View>
    </View>
  );
}

export default function DetalleTareaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [tarea, setTarea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const cargarTarea = async () => {
      try {
        const data = await tareasService.obtenerTareaPorId(id);
        setTarea(data);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la tarea.');
      } finally {
        setLoading(false);
      }
    };
    if (id) cargarTarea();
    else setError('ID de tarea no proporcionado.');
  }, [id]);

  const handleEditar = () => {
    router.push(`/equipos/tareaForm?id=${tarea.id}`);
  };

  const handleEliminarPress = () => {
    setDeleteTarget(tarea);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await tareasService.eliminarTarea(tarea.id);
      setAlert({ type: 'danger', message: `Tarea "${tarea.nombre}" eliminada.` });
      setShowConfirmModal(false);
      setTimeout(() => router.replace('/equipos/tareas'), 1500);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'No se pudo eliminar la tarea.' });
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <View style={[STYLE.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Spinner />
      </View>
    );
  }

  if (error || !tarea) {
    return (
      <>
        <NavbarRegistro Titulo="Detalle de Tarea" Subtitulo="Error" Icono="document" />
        <View style={[STYLE.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <CustomText style={{ color: COLORS.error }}>
            {error || 'Tarea no encontrada'}
          </CustomText>
        </View>
      </>
    );
  }

  const categoriaLabel =
    OPCIONES_CATEGORIA.find((c) => c.value === tarea.categoria)?.label || tarea.categoria;
  const estadoLabel =
    OPCIONES_ESTADO.find((e) => e.value === tarea.estado)?.label || tarea.estado;

  return (
    <>
      <ScrollView style={STYLE.container} contentContainerStyle={STYLE.contentWrapper}>
        <Card>
          <FilaDetalleIcono
            icon={ICONS.certificate}
            label="ID"
            value={tarea.id}
          />
          <FilaDetalleIcono
            icon={ICONS.user}
            label="Nombre"
            value={tarea.nombre}
          />
          <FilaDetalleIcono
            icon={ICONS.document}
            label="Descripción"
            value={tarea.descripcion}
          />
          <FilaDetalleIcono
            icon={ICONS.id}
            label="Categoría"
            value={categoriaLabel}
          />
          <FilaDetalleIcono
            icon={ICONS.clock}
            label="Duración estimada"
            value={`${tarea.duracionEstimada} hrs`}
          />
          <FilaDetalleIcono
            icon={ICONS.check}
            label="Estado"
            value={estadoLabel}
          />
          <FilaDetalleIcono
            icon={ICONS.box}
            label="Productos"
            value={
              tarea.productos && tarea.productos.length > 0
                ? tarea.productos.map((p) => `${p.nombre || `ID:${p.productoId}`} (${p.cantidad} u)`).join(', ')
                : '—'
            }
          />
        </Card>

        {alert && (
          <View style={{ marginBottom: 12 }}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <Button
            variant="outline"
            onPress={handleEditar}
            style={{ flex: 1, borderColor: COLORS.primary }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon icon={ICONS.edit} size={18} color={COLORS.primary} />
              <CustomText style={{ color: COLORS.primary, fontWeight: '600' }}>Editar</CustomText>
            </View>
          </Button>
          <Button
            variant="outline"
            onPress={handleEliminarPress}
            style={{ flex: 1, borderColor: COLORS.error }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon icon={ICONS.delete} size={18} color={COLORS.error} />
              <CustomText style={{ color: COLORS.error, fontWeight: '600' }}>Eliminar</CustomText>
            </View>
          </Button>
        </View>
      </ScrollView>

      <ModalEliminar
        visible={showConfirmModal}
        title="Tarea"
        message={deleteTarget ? deleteTarget.nombre : ''}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}