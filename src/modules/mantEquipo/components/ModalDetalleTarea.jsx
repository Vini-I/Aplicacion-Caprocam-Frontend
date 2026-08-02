/**
 * ============================================================
 * COMPONENTE: ModalDetalleTarea
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Modal de solo lectura que muestra el detalle completo de una tarea.
 *
 * @dependencies - shared/components: Modal, Button, Icon, Text
 *               - theme: COLORS, ICONS
 *               - constants/tareasMensajes
 *               - styles/tareasStyles
 * @validations  - Ninguna (solo lectura)
 * @navigation   - Ninguna
 */

import React from 'react';
import { View } from 'react-native';
import Modal from '../../../shared/components/Modal';
import Button from '../../../shared/components/Button';
import Icon from '../../../shared/components/Icons';
import CustomText from '../../../shared/components/Text';
import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { OPCIONES_CATEGORIA, OPCIONES_ESTADO } from '../constants/tareasMensajes';
import { styles } from '../styles/tareasStyles';

export default function ModalDetalleTarea({ visible, tarea, onClose }) {
  if (!tarea) return null;

  const categoriaLabel =
    OPCIONES_CATEGORIA.find((c) => c.value === tarea.categoria)?.label || tarea.categoria;
  const estadoLabel =
    OPCIONES_ESTADO.find((e) => e.value === tarea.estado)?.label || tarea.estado;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      containerStyle={styles.modalContainer}
    >
      <View style={styles.detalleEncabezado}>
        <CustomText style={styles.modalTitle}>Detalle de tarea</CustomText>
      </View>

      <View style={styles.modalScroll}>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>ID</CustomText>
          <CustomText style={styles.equipoDetailVal}>{tarea.id}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Nombre</CustomText>
          <CustomText style={styles.equipoDetailVal}>{tarea.nombre}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Descripción</CustomText>
          <CustomText style={styles.equipoDetailVal}>{tarea.descripcion}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Categoría</CustomText>
          <CustomText style={styles.equipoDetailVal}>{categoriaLabel}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Duración estimada</CustomText>
          <CustomText style={styles.equipoDetailVal}>{tarea.duracionEstimada} hrs</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Estado</CustomText>
          <CustomText style={styles.equipoDetailVal}>{estadoLabel}</CustomText>
        </View>
        <View style={styles.detalleRow}>
          <CustomText style={styles.equipoDetailLabel}>Productos</CustomText>
          <View style={styles.productosListFlex}>
            {tarea.productos && tarea.productos.length > 0 ? (
              tarea.productos.map((p) => (
                <CustomText key={p.productoId} style={styles.equipoDetailVal}>
                  {p.nombre || `ID: ${p.nombre}`} - {p.cantidad} u
                </CustomText>
              ))
            ) : (
              <CustomText style={styles.equipoDetailVal}>—</CustomText>
            )}
          </View>
        </View>
      </View>

      <View style={styles.modalFooter}>
        <Button
          variant="outline"
          onPress={onClose}
          style={[styles.btnCancel, styles.btnCancelCerrar]}
        >
          <Icon icon={ICONS.exit} size={18} color={COLORS.primary} />
          <CustomText style={styles.btnCancelText}>Cerrar</CustomText>
        </Button>
      </View>
    </Modal>
  );
}