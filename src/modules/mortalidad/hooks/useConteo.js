import { useState } from "react";

export const useConteo = () => {
  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);

  const handleFincaChange = (val) => {
    setFinca(val);
  };

  const handleEstanqueChange = (val) => {
    setEstanque(val);
  };

  return {
    finca,
    estanque,
    handleFincaChange,
    handleEstanqueChange
  };
};