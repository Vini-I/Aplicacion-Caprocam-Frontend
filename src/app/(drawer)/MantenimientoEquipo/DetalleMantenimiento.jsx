/**
 * ============================================================
 * RUTA: src/app/(drawer)/equipos/DetalleMantenimiento.jsx
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 * 
 * Responsabilidad: Exponer la pantalla de detalle de mantenimiento.
 * 
 * Dependencias:
 * - DetalleMantenimiento.jsx (Screen)
 * ============================================================
 */

import DetalleMantenimientoScreen from "../../../modules/mantEquipo/screens/DetalleMantenimiento";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function DetalleMantenimientoRoute() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const handleNavigateToEdit = (ticketId) => {
    router.replace({
      pathname: "/mantenimientoEquipo/EditarMantenimiento",
      params: { id: ticketId }
    });
  };

  const handleNavigateToMain = (routeParams = {}) => {
    router.replace({
      pathname: "/mantenimientoEquipo",
      params: routeParams
    });
  };

  return (
    <DetalleMantenimientoScreen 
      id={id}
      alertaTipo={params.alertaTipo}
      alertaMensaje={params.alertaMensaje}
      onNavigateToEdit={handleNavigateToEdit}
      onNavigateToMain={handleNavigateToMain}
    />
  );
}
