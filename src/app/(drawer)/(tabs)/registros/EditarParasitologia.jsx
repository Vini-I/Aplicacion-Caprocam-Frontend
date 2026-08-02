import { useLocalSearchParams } from "expo-router";
import EditarParasitologiaScreen from "../../../../modules/parasitologia/screens/EditarParasitologiaScreen";

export default function EditarParasitologiaRoute() {
  const { id } = useLocalSearchParams();
  const registroId = id != null ? String(id) : undefined;
  return <EditarParasitologiaScreen registroId={registroId} />;
}
