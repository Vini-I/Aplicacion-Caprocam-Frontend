import { useLocalSearchParams } from "expo-router";
import Screen from "../../../../modules/enfermedades/screens/EditarEnfermedadScreen";

export default function EditarEnfermedadRoute() {
  const { id } = useLocalSearchParams();
  const registroId = id != null ? String(id) : undefined;
  return <Screen registroId={registroId} />;
}