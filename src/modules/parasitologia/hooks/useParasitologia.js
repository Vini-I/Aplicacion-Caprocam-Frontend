/**
 * ============================================================
 * HOOK DE PARASITOLOGIA
 * ============================================================
 *
 * Centraliza el estado y las operaciones del backend
 * correspondientes al modulo de parasitologia.
 */

import { useEffect, useState } from "react";

import parasitologiaService from "../services/ParasitologiaService.js";

export default function useParasitologia() {
  const [catalogoParasitos, setCatalogoParasitos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function cargarCatalogo() {
    try {
      setLoading(true);
      const catalogo = await parasitologiaService.getCatalogo();
      setCatalogoParasitos(Array.isArray(catalogo) ? catalogo : []);
    } finally {
      setLoading(false);
    }
  }

  async function guardarRegistro(registro) {
    try {
      setLoading(true);
      return await parasitologiaService.create(registro);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarCatalogo().catch((error) => {
      console.error("[Parasitologia] Error al cargar catalogo:", error);
    });
  }, []);

  return {
    catalogoParasitos,
    loading,
    guardarRegistro,
  };
}