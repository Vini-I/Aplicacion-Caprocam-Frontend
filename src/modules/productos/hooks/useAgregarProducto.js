/**
 * ============================================================
 * HOOK: USEAGREGARPRODUCTO
 * ============================================================
 * Módulo: Productos
 *
 * Maneja el estado y la lógica del formulario de ALTA de producto.
 * Es la mitad "crear" de lo que antes era useProductForm.js.
 *
 * FUNCIONALIDAD:
 * 1. Arranca siempre en formulario vacío (initialForm).
 * 2. Recalcula la lista de proveedores disponibles cada vez que
 *    cambia la categoría, y limpia el proveedor si ya no aplica.
 * 3. Valida los campos obligatorios (código, nombre, categoría,
 *    proveedor, cantidad, stock mínimo, precio) solo después de
 *    presionar Guardar (intentoGuardar), mostrando un mensaje
 *    general y marcando cada campo inválido por separado.
 * 4. Al guardar con éxito, YA NO navega al listado: muestra el
 *    alert de "guardado" por 3 segundos y luego limpia todo el
 *    formulario (campos y errores) para poder cargar otro producto
 *    sin salir de la pantalla.
 *
 * IMPORTANTE:
 * - El botón de guardar NO se bloquea de entrada: el usuario puede
 *   presionar y ver qué campo falta (igual que antes en modo
 *   creación dentro de useProductForm.js).
 * - La navegación posterior al guardado se retrasa ~900ms para que
 *   la alerta de éxito alcance a mostrarse antes de salir de la
 *   pantalla.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { productoService } from "../services/producto.service";
import { getProveedores, filtrarProveedoresPorCategoria } from "../services/proveedoresLookup";
import { initialForm } from "../services/DataProductForm";
import { useError } from "../../../shared/context/ErrorContext";

export function useAgregarProducto() {
  const router = useRouter();
  const { mostrarError } = useError();

  const [form, setForm] = useState(initialForm);
  const [intentoGuardar, setIntentoGuardar] = useState(false);
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

  // ─────────────────────────────────────────────
  // Derivados
  // ─────────────────────────────────────────────
  const hasRequiredData =
    form.codigo.trim() !== "" &&
    form.nombre.trim() !== "" &&
    form.categoria !== "" &&
    form.proveedor !== "" &&
    form.cantidad !== "" &&
    form.stockMinimo !== "" &&
    form.precioUnidad !== "";

  const canSave = hasRequiredData;

  const validationMessage = !mostrarAlertaValidacion
    ? ""
    : !hasRequiredData
    ? "Revisa los campos obligatorios marcados con * antes de guardar."
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
      await productoService.crearProducto(producto);
    } catch (error) {
      setGuardando(false);
      setErrorGuardado("No se pudo guardar el producto. Intenta de nuevo.");
      return;
    }
    setGuardando(false);

 
    setGuardadoExitoso(true);

    setTimeout(() => {
      setGuardadoExitoso(false);
      setForm(initialForm);
      setIntentoGuardar(false);
    }, 3000);
  }

  function handleBack() {
    router.replace("/(drawer)/inventarios");
  }

  // ─────────────────────────────────────────────
  // Retorno del hook
  // ─────────────────────────────────────────────
  return {
    form,
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
