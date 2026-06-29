import { useState } from "react";
import { generarRegistroPDF } from "../services/fincaPDF";

export const usePdf = () => {
  const [loading, setLoading] = useState(false);

  const crearPDFFinca = async (finca, estanquesFinca = []) => {
    try {
      setLoading(true);
      await generarRegistroPDF(finca, estanquesFinca);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    crearPDFFinca,
    loading,
  };
};