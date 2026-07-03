import { useLocalSearchParams } from "expo-router";
import { fincas } from "../screens/FincaData";
import { estanques } from "../screens/EstanqueData";
import { usePdf } from "../hooks/usePdf";

export default function useFincaDetalle() {
    
    const { id } = useLocalSearchParams();

    const finca = fincas.find((f) => f.codigoInterno === id);

    const estanquesFinca = finca? estanques.filter((e) => e.finca === finca.nombre) : [];

    const { crearPDFFinca, loading } = usePdf();

    const haldleGenerar = () => crearPDFFinca(finca, estanquesFinca);

    return {
        finca,
        estanquesFinca, 
        haldleGenerar, 
        loading,
    }
}