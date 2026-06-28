/**
 * ============================================================
 * RUTA PRINCIPAL DE REGISTROS
 * ============================================================
 *
 * Conecta RegistroScreen con las pantallas reales de cada modulo.
 */

import RegistroScreen from "../../../../modules/registro/screens/RegistroScreen";
import { useRouter } from "expo-router";

export default function RegistrosIndex() {
  const router = useRouter();

  const irAFisicoQuimica = () => {
    router.push("/(drawer)/(tabs)/registros/FisicoQuimica");
  };

  const irAAlimentacion = () => {
    router.push("/(drawer)/(tabs)/registros/Alimentacion");
  };

 const irADensidadPoblacional = () => {
    router.push("/(drawer)/(tabs)/registros/DensidadPoblacional");
  };

  const irACrecimiento = () => {
    router.push("/(drawer)/(tabs)/registros/Crecimiento");
  };

  const irAEnfermedades = () => {
    router.push("/(drawer)/(tabs)/registros/Enfermedades");
  };

  const irAParasitologia = () => {
    router.push("/(drawer)/(tabs)/registros/Parasitologia");
  };

  const irARaleo = () => {
    router.push("/(drawer)/(tabs)/registros/Raleo");
  };

  return (
    <RegistroScreen
      onFisicoQuimica={irAFisicoQuimica}
      onAlimentacion={irAAlimentacion}
       onDensidadPoblacional={irADensidadPoblacional}
      onCrecimiento={irACrecimiento}
      onEnfermedades={irAEnfermedades}
      onParasitologia={irAParasitologia}
      onRaleo={irARaleo}
    />
  );
}
