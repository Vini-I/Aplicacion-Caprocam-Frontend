/**
 * ============================================================
 * HOOK USEHISTORIALALIMENTACION
 * ============================================================
 *
 * Concentra lo que necesita screens/HistorialAlimentacionScreen.jsx
 * (pantalla de solo lectura): la carga del historial completo de
 * registros, el total a mostrar en el encabezado y el callback de
 * volver atrás. La screen queda solamente con la composición de la
 * UI, sin llamar hooks de datos ni a navigation directamente.
 *
 * Funcionalidad:
 * - La carga real la sigue haciendo useAlimentacion; este hook solo
 *   la compone para la pantalla de historial, de la misma forma en
 *   que useAlimentacionScreen la compone para la de registro.
 * - `volver` es tolerante a que no llegue navigation (usa
 *   optional chaining), igual que el resto de hooks del módulo.
 *
 * Parámetros:
 * - navigation: objeto de navegación (se usa navigation.goBack()).
 *
 * Retorna:
 * - alimentaciones: lista completa de registros guardados.
 * - loading: true mientras se están cargando los datos.
 * - error: mensaje de error si la carga falla, si no null.
 * - total: cantidad de registros del historial.
 * - volver: callback del botón Volver.
 *
 * Ejemplo:
 * const { alimentaciones, loading, total, volver } =
 *   useHistorialAlimentacion(navigation);
 */

import useAlimentacion from "./useAlimentacion";

export default function useHistorialAlimentacion(navigation) {
  const { alimentaciones, loading, error } = useAlimentacion();

  const total = alimentaciones.length;

  const volver = () => {
    navigation?.goBack();
  };

  return {
    alimentaciones,
    loading,
    error,
    total,
    volver,
  };
}
