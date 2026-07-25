/**
 * ============================================================
 * RUTA: src/app/(drawer)/equipos/EditarMantenimiento.jsx
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 * 
 * Responsabilidad: Exponer la pantalla de edición de mantenimiento.
 * 
 * Dependencias:
 * - EditarMantenimiento.jsx (Screen)
 * ============================================================
 */

import EditarMantenimientoScreen from "../../../modules/mantEquipo/screens/EditarMantenimiento";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditarMantenimientoRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleNavigateToDetail = (ticketId, params = {}) => {
    router.replace({
      pathname: "/equipos/DetalleMantenimiento",
      params: { id: ticketId, ...params }
    });
  };

  const handleNavigateToMain = () => {
    router.replace("/equipos/mantEquipo");
  };

  return (
    <EditarMantenimientoScreen 
      id={id} 
      onNavigateToDetail={handleNavigateToDetail}
      onNavigateToMain={handleNavigateToMain}
    />
  );
}
