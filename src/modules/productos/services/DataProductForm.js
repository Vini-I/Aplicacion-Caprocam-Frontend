
// ─────────────────────────────────────────────
// Opciones de selects
// ─────────────────────────────────────────────
export const CATEGORIAS = [
  { label: "Alimentación", value: "Alimentación" },
  { label: "Tratamiento", value: "Tratamiento" },
  { label: "Químico", value: "Químico" },
  { label: "Fertilizante", value: "Fertilizante" },
  { label: "Antibiótico", value: "Antibiótico" },
  { label: "Probiótico", value: "Probiótico" },
];

export const UNIDADES = [
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
  { label: "litros", value: "litros" },
  { label: "mL", value: "mL" },
  { label: "unidades", value: "unidades" },
];

// ─────────────────────────────────────────────
// Estado inicial limpio
// ─────────────────────────────────────────────
export const initialForm = {
  nombre: "",
  categoria: "",
  proveedor: "",
  cantidad: "",
  unidad: "kg",
  stockMinimo: "",
  precioUnidad: "",
  entryDate: "",
  expirationDate: "",
};
