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

import { useState, useEffect, useMemo } from 'react';
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

  // Contador en vivo
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!equipo?.encendido || !equipo?.fechaUltimoEncendido) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [equipo?.encendido, equipo?.fechaUltimoEncendido]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await equiposService.getEquipoById(equipoId);
      setEquipo(data);

      if (data?.estanqueId) {
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

  useEffect(() => {
    if (equipoId) {
      loadData();
    }
  }, [equipoId]);

  const handleTogglePress = async () => {
    if (onToggle && equipo) {
      await onToggle(equipo.id);
      // Recargar datos actualizados del equipo tras el toggle
      await loadData();
    }
  };

  // Cálculo de horas en vivo
  const horasUsoActuales = useMemo(() => {
    let base = Number(equipo?.horasBase ?? equipo?.horasActuales ?? equipo?.horasUso ?? 0);
    if (equipo?.encendido && equipo?.fechaUltimoEncendido) {
      const msInicio = new Date(equipo.fechaUltimoEncendido).getTime();
      if (!isNaN(msInicio)) {
        const msTranscurridos = Math.max(0, now - msInicio);
        const horasTranscurridas = msTranscurridos / (1000 * 60 * 60);
        base = parseFloat((base + horasTranscurridas).toFixed(4));
      }
    }
    return base;
  }, [equipo, now]);

  // Datos derivados
  const tipoLabel = equipo ? (TIPOS_LABELS[equipo.tipo] || equipo.tipo) : '';
  const tipoIcon = equipo ? (TIPOS_ICONS[equipo.tipo] || ICONS.gear) : ICONS.gear;
  const estadoLabel = equipo ? (ESTADO_LABELS[equipo.estado] || equipo.estado) : '';
  const estadoVariant = equipo ? (ESTADO_VARIANTS[equipo.estado] || 'info') : 'info';

  const horasRestantes = useMemo(() => {
    if (!equipo?.horasMantenimiento) return 0;
    const restantes = equipo.horasMantenimiento - horasUsoActuales;
    return restantes > 0 ? restantes : 0;
  }, [equipo, horasUsoActuales]);

  const necesitaMant = equipo && equipo.horasMantenimiento ? horasRestantes === 0 : false;

  const horasUsoFormateado = useMemo(() => {
    const totalMinutos = Math.max(0, Math.round(horasUsoActuales * 60));
    if (totalMinutos < 60) {
      return `${totalMinutos} min`;
    }
    const horas = Math.floor(totalMinutos / 60);
    const mins = totalMinutos % 60;
    return mins > 0 ? `${horas} h ${mins} min` : `${horas} h`;
  }, [horasUsoActuales]);

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