import { useLocalSearchParams } from "expo-router";
import EstanqueScreen from "../../../../modules/estanques/screens/NuevoEstanqueScreen";

export default function Estanque() {
    const { codigoBCO } = useLocalSearchParams();

    return <EstanqueScreen codigoCBO={codigoBCO}/>
}