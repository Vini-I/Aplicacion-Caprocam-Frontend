import { useState, useCallback } from 'react';
import { FINCAS, ESTANQUES } from '../screens/RegistroData';

export default function useRegistro() {
  const [fincaSeleccionada, setFincaSeleccionada] = useState(FINCAS[0].id);
  const [estanqueSeleccionado, setEstanqueSeleccionado] = useState(
    ESTANQUES[FINCAS[0].id][0].id
  );
  const [moduloActivo, setModuloActivo] = useState(null);

  const estanques = ESTANQUES[fincaSeleccionada] ?? [];
  const finca = FINCAS.find((f) => f.id === fincaSeleccionada);
  const estanque = estanques.find((e) => e.id === estanqueSeleccionado);

  const handleFinca = useCallback((id) => {
    setFincaSeleccionada(id);
    setEstanqueSeleccionado(ESTANQUES[id][0].id);
  }, []);

  const abrirModulo = useCallback((moduloId) => setModuloActivo(moduloId), []);
  const cerrarModulo = useCallback(() => setModuloActivo(null), []);

  return {
    fincaSeleccionada,
    estanqueSeleccionado, setEstanqueSeleccionado,
    moduloActivo,
    estanques, finca, estanque,
    handleFinca,
    abrirModulo,
    cerrarModulo,
  };
}