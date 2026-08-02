import { useLocalSearchParams } from "expo-router";
import EditarCrecimientoScreen from "../../../../modules/mantCrecimiento/screens/EditarCrecimientoScreen";

export default function EditarCrecimientoRoute() {
  const { id } = useLocalSearchParams();
  const registroId = id != null ? String(id) : undefined;
  return <EditarCrecimientoScreen registroId={registroId} />;
}
