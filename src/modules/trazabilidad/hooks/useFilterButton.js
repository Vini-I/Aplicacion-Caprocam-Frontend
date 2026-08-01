/**
 * HOOK useFilterButton
 * Administra el estado modal y la selección de filtros por finca, estanque, colaborador y fecha.
 * @dependencies obtenerEstanquesPorFinca (TrazabilidadServices)
 * @validations Mantiene sincronizada la lista de estanques segun las fincas seleccionadas en el filtro.
 * @navigation N/A
 */
import { useEffect, useState } from "react";
import { obtenerEstanquesPorFinca } from "../services/TrazabilidadServices";

export function useFilterButton({ activeFilters, onApply }) {
  const [modalVisible, setModalVisible] = useState(false);

  const [pendingFincas, setPendingFincas] = useState([]);
  const [pendingEstanques, setPendingEstanques] = useState([]);
  const [pendingColaboradores, setPendingColaboradores] = useState([]);
  const [pendingFecha, setPendingFecha] = useState("");

  const activeCount =
    (activeFilters.fincas?.length || 0) +
    (activeFilters.estanques?.length || 0) +
    (activeFilters.colaboradores?.length || 0) +
    (activeFilters.fecha ? 1 : 0);
  const [estanquesDisponibles, setEstanquesDisponibles] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadEstanques() {
      const listas = await Promise.all(
        pendingFincas.map((fincaId) => obtenerEstanquesPorFinca(fincaId).catch(() => [])),
      );

      if (!mounted) return;

      const vistos = new Set();
      const resultado = [];

      listas.flat().forEach((estanque) => {
        if (!vistos.has(estanque.value)) {
          vistos.add(estanque.value);
          resultado.push(estanque);
        }
      });

      setEstanquesDisponibles(resultado);
    }

    loadEstanques();

    return () => {
      mounted = false;
    };
  }, [pendingFincas]);

  function abrirModal() {
    setPendingFincas([...(activeFilters.fincas || [])]);
    setPendingEstanques([...(activeFilters.estanques || [])]);
    setPendingColaboradores([...(activeFilters.colaboradores || [])]);
    setPendingFecha(activeFilters.fecha || "");
    setModalVisible(true);
  }

  function cerrarModal() {
    setModalVisible(false);
  }

  function toggleFinca(value) {
    const next = pendingFincas.includes(value)
      ? pendingFincas.filter((item) => item !== value)
      : [...pendingFincas, value];

    setPendingFincas(next);

    // Si se deselecciona una finca, se descartan del filtro los
    // estanques que ya no pertenecen a ninguna finca seleccionada.
    Promise.all(next.map((fincaId) => obtenerEstanquesPorFinca(fincaId).catch(() => [])))
      .then((listas) => {
        const estanquesValidos = listas.flatMap((lista) => lista.map((estanque) => estanque.value));
        setPendingEstanques((prevEstanques) => prevEstanques.filter((valor) => estanquesValidos.includes(valor)));
      })
      .catch(() => {});
  }

  function toggleEstanque(value) {
    setPendingEstanques((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  }

  function toggleColaborador(value) {
    setPendingColaboradores((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  }

  function limpiarFiltros() {
    setPendingFincas([]);
    setPendingEstanques([]);
    setPendingColaboradores([]);
    setPendingFecha("");
  }

  function aplicarFiltros() {
    if (onApply) {
      onApply({
        fincas: pendingFincas,
        estanques: pendingEstanques,
        colaboradores: pendingColaboradores,
        fecha: pendingFecha,
      });
    }
    cerrarModal();
  }

  return {
    modalVisible,
    pendingFincas,
    pendingEstanques,
    pendingColaboradores,
    pendingFecha,
    estanquesDisponibles,
    activeCount,
    setPendingFecha,
    abrirModal,
    cerrarModal,
    toggleFinca,
    toggleEstanque,
    toggleColaborador,
    limpiarFiltros,
    aplicarFiltros,
  };
}