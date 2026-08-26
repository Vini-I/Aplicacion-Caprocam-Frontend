import { useLocalSearchParams } from "expo-router";
import EditarEstanque from "../../../../modules/estanques/screens/EditarEstanqueScreen";

export default function EditarEstanquePage() {
  const { codigoCBO, id } = useLocalSearchParams();

  return <EditarEstanque codigoCBO={codigoCBO} id={id}/>
}