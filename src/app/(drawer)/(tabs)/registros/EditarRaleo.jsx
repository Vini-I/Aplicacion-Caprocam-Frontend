import { useLocalSearchParams } from "expo-router";
import EditarRaleoScreen from "../../../../modules/raleo/screens/EditarRaleoScreen";

export default function EditarRaleoRoute() {
  const { id } = useLocalSearchParams();
  const registroId = id != null ? String(id) : undefined;
  return <EditarRaleoScreen registroId={registroId} />;
}
