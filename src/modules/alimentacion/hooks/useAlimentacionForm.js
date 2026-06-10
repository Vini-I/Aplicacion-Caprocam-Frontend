import { useState } from "react";

const initialState = {
  estanque: "",
  cantidadKg: "",
  metodo: "",
  observaciones: "",
};

const useAlimentacionForm = () => {
  const [form, setForm] = useState(initialState);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    form,
    updateField,
  };
};

export default useAlimentacionForm;