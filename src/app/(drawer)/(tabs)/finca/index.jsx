import { useRouter } from "expo-router";
import FincaScreen from "../../../../modules/finca/screens/FincaScreen";

export default function Finca() {
  const router = useRouter();

  const handleVerDetalle = (id) => {
    router.push(`/finca/detalle?id=${id}`);
  };

  const handleNuevaFinca = () => {
    router.push("/finca/nueva");
  };

  const handleEditarFinca = () => {
    router.push("/finca/editarFinca")
  }

  return (
    <FincaScreen
      onDetail={handleVerDetalle}
      onNew={handleNuevaFinca}
      onEdit={handleEditarFinca}
    />
  );
}
