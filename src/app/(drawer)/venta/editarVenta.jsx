import { useRouter, useLocalSearchParams } from "expo-router";
import VentaEditarScreen from "../../../modules/mantVenta/screens/VentaEditarScreen";

export default function EditarVenta() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

const handleVenta = ({ success, message }) => {
  router.push({
    pathname: "/(drawer)/venta/detalleVenta",
    params: {
      success: success ? "1" : "0",
      message,
    },
  });
};

  return <VentaEditarScreen onVenta={handleVenta} id={id} />;
}
