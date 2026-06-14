import ProveedorScreen from "../../../../modules/inventarios/screens/ProveedorScreen";
import { proveedoresData } from "../../../../modules/inventarios/services/proveedoresService";

export default function ProveedoresRoute() {
  return <ProveedorScreen proveedores={proveedoresData} />;
}