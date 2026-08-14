import { useRouter, useLocalSearchParams } from "expo-router";
import EditarProveedorScreen from "../../../modules/proveedores/screens/EditarProveedorScreen";

export default function EditarProveedor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handleProveedor = () => {
    router.replace("/(drawer)/proveedores/proveedorScreen");
  };

  return <EditarProveedorScreen onProveedor={handleProveedor} id={id} />;
}