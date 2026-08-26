/**
 * ============================================================
 * HOOK: useDetalleEquipoScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Responsabilidad:
 * Encapsula toda la lógica de la pantalla DetalleEquipoScreen:
 * carga de equipo y estanque, eliminación, alertas y modales.
 *
 * @dependencies - equiposService (getEquipoById, getEstanquesDisponibles, deleteEquipo)
 * @validations  - ID de equipo válido
 * @navigation   - router.push → edición / estanque, router.replace → lista tras eliminar
 *
 * Parámetros:
 * - { id, router }: id del equipo y router de expo-router
 *
 * Retorna:
 * - equipo, estanque, loading, error, alert
 * - showConfirmModal, deleteTarget
 * - handleEditar, handleEliminarPress, confirmDelete, cancelDelete, handleEstanquePress
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';
import { equiposService } from '../services/equiposService';
import { useError } from '../../../shared/context/ErrorContext';
import { ICONS } from '../../../theme/icons';

// Constantes de presentación que antes vivían en la pantalla
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

function horasRestantesMantenimiento(equipo) {
  if (!equipo || !equipo.horasMantenimiento) return 0;
  const restantes = equipo.horasMantenimiento - (equipo.horasUso || 0);
  return restantes > 0 ? restantes : 0;
}

export function useDetalleEquipoScreen({ id, router }) {
  const [equipo, setEquipo] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { mostrarError } = useError();

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await equiposService.getEquipoById(id);
      setEquipo(data);

      if (data.estanqueId) {
        // El backend no expone GET /estanques/:id, así que se busca
        // dentro de la lista de estanques disponibles.
        const estanques = await equiposService.getEstanquesDisponibles();
        const encontrado = estanques.find((e) => e.value === String(data.estanqueId));
        setEstanque(encontrado || null);
      } else {
        setEstanque(null);
      }
    } catch (err) {
      setError(err.message || 'No se pudo cargar el equipo.');
      mostrarError(err);
    } finally {
      setLoading(false);
    }
  }, [id, mostrarError]);

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
      setShowConfirmModal(false);
      router.replace({
        pathname: '/equipos/equipos',
        params: {
          alertType: 'success',
          alertMessage: `Equipo "${equipo.nombre}" eliminado.`,
        },
      });
    } catch (err) {
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTarget(null);
  };

  const handleEstanquePress = () => {
    if (estanque) {
      router.push(`/estanques/detalle?id=${estanque.value}`);
    }
  };

  // Contador en vivo
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!equipo?.encendido || !equipo?.fechaUltimoEncendido) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [equipo?.encendido, equipo?.fechaUltimoEncendido]);

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

  // Valores derivados para la UI (antes definidos en la pantalla)
  const tipoIcon = useMemo(() => (equipo ? (TIPOS_ICONS[equipo.tipo] || ICONS.gear) : ICONS.gear), [equipo]);
  const tipoLabel = useMemo(() => (equipo ? (TIPOS_LABELS[equipo.tipo] || equipo.tipo) : ''), [equipo]);
  const estadoLabel = useMemo(() => (equipo ? (ESTADO_LABELS[equipo.estado] || equipo.estado) : ''), [equipo]);
  const estadoVariant = useMemo(() => (equipo ? (ESTADO_VARIANTS[equipo.estado] || 'info') : 'info'), [equipo]);
  const horasRestantes = useMemo(() => {
    if (!equipo?.horasMantenimiento) return 0;
    const restantes = equipo.horasMantenimiento - horasUsoActuales;
    return restantes > 0 ? restantes : 0;
  }, [equipo, horasUsoActuales]);
  const necesitaMant = useMemo(() => horasRestantes === 0, [horasRestantes]);
  const horasUsoFormateado = useMemo(() => {
    if (!equipo) return '—';
    const totalMinutos = Math.max(0, Math.round(horasUsoActuales * 60));
    if (totalMinutos < 60) {
      return `${totalMinutos} min`;
    }
    const horas = Math.floor(totalMinutos / 60);
    const mins = totalMinutos % 60;
    return mins > 0 ? `${horas} h ${mins} min` : `${horas} h`;
  }, [equipo, horasUsoActuales]);

  return {
    equipo,
    estanque,
    loading,
    error,
    showConfirmModal,
    deleteTarget,
    handleEditar,
    handleEliminarPress,
    confirmDelete,
    cancelDelete,
    handleEstanquePress,
    // Valores derivados para facilitar la pantalla
    tipoIcon,
    tipoLabel,
    estadoLabel,
    estadoVariant,
    horasRestantes,
    necesitaMant,
    horasUsoFormateado,
  };
}