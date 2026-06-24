import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import { addProducto, updateProducto } from "../../inventarios/services/inventarioService";
import { getProveedoresByCategoria } from "../../proveedores/services/ProveedorData";

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

// ─────────────────────────────────────────────
// Hook principal del formulario
// ─────────────────────────────────────────────
export function useProductForm() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [form, setForm] = useState(initialForm);
  const [originalForm, setOriginalForm] = useState(initialForm);
  const [productoId, setProductoId] = useState(null);
  const [opcionesProveedores, setOpcionesProveedores] = useState([]);

  // ── Actualiza proveedores cuando cambia la categoría ──
  useEffect(() => {
    const lista = getProveedoresByCategoria(form.categoria).map((p) => ({
      label: p.nombre,
      value: p.nombre,
    }));
    setOpcionesProveedores(lista);

    // Si el proveedor seleccionado ya no pertenece a la lista, lo limpia
    if (form.proveedor && !lista.find((p) => p.value === form.proveedor)) {
      setForm((prev) => ({ ...prev, proveedor: "" }));
    }
  }, [form.categoria]);

  // ── Carga datos si viene un producto para editar ──
  useEffect(() => {
    if (params?.productoParam) {
      try {
        const producto = JSON.parse(params.productoParam);

        const cargado = {
          nombre: producto.nombre ?? "",
          categoria: producto.categoria ?? "",
          proveedor: producto.proveedor ?? "",
          cantidad: producto.cantidad !== undefined ? String(producto.cantidad) : "",
          unidad: producto.unidad ?? "kg",
          stockMinimo: producto.stockMinimo !== undefined ? String(producto.stockMinimo) : "",
          precioUnidad: producto.precioUnidad !== undefined ? String(producto.precioUnidad) : "",
          entryDate: producto.entryDate ?? "",
          expirationDate: producto.expirationDate ?? "",
        };

        setForm(cargado);
        setOriginalForm(cargado);
        setProductoId(producto.id);
      } catch {
        // param malformado → modo crear
        setForm(initialForm);
        setOriginalForm(initialForm);
        setProductoId(null);
      }
    } else {
      setForm(initialForm);
      setOriginalForm(initialForm);
      setProductoId(null);
    }
  }, [params?.productoParam]);

  // ─────────────────────────────────────────────
  // Derivados
  // ─────────────────────────────────────────────
  const isEditMode = productoId !== null;

  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

  const hasRequiredData =
    form.nombre.trim() !== "" &&
    form.categoria !== "" &&
    form.cantidad !== "" &&
    form.stockMinimo !== "" &&
    form.precioUnidad !== "";

  const canSave = isEditMode ? hasRequiredData && hasChanges : hasRequiredData;

  const validationMessage = !hasRequiredData
    ? "Complete los campos obligatorios para guardar."
    : isEditMode && !hasChanges
      ? "Realice algún cambio para guardar la actualización."
      : "";

  const showExpirationDate =
    form.categoria === "Alimentación" || form.categoria === "Tratamiento";

  // ─────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────
  function handleField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCategoriaChange(value) {
    const categoriasConCaducidad = ["Alimentación", "Tratamiento"];

    setForm((prev) => ({
      ...prev,
      categoria: value,
      // Si la nueva categoría no requiere fecha de caducidad, la limpia
      expirationDate: categoriasConCaducidad.includes(value) ? prev.expirationDate : "",
    }));
  }

  function handleSubmit() {
    if (!canSave) return;

    const producto = {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      proveedor: form.proveedor,
      cantidad: Number(form.cantidad),
      unidad: form.unidad,
      stockMinimo: Number(form.stockMinimo),
      precioUnidad: Number(form.precioUnidad),
      entryDate: form.entryDate,
      expirationDate: form.expirationDate,
    };

    if (isEditMode) {
      updateProducto({ ...producto, id: productoId });
      router.replace({
        pathname: "/(drawer)/inventarios/detalleProducto",
        params: { id: productoId.toString() },
      });
    } else {
      addProducto(producto);
      router.replace("/(drawer)/inventarios/inventarioScreen");
    }
  }

  function handleBack() {
    if (isEditMode) {
      router.replace({
        pathname: "/(drawer)/inventarios/detalleProducto",
        params: { id: productoId.toString() },
      });
    } else {
      router.replace("/(drawer)/inventarios/inventarioScreen");
    }
  }

  // ─────────────────────────────────────────────
  // Retorno del hook
  // ─────────────────────────────────────────────
  return {
    form,
    productoId,
    opcionesProveedores,
    isEditMode,
    canSave,
    validationMessage,
    showExpirationDate,
    handleField,
    handleCategoriaChange,
    handleSubmit,
    handleBack,
  };
}
