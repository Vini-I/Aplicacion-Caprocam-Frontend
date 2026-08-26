/**
 * =============================================================
 * HOOK DE ENFERMEDADES
 * =============================================================
 *
 * Centraliza el estado y las operaciones del backend
 * correspondientes al modulo de enfermedades.
 */

import { useEffect, useState } from "react";

import enfermedadesService from "../services/EnfermedadesService.js";
import { useError } from "../../../shared/context/ErrorContext.js";

export default function useEnfermedades() {
  const { mostrarError } = useError();

  const [catalogoEnfermedades, setCatalogoEnfermedades] = useState([]);
  const [catalogoSeveridades, setCatalogoSeveridades] = useState([]);
  const [loading, setLoading] = useState(false);

  async function cargarCatalogos() {
    try {
      setLoading(true);

      const [enfermedadesCatalogo, severidadesCatalogo] = await Promise.all([
        enfermedadesService.getCatalogo(),
        enfermedadesService.getCatalogoSeveridades(),
      ]);

      setCatalogoEnfermedades(
        Array.isArray(enfermedadesCatalogo) ? enfermedadesCatalogo : [],
      );

      setCatalogoSeveridades(
        Array.isArray(severidadesCatalogo) ? severidadesCatalogo : [],
      );
    } finally {
      setLoading(false);
    }
  }

  async function guardarEnfermedad(registro) {
    try {
      setLoading(true);

      return await enfermedadesService.create(registro);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarCatalogos().catch((error) => {
      mostrarError(error);
    });
  }, []);

  return {
    catalogoEnfermedades,
    catalogoSeveridades,
    loading,
    guardarEnfermedad,
  };
}