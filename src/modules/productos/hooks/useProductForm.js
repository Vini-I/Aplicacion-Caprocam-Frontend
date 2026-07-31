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
 * 5. Guarda el producto (crear o actualizar), muestra una alerta de
 *    éxito (guardadoExitoso) y navega de vuelta poco después.
 *
 * IMPORTANTE:
 * - En modo creación el botón de guardar NO se bloquea de
 *   entrada: el usuario puede presionar y ver qué campo falta.
 * - En modo edición sí se bloquea mientras no haya cambios.
 * - La navegación posterior al guardado se retrasa ~900ms para que
 *   la alerta de éxito alcance a mostrarse antes de salir de la
 *   pantalla.
 * ============================================================
 */


import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

import { productoService } from "../services/producto.service";
import { getProveedores, filtrarProveedoresPorCategoria } from "../services/proveedoresLookup";
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
  const [proveedoresTodos, setProveedoresTodos] = useState([]);
  const [opcionesProveedores, setOpcionesProveedores] = useState([]);
  const [cargandoProveedores, setCargandoProveedores] = useState(true);
  const [errorProveedores, setErrorProveedores] = useState("");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState("");
  const [mostrarAlertaValidacion, setMostrarAlertaValidacion] = useState(false);

  // ── Carga los proveedores reales una sola vez (GET /proveedores) ──
  useEffect(() => {
    let activo = true;
    async function cargarProveedores() {
      setCargandoProveedores(true);
      setErrorProveedores("");
      try {
        const data = await getProveedores();
        if (activo) setProveedoresTodos(data || []);
      } catch (err) {
        if (activo) {
          setErrorProveedores(
            "No se pudieron cargar los proveedores. Verifica que el back tenga montada la ruta /proveedores."
          );
          setProveedoresTodos([]);
        }
      } finally {
        if (activo) setCargandoProveedores(false);
      }
    }
    cargarProveedores();
    return () => {
      activo = false;
    };
  }, []);

  
  useEffect(() => {
    const filtrados = filtrarProveedoresPorCategoria(proveedoresTodos, form.categoria);
    const lista = [
      // Siempre disponible, incluso si todavía no hay proveedores
      // dados de alta en el sistema -- así el formulario nunca queda
      // bloqueado por falta de proveedores. Al guardar, esta opción
      // manda proveedorId: null (ver handleSubmit).
      { label: "Sin proveedor asignado", value: "none" },
      ...filtrados.map((p) => ({
        label: p.nombre,
        value: String(p.id),
      })),
    ];
    setOpcionesProveedores(lista);

    // Si el proveedor seleccionado ya no pertenece a la lista, lo limpia
    if (form.proveedor && !lista.find((p) => p.value === form.proveedor)) {
      setForm((prev) => ({ ...prev, proveedor: "" }));
    }
  }, [form.categoria, proveedoresTodos]);

  // ── Carga datos si viene un producto para editar ──
  useEffect(() => {
    if (params?.productoParam) {
      try {
        const producto = JSON.parse(params.productoParam);

        const cargado = {
          codigo: producto.codigo ?? "", 
          nombre: producto.nombre ?? "",
          categoria: producto.categoria ?? "",
          // El producto que llega desde el detalle trae proveedorId
          // (id real) -- lo usamos como value del select. Si no tiene
          // proveedor asignado (null), preseleccionamos "none" para
          // que se vea "Sin proveedor asignado" en vez de quedar vacío.
          proveedor: producto.proveedorId !== null && producto.proveedorId !== undefined
            ? String(producto.proveedorId)
            : "none",
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
    form.codigo.trim() !== "" && 
    form.nombre.trim() !== "" &&
    form.categoria !== "" &&
    form.proveedor !== "" &&
    form.cantidad !== "" &&
    form.stockMinimo !== "" &&
    form.precioUnidad !== "";

  const canSave = isEditMode ? hasRequiredData && hasChanges : hasRequiredData;

 const validationMessage = !mostrarAlertaValidacion ? "" : !hasRequiredData ? "Revisa los campos obligatorios marcados con * antes de guardar."
    : isEditMode && !hasChanges ? "Realice algún cambio para guardar la actualización." : "";

  const errorNombre = intentoGuardar && form.nombre.trim() === "";
  const errorCodigo = intentoGuardar && form.codigo.trim() === "";
  const errorCategoria = intentoGuardar && form.categoria === "";
  const errorProveedor = intentoGuardar && form.proveedor === "";
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

  useEffect(() => {
    if (mostrarAlertaValidacion) {
      const t = setTimeout(() => setMostrarAlertaValidacion(false), 6000);
      return () => clearTimeout(t);
    }
  }, [mostrarAlertaValidacion]);

  useEffect(() => {
    if (errorGuardado) {
      const t = setTimeout(() => setErrorGuardado(""), 6000);
      return () => clearTimeout(t);
    }
  }, [errorGuardado]);

  async function handleSubmit() {
    setIntentoGuardar(true);

    if (!canSave) {
      setMostrarAlertaValidacion(true);
      return;
    }

    const producto = {
      codigo: form.codigo.trim(), 
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      // form.proveedor guarda el id real del proveedor elegido, o el
      // valor especial "none" si el usuario eligió explícitamente
      // "Sin proveedor asignado" (por ejemplo, porque todavía no hay
      // proveedores dados de alta). En ambos casos "sin proveedor"
      // se traduce a null.
      proveedorId: form.proveedor && form.proveedor !== "none" ? Number(form.proveedor) : null,
      cantidad: Number(form.cantidad),
      unidad: form.unidad,
      stockMinimo: Number(form.stockMinimo),
      precioUnidad: Number(form.precioUnidad),
      entryDate: form.entryDate,
      expirationDate: form.expirationDate,
    };
  
  
    setGuardando(true);
    setErrorGuardado("");
    try {
      if (isEditMode) {
        await productoService.actualizarProducto(productoId, producto);
      } else {
        await productoService.crearProducto(producto);
      }
    } catch (error) {
      setGuardando(false);
      setErrorGuardado("No se pudo guardar el producto. Intenta de nuevo.");
      return;
    }
    setGuardando(false);

    // Muestra la alerta de éxito antes de navegar, para que el usuario
    // tenga retroalimentación visual clara de que el guardado ocurrió.
    setGuardadoExitoso(true);

    setTimeout(() => {
      if (isEditMode) {
        router.replace({
          pathname: "/(drawer)/inventarios/detalleProducto",
          params: { id: productoId.toString() },
        });
      } else {
        router.replace("/(drawer)/inventarios");
      }
    }, 900);
  }

  function handleBack() {
    if (isEditMode) {
      router.replace({
        pathname: "/(drawer)/inventarios/detalleProducto",
        params: { id: productoId.toString() },
      });
    } else {
      router.replace("/(drawer)/inventarios");
    }
  }

  // ─────────────────────────────────────────────
  // Retorno del hook
  // ─────────────────────────────────────────────
  return {
    form,
    productoId,
    opcionesProveedores,
    cargandoProveedores,
    errorProveedores,
    isEditMode,
    canSave,
    validationMessage,
    showExpirationDate,
    errorCodigo,
    errorNombre,
    errorProveedor,
    errorCategoria,
    errorCantidad,
    errorStockMinimo,
    errorPrecio,
    guardadoExitoso,
    guardando,
    errorGuardado,
    handleField,
    handleCategoriaChange,
    handleSubmit,
    handleBack,
  };
}
