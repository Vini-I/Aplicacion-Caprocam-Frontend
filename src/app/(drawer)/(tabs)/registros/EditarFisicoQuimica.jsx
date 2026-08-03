import { useLocalSearchParams } from "expo-router";
import EditarFisicoQuimicaScreen from "../../../../modules/mantAgua/screens/EditarFisicoQuimicaScreen";

export default function EditarFisicoQuimicaRoute() {
  const { id } = useLocalSearchParams();
  const registroId = id != null ? String(id) : undefined;
  return <EditarFisicoQuimicaScreen registroId={registroId} />;
}
