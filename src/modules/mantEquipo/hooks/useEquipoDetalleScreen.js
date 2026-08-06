/**
 * ============================================================
 * HOOK: useEquipoDetalleScreen
 * ============================================================
 *
 * Carga el equipo por ID y su estanque asociado. Calcula datos
 * derivados (tipoLabel, tipoIcon, estadoLabel, estadoVariant,
 * horasRestantes, necesitaMant) y expone handleTogglePress.
 *
 * @dependencies - equiposService (getEquipoById, getEstanquesDisponibles)
 *               - ICONS de theme/icons
 * @validations  - equipoId requerido; sin él no se realiza ninguna petición.
 *               - Se monta como componente hijo dentro de EquiposListScreen,
 *                 no como ruta independiente.
 * @navigation   - Ninguna. Los callbacks onClose/onEdit/onDelete son props externas.
 *
 * @param {{ equipoId: string, onToggle?: Function }} params
 * @returns {Object} equipo, estanque, loading, error, datos derivados, handleTogglePress
 */

import { useState, useEffect } from 'react';
import { equiposService } from '../services/equiposService';
import { ICONS } from '../../../theme/icons';
import { useError } from '../../../shared/context/ErrorContext';

const TIPOS_LABELS = {
  aireacion: 'Aireación',
  bombeo: 'Bombeo',
  alimentacion: 'Alimentación',
  monitoreo: 'Monitoreo',
  mantenimiento: 'Mantenimiento',
  otro: 'Otro',
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
  activo: 'Activo',
  inactivo: 'Inactivo',
  mantenimiento: 'Mantenimiento',
};

const ESTADO_VARIANTS = {
  activo: 'success',
  inactivo: 'danger',
  mantenimiento: 'warning',
};

export function useEquipoDetalleScreen({ equipoId, onToggle }) {
  const { mostrarError } = useError();
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
        mostrarError(err);
      } finally {
        setLoading(false);
      }
    };
    if (equipoId) {
      loadData();
    }
  }, [equipoId, mostrarError]);

  const handleTogglePress = () => {
    if (onToggle && equipo) {
      onToggle(equipo.id);
    }
  };

  // Datos derivados (solo calculados si equipo existe)
  const tipoLabel = equipo ? (TIPOS_LABELS[equipo.tipo] || equipo.tipo) : '';
  const tipoIcon = equipo ? (TIPOS_ICONS[equipo.tipo] || ICONS.gear) : ICONS.gear;
  const estadoLabel = equipo ? (ESTADO_LABELS[equipo.estado] || equipo.estado) : '';
  const estadoVariant = equipo ? (ESTADO_VARIANTS[equipo.estado] || 'info') : 'info';
  const horasRestantes = equipo
    ? Math.max(0, (equipo.horasMantenimiento || 0) - (equipo.horasUso || 0))
    : 0;
  const necesitaMant = equipo && equipo.horasMantenimiento ? horasRestantes === 0 : false;
  const horasUsoFormateado = equipo
    ? (equipo.horasUso < 1
        ? `${Math.round(equipo.horasUso * 60)} min`
        : `${Math.round(equipo.horasUso)} h`)
    : '0 h';

  return {
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
  };
}