import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';

/**
 * ============================================================
 * HOOK useFisicoQuimica
 * ============================================================
 *
 * Maneja el estado de la pantalla Físico-Química: lecturas de
 * salinidad, temperatura, pH y oxígeno; las alertas de
 * "guardado"/"actualizado" con su timer; y la navegación de
 * regreso a /registros tras guardar.
 *
 * ---
 * RETORNA
 * ---
 * salinidad          string — valor actual de salinidad
 * setSalinidad       fn     — setter, se pasa al onChange de RangeCard
 * setTempReadings    fn     — setter para lecturas de temperatura
 * setPhReadings      fn     — setter para lecturas de pH
 * setOxReadings      fn     — setter para lecturas de oxígeno
 * showAlert          bool   — true mientras se muestra "guardado exitosamente"
 * showAlertEdit      bool   — true mientras se muestra "actualizado exitosamente"
 * handleGuardar      fn     — dispara el alert de guardado y navega tras 500ms
 * handleEditar       fn     — dispara el alert de edición y navega tras 500ms
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * const { showAlert, handleGuardar, setPhReadings } = useFisicoQuimica();
 *
 * <RangeCard title="pH" onChange={setPhReadings} ... />
 * <Button onPress={handleGuardar}>Guardar módulo</Button>
 */

export default function useFisicoQuimica() {
  const [salinidad, setSalinidad]         = useState('14');
  const [, setTempReadings]               = useState([]);
  const [, setPhReadings]                 = useState([]);
  const [, setOxReadings]                 = useState([]);
  const [showAlert, setShowAlert]         = useState(false);
  const [showAlertEdit, setShowAlertEdit] = useState(false);

  const alertTimerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    };
  }, []);

  const handleGuardar = useCallback(() => {
    setShowAlert(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => {
      setShowAlert(false);
      alertTimerRef.current = null;
      router.replace('/(drawer)/(tabs)/registros');
    }, 500);
  }, [router]);

  const handleEditar = useCallback(() => {
    setShowAlertEdit(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => {
      setShowAlertEdit(false);
      alertTimerRef.current = null;
      router.replace('/(drawer)/(tabs)/registros');
    }, 500);
  }, [router]);

  return {
    salinidad, setSalinidad,
    setTempReadings, setPhReadings, setOxReadings,
    showAlert, showAlertEdit,
    handleGuardar, handleEditar,
  };
}