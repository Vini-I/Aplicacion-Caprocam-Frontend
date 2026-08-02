import { useLocalSearchParams } from "expo-router";
import Screen from "../../../../modules/raleo/screens/EditarRaleoScreen";

export default function EditarRaleoRoute() {
  const { id } = useLocalSearchParams();
  const registroId = id != null ? String(id) : undefined;
  return <Screen registroId={registroId} />;
}
