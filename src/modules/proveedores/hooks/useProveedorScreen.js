import { useState } from "react";
import { proveedoresMock } from "../services/ProveedorData";

export function useProveedorScreen() {
  const [proveedores] = useState(proveedoresMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ tipos: [] });

  const TIPOS = [...new Set(proveedores.map((p) => p.tipoProducto))];

  const proveedoresFiltrados = proveedores.filter((p) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) ||
      p.tipoProducto.toLowerCase().includes(texto) ||
      p.telefono.toLowerCase().includes(texto) ||
      p.correo.toLowerCase().includes(texto);
    const coincideTipo =
      filtros.tipos.length === 0 || filtros.tipos.includes(p.tipoProducto);
    return coincideTexto && coincideTipo;
  });

  function handleAplicarFiltros(f) {
    setFiltros({ tipos: f.categories });
  }

  return {
    proveedoresFiltrados,
    busqueda,
    setBusqueda,
    filtros,
    TIPOS,
    handleAplicarFiltros,
  };
}
