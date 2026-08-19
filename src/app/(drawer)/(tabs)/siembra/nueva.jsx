import { useRouter } from "expo-router";
import NuevaSiembraScreen from "../../../../modules/siembra/screens/NuevaSiembraScreen";

export default function Nueva() {
  const router = useRouter();

  const handleSuccess = (mensajeExito) => {
    router.replace({
      pathname: "/(drawer)/(tabs)/siembra",
      params: { mensajeExito },
    });
  };

  return <NuevaSiembraScreen onSuccess={handleSuccess} />;
}