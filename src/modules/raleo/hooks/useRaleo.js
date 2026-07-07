import { useState } from "react";

const FORM_INICIAL = {
  fecha: "",
  finca: "",
  estanque: "",
  porcentajeRaleo: "",
  pesoPromedio: "",
  biomasaTotal: "",
  objetivo: "",
  metodo: "",
  responsable: "",
  observaciones: "",
};

export default function useRaleo() {
  const [form, setForm] = useState(FORM_INICIAL);

  function updateField(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function resetForm() {
    setForm(FORM_INICIAL);
  }

  return {
    form,
    updateField,
    resetForm,
  };
}
