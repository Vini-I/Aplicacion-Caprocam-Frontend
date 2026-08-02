/**
 * ============================================================
 * COMPONENTE: FilaTarea
 * ============================================================
 *
 * Módulo: Mantenimiento de Equipos
 *
 * RESPONSABILIDAD:
 * - Componente personalizado que reutiliza elementos de shared/components.
 * - Renderizar una fila interactiva de la tabla de tareas con sus datos principales.
 *
 * @dependencies - Text.jsx (shared/components), tareasMensajes.js (constants), tareasStyles.js (styles)
 * @validations  - Traduce valores de categoría y estado a sus etiquetas legibles.
 * @navigation   - Recibe callback onPressFila para seleccionar o ver detalle de la tarea.
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import CustomText from '../../../shared/components/Text';
import { OPCIONES_CATEGORIA, OPCIONES_ESTADO } from '../constants/tareasMensajes';
import { styles } from '../styles/tareasStyles';

export default function FilaTarea({ tarea, onPressFila }) {
  const categoriaLabel =
    OPCIONES_CATEGORIA.find((c) => c.value === tarea.categoria)?.label || tarea.categoria;
  const estadoLabel =
    OPCIONES_ESTADO.find((e) => e.value === tarea.estado)?.label || tarea.estado;

  return (
    <Pressable onPress={() => onPressFila(tarea)} style={styles.rowInner}>
      <View style={styles.row}>
        <View style={styles.colId}>
          <CustomText style={styles.cellText}>{tarea.id}</CustomText>
        </View>
        <View style={styles.colNombre}>
          <CustomText style={styles.cellText} numberOfLines={1}>
            {tarea.nombre}
          </CustomText>
        </View>
        <View style={styles.colDesc}>
          <CustomText style={styles.cellText} numberOfLines={2}>
            {tarea.descripcion}
          </CustomText>
        </View>
        <View style={styles.colCategoria}>
          <CustomText style={styles.cellText}>{categoriaLabel}</CustomText>
        </View>
        <View style={styles.colDuracion}>
          <CustomText style={styles.cellText}>{tarea.duracionEstimada}</CustomText>
        </View>
        <View style={styles.colEstado}>
          <CustomText style={[styles.cellText, { fontWeight: '600' }]}>
            {estadoLabel}
          </CustomText>
        </View>
      </View>
    </Pressable>
  );
}