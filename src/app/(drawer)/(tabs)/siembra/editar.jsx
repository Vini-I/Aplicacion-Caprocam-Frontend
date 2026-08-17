import { useLocalSearchParams, useRouter } from "expo-router";
import EditarSiembraScreen from "../../../../modules/siembra/screens/EditarSiembraScreen";

export default function Editar() {
  const {
    id,
    tipoRegistro: tipoRegistroParam,
    finalizar,
  } = useLocalSearchParams();
  const router = useRouter();

  const handleGoBack = () => router.back();

  const handleSuccess = (mensajeExito) => {
    router.replace({
      pathname: "/(drawer)/(tabs)/siembra",
      params: { mensajeExito },
    });
  };

  const handleSuccessFinalizarPrecria = (precriaId) => {
    router.replace({
      pathname: "/(drawer)/(tabs)/siembra/nueva",
      params: { provieneDePrecriaId: precriaId },
    });
  };

  return (
    <EditarSiembraScreen
      id={id}
      tipoRegistroParam={tipoRegistroParam}
      finalizar={finalizar}
      onGoBack={handleGoBack}
      onSuccess={handleSuccess}
      onSuccessFinalizarPrecria={handleSuccessFinalizarPrecria}
    />
  );
}
