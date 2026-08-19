import { useRouter } from "expo-router";
import FincaNuevaScreen from "../../../../modules/finca/screens/FincaNuevaScreen";

export default function Nueva() {

  const router = useRouter();

  const handleFinca = () => {
    router.push("/finca");
  };

  return <FincaNuevaScreen 
  onFinca={handleFinca}
  />;
}
