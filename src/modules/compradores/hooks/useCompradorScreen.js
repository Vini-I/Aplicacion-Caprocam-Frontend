import { useState } from "react";
import { useRouter } from "expo-router";
import { compradoresMock } from "../services/CompradorData";

export function useCompradorScreen() {
  const router = useRouter();

  const [compradores] = useState(compradoresMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });

  // Extrae los tipos únicos de producto para mostrarlos como opciones de filtro
  const TIPOS = [...new Set(compradores.map((c) => c.tipoProducto))];

  // Filtra los compradores según el texto ingresado y los tipos seleccionados
  const compradoresFiltrados = compradores.filter((c) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      c.nombre.toLowerCase().includes(texto) ||
      c.tipoProducto.toLowerCase().includes(texto) ||
      c.telefono.toLowerCase().includes(texto) ||
      c.correo.toLowerCase().includes(texto);
    const coincideTipo =
      filtros.tipos.length === 0 || filtros.tipos.includes(c.tipoProducto);
    return coincideTexto && coincideTipo;
  });

  // Navega a la pantalla de detalle pasando el id del comprador como parámetro
  function handleVerDetalle(compradorId) {
    router.push({
      pathname: "/(drawer)/compradores/detalleComprador",
      params: { id: compradorId.toString() },
    });
  }

  function handleAgregar() {
    router.push("/(drawer)/compradores/nuevoComprador");
  }

  function handleHome() {
    router.replace("/inicio");
  }

  return {
    compradoresFiltrados,
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    TIPOS,
    handleVerDetalle,
    handleAgregar,
    handleHome,
  };
}
