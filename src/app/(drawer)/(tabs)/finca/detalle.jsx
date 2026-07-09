import { useRouter } from "expo-router";
import FincaDetalleScreen from "../../../../modules/finca/screens/FincaDetalleScreen";

export default function Detalle() {

  const router = useRouter();

  const handleNuevoEstanque = () => {
    router.push("/finca/estanque");
  };
   
  const handleDetalleEstanque = (codigo) => {
    router.push(`/finca/detalleEstanque?id=${codigo}`);
  };

  const handleEditarEstanque = () => {
    router.push("/finca/editarEstanque");
  }

  return (
    <FincaDetalleScreen 
      onEstanque={handleNuevoEstanque}
      onEstanqueDetalle={handleDetalleEstanque}
      onEstanqueEditar={handleEditarEstanque}
    />
  );
}