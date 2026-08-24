import { useRouter } from "expo-router";
import FincaDetalleScreen from "../../../../modules/finca/screens/FincaDetalleScreen";

export default function Detalle() {

  const router = useRouter();

  const handleNuevoEstanque = (codigoBCO, id) => {
    router.push({
        pathname:"/finca/estanque",
        params:{ codigoBCO, id }
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

  const handleEditarEstanque = (codigoCVO, id) => {
    router.push({
      pathname: "/finca/editarEstanque",
      params: { codigoCVO, id }
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