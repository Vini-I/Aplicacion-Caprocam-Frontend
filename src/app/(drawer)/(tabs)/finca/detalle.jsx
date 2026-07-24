import { useRouter } from "expo-router";
import FincaDetalleScreen from "../../../../modules/finca/screens/FincaDetalleScreen";

export default function Detalle() {

  const router = useRouter();

  const handleNuevoEstanque = (codigoBCO) => {
    router.push({
        pathname:"/finca/estanque",
        params:{ codigoBCO }
    });
  };
   
  const handleDetalleEstanque = (id) => {
    router.push(`/finca/detalleEstanque?id=${id}`);
  };

  const handleEditarEstanque = (codigoCBO, id) => {
    router.push({
      pathname: "/finca/editarEstanque",
      params: { codigoCBO, id }
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