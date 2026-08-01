/**
 * ============================================================
 * HOOK: USEEDITARPRODUCTO
 * ============================================================
 * Módulo: Productos
 *
 * Maneja el estado y la lógica del formulario de EDICIÓN de
 * producto. Es la mitad "editar" de lo que antes era
 * useProductForm.js.
 *
 * FUNCIONALIDAD:
 * 1. Carga los datos del producto a partir de productoParam
 *    (enviado desde DetalleProductoScreen al presionar "Editar").
 * 2. Recalcula la lista de proveedores disponibles cada vez que
 *    cambia la categoría, y limpia el proveedor si ya no aplica.
 * 3. Valida los campos obligatorios solo después de presionar
 *    Guardar (intentoGuardar), mostrando un mensaje general y
 *    marcando cada campo inválido por separado.
 * 4. Exige que haya cambios reales respecto al producto original
 *    antes de permitir guardar (igual que antes en modo edición).
 * 5. Actualiza el producto, muestra una alerta de éxito
 *    (guardadoExitoso) y navega de vuelta al detalle poco después.
 *
 * IMPORTANTE:
 * - Esta pantalla se abre siempre con productoParam (desde el botón
 *   "Editar" del detalle). Si por algún motivo se abriera sin
 *   parámetro, el formulario no se bloquea/rompe: handleBack manda
 *   al listado y handleSubmit avisa con errorGuardado en vez de
 *   intentar actualizar un id inexistente (protección agregada al
 *   separar el hook, no existía como tal antes porque el mismo hook
 *   caía a modo creación).
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
import { useError } from "../../../shared/context/ErrorContext";

export function useEditarProducto() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { mostrarError } = useError();

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
          mostrarError(err);
        }
      } finally {
        if (activo) setCargandoProveedores(false);
      }
    }
    cargarProveedores();
    return () => {
      activo = false;
    };
  }, [mostrarError]);

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

  // ── Carga los datos del producto a editar ──
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
  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

  const hasRequiredData =
    form.codigo.trim() !== "" &&
    form.nombre.trim() !== "" &&
    form.categoria !== "" &&
    form.proveedor !== "" &&
    form.cantidad !== "" &&
    form.stockMinimo !== "" &&
    form.precioUnidad !== "";

  const canSave = hasRequiredData && hasChanges;

  const validationMessage = !mostrarAlertaValidacion
    ? ""
    : !hasRequiredData
    ? "Revisa los campos obligatorios marcados con * antes de guardar."
    : !hasChanges
    ? "Realice algún cambio para guardar la actualización."
    : "";

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

    if (!productoId) {
      setErrorGuardado("No se encontró el producto a editar. Vuelve a intentarlo desde el detalle.");
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
      await productoService.actualizarProducto(productoId, producto);
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
      router.replace({
        pathname: "/(drawer)/inventarios/detalleProducto",
        params: { id: productoId.toString() },
      });
    }, 900);
  }

  function handleBack() {
    if (productoId) {
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
