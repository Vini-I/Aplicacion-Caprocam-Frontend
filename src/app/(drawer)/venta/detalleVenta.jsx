import { useRouter } from "expo-router";
import DetalleVenta from '../../../modules/mantVenta/screens/DetalleVentasScreen';

export default function DetalleVentaScreen() {
  const router = useRouter();

  return (
    <DetalleVenta
      onEdit={(id) =>
        router.push({ pathname: "/(drawer)/venta/editarVenta", params: { id } })
      }
    />
  );
}
