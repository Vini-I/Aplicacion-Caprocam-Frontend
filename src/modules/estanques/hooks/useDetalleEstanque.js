import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { estanqueService } from "../services/estanque.service";

export default function useDetalleEstanque() {

  const { id } = useLocalSearchParams();

  const [estanque, setEstanque] = useState(null);
  const [loading, setLoading] = useState(false);

  function primeraMayuscula(texto) {
    if (!texto) return "";

    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  useEffect(() => {

    const cargarEstanque = async () => {
      
      try {

        setLoading(true);

        const data = await estanqueService.getEstanqueById(id);

        setEstanque(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    if(id) {
      cargarEstanque();
    };

  }, [id]);

  return {
    estanque,
    loading,
    
    primeraMayuscula
  };
}