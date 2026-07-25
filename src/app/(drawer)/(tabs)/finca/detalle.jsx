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
   
  const handleDetalleEstanque = (id, finca) => {
    router.push({
      pathname: "/finca/detalleEstanque",
      params: {
        id,
        fincaId: finca.id,
        fincaNombre: finca.nombreFinca,
      }
    });
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