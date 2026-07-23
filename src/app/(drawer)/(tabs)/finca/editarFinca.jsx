import { useRouter, useLocalSearchParams  } from "expo-router";
import FincaEditarScreen from "../../../../modules/finca/screens/FincaEditarScreen";

export default function Editar() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handleFinca = () => {
    router.push("/finca");
  };

  return <FincaEditarScreen 
  onFinca={handleFinca}
  id={id}
  />;
}
