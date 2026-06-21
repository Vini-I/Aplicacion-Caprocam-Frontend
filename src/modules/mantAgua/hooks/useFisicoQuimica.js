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
 * setLecturasSalinidad  fn     — setter para lecturas de salinidad
 * setLecturasTemp       fn     — setter para lecturas de temperatura
 * setLecturasPh         fn     — setter para lecturas de pH
 * setLecturasOx         fn     — setter para lecturas de oxígeno
 * mostrarAlerta         bool   — true mientras se muestra "guardado exitosamente"
 * mostrarAlertaEdicion  bool   — true mientras se muestra "actualizado exitosamente"
 * alGuardar             fn     — dispara el alert de guardado y navega tras 500ms
 * alEditar              fn     — dispara el alert de edición y navega tras 500ms
 *
 * ---
 * EJEMPLO DE USO
 * ---
 * const { mostrarAlerta, alGuardar, setLecturasPh } = useFisicoQuimica();
 *
 * <RangeCard title="pH" onChange={setLecturasPh} ... />
 * <Button onPress={alGuardar}>Guardar módulo</Button>
 */

export default function useFisicoQuimica() {
  const [, setLecturasSalinidad]                         = useState([]);
  const [, setLecturasTemp]                              = useState([]);
  const [, setLecturasPh]                                = useState([]);
  const [, setLecturasOx]                                = useState([]);
  const [mostrarAlerta, setMostrarAlerta]                = useState(false);
  const [mostrarAlertaEdicion, setMostrarAlertaEdicion]  = useState(false);

  const timerAlertaRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    };
  }, []);

  const alGuardar = useCallback(() => {
    setMostrarAlerta(true);
    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMostrarAlerta(false);
      timerAlertaRef.current = null;
      router.replace('/(drawer)/(tabs)/registros');
    }, 500);
  }, [router]);

  const alEditar = useCallback(() => {
    setMostrarAlertaEdicion(true);
    if (timerAlertaRef.current) clearTimeout(timerAlertaRef.current);
    timerAlertaRef.current = setTimeout(() => {
      setMostrarAlertaEdicion(false);
      timerAlertaRef.current = null;
      router.replace('/(drawer)/(tabs)/registros');
    }, 500);
  }, [router]);

  return {
    setLecturasSalinidad,
    setLecturasTemp, setLecturasPh, setLecturasOx,
    mostrarAlerta, mostrarAlertaEdicion,
    alGuardar, alEditar,
  };
}