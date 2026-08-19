import { useRouter } from "expo-router";
import SiembraListScreen from "../../../../modules/siembra/screens/SiembraListScreen";

export default function SiembraIndex() {
  const router = useRouter();

  const handleDetalleSiembra = (registro) => {
    router.push({
      pathname: "/(drawer)/(tabs)/siembra/detalle",
      params: { id: registro.id, tipoRegistro: registro.tipoRegistro },
    });
  };

  const handleNuevaSiembra = () => {
    router.push("/(drawer)/(tabs)/siembra/nueva");
  };

  return (
    <SiembraListScreen
      onDetail={handleDetalleSiembra}
      onNew={handleNuevaSiembra}
    />
  );
}