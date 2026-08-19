import { useRouter } from "expo-router";
import DetalleProveedorScreen from "../../../modules/proveedores/screens/DetalleProveedorScreen";

export default function DetalleProveedor() {
  const router = useRouter();

  const handleVolverAlListado = () => {
    router.replace("/(drawer)/proveedores/proveedorScreen");
  };

  const handleEditarProveedor = (id) => {
    router.push({
      pathname: "/(drawer)/proveedores/editarProveedor",
      params: { id: id.toString() },
    });
  };

  const handleEliminado = () => {
    router.replace("/(drawer)/proveedores/proveedorScreen");
  };

  return (
    <DetalleProveedorScreen
      onVolverAlListado={handleVolverAlListado}
      onEditarProveedor={handleEditarProveedor}
      onEliminado={handleEliminado}
    />
  );
}
