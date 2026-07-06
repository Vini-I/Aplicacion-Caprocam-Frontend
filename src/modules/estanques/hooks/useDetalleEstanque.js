import { useLocalSearchParams } from "expo-router";
import { estanques } from "../../finca/screens/EstanqueData";

export default function useDetalleEstanque() {
  const { id } = useLocalSearchParams();

  const estanque = estanques.find((e) => e.codigo === id);

  return {
    estanque,
  };
}