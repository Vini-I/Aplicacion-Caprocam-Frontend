import { useLocalSearchParams } from "expo-router";
import Screen from "../../../../modules/mantCrecimiento/screens/EditarCrecimientoScreen";

export default function EditarCrecimientoRoute() {
  const { id } = useLocalSearchParams();
  const registroId = id != null ? String(id) : undefined;
  return <Screen registroId={registroId} />;
}
