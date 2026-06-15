import { useRouter } from "expo-router";
import FincaDetalleScreen from "../../../../modules/finca/screens/FincaDetalleScreen";

export default function Detalle() {

  const router = useRouter();

  const handleNuevoEstanque = () => {
    router.push("/finca/estanque");
  };

  return (
    <FincaDetalleScreen 
      onEstanque={handleNuevoEstanque}
    />
  );
}