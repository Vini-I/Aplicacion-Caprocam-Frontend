import { useLocalSearchParams } from "expo-router";
import EditarEstanque from "../../../../modules/estanques/screens/EditarEstanqueScreen";

export default function EditarEstanquePage() {
  const { codigoCVO, id } = useLocalSearchParams();

  return <EditarEstanque codigoCVO={codigoCVO} id={id}/>
}