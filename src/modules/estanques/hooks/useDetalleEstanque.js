import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { estanqueService } from "../services/estanque.service";
import { useError } from "../../../shared/context/ErrorContext.js";

export default function useDetalleEstanque() {
  const { id, fincaNombre } = useLocalSearchParams();
  const { mostrarError } = useError();
  const [estanque, setEstanque] = useState();
  const [loading, setLoading] = useState(true);


  function primeraMayuscula(texto) {
    if (!texto) return "No registrado";

    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  useEffect(() => {

    const cargarEstanque = async () => {
      
      try {

        setLoading(true);

        const data = await estanqueService.getEstanqueById(id);

        setEstanque(data);

      } catch (error) {

        mostrarError(error);

      } finally {

        setLoading(false);

      }
    };

    if (id) {
      cargarEstanque();
    } else {
      setLoading(false);
    }
  }, [id]);

  function obtenerValorInfo(value) {
    let valorFinal = value;
    if (value === "" || value === undefined || value === null) {
      valorFinal = "No registrado";
    }
    return valorFinal;
  }


  function formatearListaEquipos(lista) {
  if (!lista || !Array.isArray(lista) || lista.length === 0) {
    return "Sin asignar";
  }
  return lista
    .map((item) => item.nombre || item.codigo || item.nombreEquipo || item.modelo || `Equipo #${item.id}`)
    .join(", ");
  }

  
  const equiposAireacion = formatearListaEquipos(estanque?.equipos?.aireacion);
  const equiposAlimentacion = formatearListaEquipos(estanque?.equipos?.alimentacion);
  const equiposBombeo = formatearListaEquipos(estanque?.equipos?.bombeo);
  const equiposMantenimiento = formatearListaEquipos(estanque?.equipos?.mantenimiento);
  const equiposMonitoreo = formatearListaEquipos(estanque?.equipos?.monitoreo);
  const equiposOtros = formatearListaEquipos(estanque?.equipos?.otros);

  return {
    estanque,
    loading,
    fincaNombre: fincaNombre || "Finca asociada",

    equiposAireacion,
    equiposAlimentacion,
    equiposBombeo,
    equiposMantenimiento,
    equiposMonitoreo,
    equiposOtros,

    primeraMayuscula,
  };
}
