import { useRouter, useLocalSearchParams } from "expo-router";
import DetalleVenta from "../../../modules/mantVenta/screens/DetalleVentasScreen";

export default function DetalleVentaScreen() {
  const router = useRouter();
  const { success, message } = useLocalSearchParams();

  return (
    <DetalleVenta
      success={success}
      message={message}
      onEdit={(id) =>
        router.push({
          pathname: "/(drawer)/venta/editarVenta",
          params: { id },
        })
      }
    />
  );
}