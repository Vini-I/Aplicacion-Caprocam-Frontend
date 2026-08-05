import { useLocalSearchParams } from "expo-router";
import EditarAlimentacion from "../../../../modules/alimentacion/screens/EditarAlimentacionScreen";

export default function EditarAlimentacionScreenWrapper() {
  const { id } = useLocalSearchParams();

  const registroId = id != null ? String(id) : undefined;

  return <EditarAlimentacion registroId={registroId} />;
}