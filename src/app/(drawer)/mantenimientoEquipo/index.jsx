import { useRouter, useLocalSearchParams } from "expo-router";
import MantenimientoPrincipal from "../../../modules/mantEquipo/screens/MantenimientoPrincipal";

export default function EquipoMantenimiento() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleVerDetalle = (id) => {
    router.push(`/mantenimientoEquipo/DetalleMantenimiento?id=${id}`);
  };

  const handleNuevoTicket = () => {
    router.push("/mantenimientoEquipo/AgregarMantenimiento");
  };

  const handleTareas = () => {
    router.push("/mantenimientoEquipo/tareas");
  };

  return (
    <MantenimientoPrincipal
      onNavigateToDetail={handleVerDetalle}
      onNavigateToCreate={handleNuevoTicket}
      onNavigateToTareas={handleTareas}
      onTasks={handleTareas}
      refreshTimestamp={params.refresh}
      alertaTipo={params.alertaTipo}
      alertaMensaje={params.alertaMensaje}
    />
  );
}