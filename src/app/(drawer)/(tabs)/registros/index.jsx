/**
 * ============================================================
 * RUTA PRINCIPAL DE REGISTROS
 * ============================================================
 *
 * Conecta RegistroScreen con las pantallas reales de cada modulo.
 */

import { useState, useEffect } from "react";
import RegistroScreen from "../../../../modules/registro/screens/RegistroScreen";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function RegistrosIndex() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [visibleSuccessMessage, setVisibleSuccessMessage] = useState(params?.successMessage || "");

  useEffect(() => {
    if (params?.successMessage) {
      setVisibleSuccessMessage(params.successMessage);
      const timer = setTimeout(() => setVisibleSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [params?.successMessage]);

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

  const irAReporteria = () => {
    router.push("/(drawer)/(tabs)/registros/Reporteria");
  }

  return (
    <RegistroScreen
      successMessage={visibleSuccessMessage}
      onFisicoQuimica={irAFisicoQuimica}
      onAlimentacion={irAAlimentacion}
      onDensidadPoblacional={irADensidadPoblacional}
      onCrecimiento={irACrecimiento}
      onEnfermedades={irAEnfermedades}
      onParasitologia={irAParasitologia}
      onRaleo={irARaleo}
      onReporteria={irAReporteria}
    />
  );
}
