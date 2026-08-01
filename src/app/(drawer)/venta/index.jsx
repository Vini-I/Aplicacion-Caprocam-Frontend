import { useRouter } from "expo-router";
import VentaScreen from '../../../modules/mantVenta/screens/VentaScreen';

export default function VentaIndexScreen() {

    const router = useRouter();

    const haldleDetalleVentas = (ventas, fincaSeleccionada) => {
        router.push({
            pathname: "/(drawer)/venta/detalleVenta",
            params: {
                ventas: JSON.stringify(ventas),
                fincaSeleccionada,
            },
        });
    }

  return <VentaScreen 
        onDetalleVentas={haldleDetalleVentas}
  />
}
