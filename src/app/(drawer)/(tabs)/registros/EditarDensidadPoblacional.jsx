import { useLocalSearchParams } from "expo-router";
import EditarDensidadScreen from "../../../../modules/densidadPoblacional/screens/EditarDensidadScreen";

export default function EditarDensidadRoute() {
  const { id } = useLocalSearchParams();
  const registroId = id != null ? String(id) : undefined;
  return <EditarDensidadScreen registroId={registroId} />;
}
