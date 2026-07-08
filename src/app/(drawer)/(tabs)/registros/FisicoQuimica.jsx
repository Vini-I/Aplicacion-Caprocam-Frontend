import { useRouter } from "expo-router";
import FisicoQuimicaScreen from "../../../../../src/modules/mantAgua/screens/FisicoQuimicaScreen";

export default function FisicoQuimica() {
  const router = useRouter();

  return (
    <FisicoQuimicaScreen
      onBack={() => router.replace("/(drawer)/(tabs)/registros")}
    />
  );
}