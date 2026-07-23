import { useRouter } from "expo-router";
import FincaDetalleScreen from "../../../../modules/finca/screens/FincaDetalleScreen";

export default function Detalle() {

  const router = useRouter();

  const handleNuevoEstanque = () => {
    router.push("/finca/estanque");
  };
   
  const handleDetalleEstanque = (id) => {
    router.push(`/finca/detalleEstanque?id=${id}`);
  };

  const handleEditarEstanque = (id) => {
    router.push({
      pathname: "/finca/editarEstanque",
      params: {
        id
      }
    });
  }

  return (
    <FincaDetalleScreen 
      onEstanque={handleNuevoEstanque}
      onEstanqueDetalle={handleDetalleEstanque}
      onEstanqueEditar={handleEditarEstanque}
    />
  );
}