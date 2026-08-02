import { useLocalSearchParams } from "expo-router";
import Screen from "../../../../modules/densidadPoblacional/screens/EditarDensidadScreen";

export default function EditarDensidadPoblacionalRoute() {
  const { id } = useLocalSearchParams();
  const registroId = id != null ? String(id) : undefined;
  return <Screen registroId={registroId} />;
}