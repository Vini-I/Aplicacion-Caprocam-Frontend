import ProveedorScreen from "../../../../modules/inventarios/screens/ProveedorScreen";
import { proveedoresService } from "../../../../modules/inventarios/services/proveedoresService";

export default function ProveedoresRoute() {
  return <ProveedorScreen proveedores={proveedoresService} />;
}