/**
 * ============================================================
 * RUTA: src/app/(drawer)/equipos/AgregarMantenimiento.jsx
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 * 
 * Responsabilidad: Exponer la pantalla de creación de mantenimiento.
 * 
 * Dependencias:
 * - AgregarMantenimiento.jsx (Screen)
 * ============================================================
 */

import AgregarMantenimientoScreen from "../../../modules/mantEquipo/screens/AgregarMantenimiento";
import { useRouter } from "expo-router";

export default function AgregarMantenimientoRoute() {
  const router = useRouter();
  
  const handleNavigateToMain = (params = {}) => {
    router.replace({
      pathname: "/equipos/mantEquipo",
      params
    });
  };

  return <AgregarMantenimientoScreen onNavigateToMain={handleNavigateToMain} />;
}
