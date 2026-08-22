import { useRouter } from "expo-router";
import ProveedorScreen from "../../../modules/proveedores/screens/ProveedorScreen";

export default function Proveedores() {
  const router = useRouter();

  const handleVerDetalle = (id) => {
    router.push({
      pathname: "/(drawer)/proveedores/detalleProveedor",
      params: { id: id.toString() },
    });
  };

  const handleNuevoProveedor = () => {
    router.push("/(drawer)/proveedores/nuevoProveedor");
  };

  return (
    <ProveedorScreen
      onDetail={handleVerDetalle}
      onNew={handleNuevoProveedor}
    />
  );
}
