import { useMemo, useState } from "react";
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

  const estanquesDisponibles = useMemo(() => {
    const vistos = new Set();
    const resultado = [];

    pendingFincas.forEach((fincaId) => {
      obtenerEstanquesPorFinca(fincaId).forEach((estanque) => {
        if (!vistos.has(estanque.value)) {
          vistos.add(estanque.value);
          resultado.push(estanque);
        }
      });
    });

    return resultado;
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
    setPendingFincas((previous) => {
      const next = previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value];

      // Si se deselecciona una finca, se descartan del filtro los
      // estanques que ya no pertenecen a ninguna finca seleccionada.
      setPendingEstanques((prevEstanques) => {
        const estanquesValidos = next.flatMap((fincaId) =>
          obtenerEstanquesPorFinca(fincaId).map((estanque) => estanque.value),
        );
        return prevEstanques.filter((valor) => estanquesValidos.includes(valor));
      });

      return next;
    });
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