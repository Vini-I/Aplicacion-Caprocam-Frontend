import { useState } from "react";

const mockData = [
  {
    id: "1",
    estanque: "Estanque A",
    cantidadKg: 25,
    metodo: "Plato",
  },
];

const useAlimentacion = () => {
  const [alimentaciones] = useState(mockData);

  return {
    alimentaciones,
  };
};

export default useAlimentacion;