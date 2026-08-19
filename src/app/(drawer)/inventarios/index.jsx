import { useRouter } from "expo-router";
import InventarioScreen from "../../../modules/inventarios/screens/InventarioScreen";

export default function InventariosIndex() {
  const router = useRouter();

  const handleVerDetalle = (id) => {
    router.push(`/inventarios/detalleProducto?id=${id}`);
  };

  const handleNuevoProducto = () => {
    router.push("/inventarios/agregarProducto");
  };

  const handleInicio = () => {
    router.replace("/inicio");
  };

  return (
    <InventarioScreen
      onDetail={handleVerDetalle}
      onNew={handleNuevoProducto}
      onBack={handleInicio}
    />
  );
}