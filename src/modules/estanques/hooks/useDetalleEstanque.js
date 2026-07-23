import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { estanqueService } from "../services/estanque.service";

export default function useDetalleEstanque() {

  const { id } = useLocalSearchParams();

  const [estanque, setEstanque] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const cargarEstanque = async () => {
      
      try {

        setLoading(true);

        const data = await estanqueService.getEstanquesById(id);

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
    loading
  };
}