import { useLocalSearchParams } from "expo-router";
import EditarProveedorScreen from "../../../../modules/inventarios/screens/EditarProveedorScreen";

export default function EditarProveedorRoute() {
  const { id } = useLocalSearchParams();
  return <EditarProveedorScreen proveedorId={id} />;
}