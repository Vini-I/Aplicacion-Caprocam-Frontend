import { useLocalSearchParams } from "expo-router";
import EstanqueScreen from "../../../../modules/estanques/screens/NuevoEstanqueScreen";

export default function Estanque() {
    const { codigoCBO, id } = useLocalSearchParams();

    return <EstanqueScreen codigoCBO={codigoCBO} id={id}/>
}