/**
 * ============================================================
 * RUTA: src/app/(drawer)/equipos/mantEquipo.jsx
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 * 
 * Responsabilidad: Exponer la pantalla principal de listado de tickets.
 * 
 * Dependencias:
 * - ManteniminetoPrincipal.jsx
 * ============================================================
 */

import ManteniminetoPrincipal from "../../../modules/mantEquipo/screens/ManteniminetoPrincipal";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function MantEquipo() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <ManteniminetoPrincipal
      onNavigateToCreate={() => router.push("/equipos/AgregarMantenimiento")}
      onNavigateToDetail={(id) => router.push({ pathname: "/equipos/DetalleMantenimiento", params: { id } })}
      onNavigateToTareas={() => router.push("/equipos/tareas")}
      refreshTimestamp={params.refresh}
      alertaTipo={params.alertaTipo}
      alertaMensaje={params.alertaMensaje}
    />
  );
}
