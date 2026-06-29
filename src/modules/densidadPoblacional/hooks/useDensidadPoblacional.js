import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";

export default function useDensidadPoblacional() {
  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [fecha, setFecha] = useState(new Date());
  const [showAlert, setShowAlert] = useState(false);

  const alertTimerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
      }
    };
  }, []);

  const handleGuardar = () => {
    setShowAlert(true);

    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
    }

    alertTimerRef.current = setTimeout(() => {
      setShowAlert(false);
      alertTimerRef.current = null;
      router.replace("/(drawer)/(tabs)/registros");
    }, 500);
  };

  const fincas = [
    { label: "Finca Norte", value: 1 },
    { label: "Finca Sur", value: 2 },
  ];

  const estanques = [
    { label: "Estanque A", value: 1 },
    { label: "Estanque B", value: 2 },
  ];

  return {
    finca,
    setFinca,
    estanque,
    setEstanque,
    fecha,
    setFecha,
    showAlert,
    handleGuardar,
    fincas,
    estanques,
  };
}