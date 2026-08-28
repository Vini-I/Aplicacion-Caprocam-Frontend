import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as tareasService from '../services/tareasService';

export function useDetalleTarea() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tarea, setTarea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Alert local
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
      // limpiar params de la URL para no volver a mostrar
      router.setParams({ alertType: undefined, alertMessage: undefined });
    }
  }, [params?.alertMessage, params?.alertType, router]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await tareasService.obtenerTareaPorId(id);
        setTarea(data);
      } catch (err) {
        setError(err?.message || 'No se pudo cargar la tarea.');
      } finally {
        setLoading(false);
      }
    };
    if (id) cargar();
    else setError('ID de tarea no proporcionado.');
  }, [id]);

  const editar = (t) => {
    router.replace(`/mantenimientoEquipo/tareas/tareaForm?id=${t.id}`);
  };

  const eliminar = async (t) => {
    try {
      await tareasService.eliminarTarea(t.id);
      router.back();
    } catch (err) {
      showAlert('danger', err?.message || 'No se pudo eliminar la tarea');
      throw err;
    }
  };

  return { tarea, loading, error, alert, showAlert, editar, eliminar };
}
