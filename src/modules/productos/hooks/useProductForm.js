/**
 * ============================================================
 * HOOK: USEPRODUCTFORM
 * ============================================================
 * Módulo: Productos
 *
 * Maneja el estado y la lógica del formulario de alta/edición
 * de producto.
 *
 * FUNCIONALIDAD:
 * 1. Carga los datos del producto cuando llega productoParam
 *    (modo edición); si no llega, arranca en modo creación.
 * 2. Recalcula la lista de proveedores disponibles cada vez que
 *    cambia la categoría, y limpia el proveedor si ya no aplica.
 * 3. Valida los campos obligatorios (nombre, categoría, cantidad,
 *    stock mínimo, precio) solo después de presionar Guardar
 *    (intentoGuardar), mostrando un mensaje general y marcando
 *    cada campo inválido por separado (errorNombre, errorCategoria,
 *    errorCantidad, errorStockMinimo, errorPrecio).
 * 4. En modo edición, además exige que haya cambios reales
 *    respecto al producto original antes de permitir guardar.
 * 5. Guarda el producto (crear o actualizar) y navega de vuelta.
 *
 * IMPORTANTE:
 * - En modo creación el botón de guardar NO se bloquea de
 *   entrada: el usuario puede presionar y ver qué campo falta.
 * - En modo edición sí se bloquea mientras no haya cambios.
 * ============================================================
 */


import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import { addProducto, updateProducto } from "../../inventarios/services/InventarioService";
import { getProveedoresByCategoria } from "../../proveedores/services/ProveedorData";
import { initialForm } from "../services/DataProductForm";


// ─────────────────────────────────────────────
// Hook principal del formulario
// ─────────────────────────────────────────────
export function useProductForm() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [form, setForm] = useState(initialForm);
  const [originalForm, setOriginalForm] = useState(initialForm);
  const [intentoGuardar, setIntentoGuardar] = useState(false);
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

  const validationMessage = !intentoGuardar ? "" : !hasRequiredData ? "Revisa los campos obligatorios marcados con * antes de guardar."
     : isEditMode && !hasChanges ? "Realice algún cambio para guardar la actualización." : "";
 
  const errorNombre = intentoGuardar && form.nombre.trim() === "";
  const errorCategoria = intentoGuardar && form.categoria === "";
  const errorCantidad = intentoGuardar && form.cantidad === "";
  const errorStockMinimo = intentoGuardar && form.stockMinimo === "";
  const errorPrecio = intentoGuardar && form.precioUnidad === "";
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
    setIntentoGuardar(true);

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
      router.replace("/(drawer)/inventarios");//000000000000000000000000000000000000000000000000000
    }
  }

  function handleBack() {
    if (isEditMode) {
      router.replace({
        pathname: "/(drawer)/inventarios/detalleProducto",
        params: { id: productoId.toString() },
      });
    } else {
      router.replace("/(drawer)/inventarios");//00000000000000000000000000000000000000000000000
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
    errorNombre,
    errorCategoria,
    errorCantidad,
    errorStockMinimo,
    errorPrecio,
    handleField,
    handleCategoriaChange,
    handleSubmit,
    handleBack,
  };
}
