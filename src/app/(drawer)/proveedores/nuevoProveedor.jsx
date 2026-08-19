import { useRouter } from "expo-router";
import NuevoProveedorScreen from "../../../modules/proveedores/screens/NuevoProveedorScreen";

export default function NuevoProveedor() {
  const router = useRouter();

  const handleProveedor = () => {
    router.replace("/(drawer)/proveedores/proveedorScreen");
  };

  return <NuevoProveedorScreen onProveedor={handleProveedor} />;
}
