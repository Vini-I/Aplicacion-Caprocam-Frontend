import { useLocalSearchParams } from "expo-router";
import EstanqueScreen from "../../../../modules/estanques/screens/NuevoEstanqueScreen";

export default function Estanque() {
    const { codigoCVO, id } = useLocalSearchParams();

    return <EstanqueScreen codigoCVO={codigoCVO} id={id}/>
}