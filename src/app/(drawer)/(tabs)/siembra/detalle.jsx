import { useLocalSearchParams, useRouter } from "expo-router";
import DetalleSiembraScreen from "../../../../modules/siembra/screens/DetalleSiembraScreen";

export default function Detalle() {
  const { id, tipoRegistro: tipoRegistroParam, finalizar } = useLocalSearchParams();
  const router = useRouter();

  const handleEdit = (idToEdit, tipoRegistro, paramFinalizar) => {
    router.push({
      pathname: "/(drawer)/(tabs)/siembra/editar",
      params: { id: idToEdit, tipoRegistro, finalizar: paramFinalizar },
    });
  };

  const handleCrearSiembraDesdePrecria = (precriaId) => {
    router.push({
      pathname: "/(drawer)/(tabs)/siembra/nueva",
      params: { provieneDePrecriaId: precriaId },
    });
  };

  const handleFinalizarSiembra = (mensajeExito) => {
    router.replace({
      pathname: "/(drawer)/(tabs)/siembra",
      params: { mensajeExito },
    });
  };

  return (
    <DetalleSiembraScreen
      id={id}
      tipoRegistroParam={tipoRegistroParam}
      finalizar={finalizar}
      onEdit={handleEdit}
      onCrearSiembra={handleCrearSiembraDesdePrecria}
      onSuccessFinalizarSiembra={handleFinalizarSiembra}
    />
  );
}