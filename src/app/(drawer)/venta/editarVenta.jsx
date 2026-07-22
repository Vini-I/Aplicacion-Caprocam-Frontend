import { useRouter, useLocalSearchParams } from "expo-router";
import VentaEditarScreen from "../../../modules/mantVenta/screens/VentaEditarScreen";

export default function EditarVenta() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handleVenta = () => {
    router.push("/(drawer)/venta/detalleVenta");
  };

  return <VentaEditarScreen onVenta={handleVenta} id={id} />;
}
