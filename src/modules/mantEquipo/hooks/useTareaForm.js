/**
 * HOOK: useTareaForm
 * Maneja el estado, precarga, validaciones y envío del formulario de creación y edición de tareas.
 *
 * @dependencies - tareasService.js (services/tareasService.js), expo-router (useRouter, useLocalSearchParams)
 * @validations  - Valida que nombre, descripción, categoría y duración estimada sean obligatorios.
 * @navigation   - Navega a la lista de tareas ('/equipos/tareas') al guardar o cancelar.
 */

// src/modules/mantEquipo/hooks/useTareaForm.js

import { useState, useEffect, useMemo } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as tareasService from "../services/tareasService";
import { getProductosInventario } from "../../inventarios/services/InventarioService";

export function useTareaForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [duracion, setDuracion] = useState("");
  const [estado, setEstado] = useState("no_iniciada");
  const [productos, setProductos] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadProducto, setCantidadProducto] = useState("");
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(isEditing);
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  // Estados para mensajes de feedback
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ─── Limpiar mensajes automáticamente ──────────────────────────
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // ─── Cargar productos del inventario ──────────────────────────
  useEffect(() => {
    let isMounted = true;
    getProductosInventario()
      .then((data) => {
        if (isMounted) {
          setProductosDisponibles(Array.isArray(data) ? data : []);
        }
      })
      .catch((error) => {
        console.error("Error al cargar productos de inventario:", error);
        if (isMounted) {
          setProductosDisponibles([]);
        }
      });
    return () => { isMounted = false; };
  }, []);

  // ─── Cargar datos si es edición ──────────────────────────────
  useEffect(() => {
    if (isEditing) {
      const cargarTarea = async () => {
        try {
          const tarea = await tareasService.obtenerTareaPorId(id);
          setNombre(tarea.nombre || "");
          setDescripcion(tarea.descripcion || "");
          setCategoria(tarea.categoria || "");
          setDuracion(String(tarea.duracionEstimada || ""));
          setEstado(tarea.estado || "no_iniciada");
          setProductos(tarea.productos || []);
        } catch (error) {
          console.error("Error al cargar tarea:", error);
        } finally {
          setCargandoDatos(false);
        }
      };
      cargarTarea();
    }
  }, [isEditing, id]);

  // ─── FILTRADO DE PRODUCTOS (con fallback por si productosDisponibles no es array) ──
  const productosFiltrados = useMemo(() => {
    // Asegurar que productosDisponibles sea siempre un array
    const disponibles = Array.isArray(productosDisponibles) ? productosDisponibles : [];
    const busqueda = busquedaProducto.trim().toLowerCase();
    if (!busqueda) return disponibles;
    return disponibles.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda)
    );
  }, [productosDisponibles, busquedaProducto]);

  // ─── OPCIONES PARA EL SELECT (con fallback adicional) ────────
  const opcionesProductos = useMemo(() => {
    // Asegurar que productosFiltrados sea siempre un array
    const filtrados = Array.isArray(productosFiltrados) ? productosFiltrados : [];
    return filtrados.map((p) => ({
      label: `${p.nombre} (${p.unidad}) - Stock: ${p.cantidad}`,
      value: p.id,
    }));
  }, [productosFiltrados]);

  const hayResultados = opcionesProductos.length > 0;

  // ─── HANDLERS ──────────────────────────────────────────────────
  const handleChange = (campo, valor) => {
    switch (campo) {
      case "nombre":
        setNombre(valor);
        break;
      case "descripcion":
        setDescripcion(valor);
        break;
      case "categoria":
        setCategoria(valor);
        break;
      case "duracion":
        setDuracion(valor);
        break;
      case "estado":
        setEstado(valor);
        break;
      default:
        break;
    }
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  const handleBusquedaProducto = (text) => setBusquedaProducto(text);

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    if (producto) setCantidadProducto("1");
  };

  const handleCantidadProducto = (text) => setCantidadProducto(text);

  const agregarProducto = () => {
    if (!productoSeleccionado) return;
    const cantidadNum = Number(cantidadProducto);
    if (!cantidadProducto || isNaN(cantidadNum) || cantidadNum <= 0) return;

    setProductos((prev) => {
      const existe = prev.some((p) => p.productoId === productoSeleccionado.id);
      if (existe) {
        return prev.map((p) =>
          p.productoId === productoSeleccionado.id
            ? { ...p, cantidad: p.cantidad + cantidadNum }
            : p
        );
      }
      return [...prev, { productoId: productoSeleccionado.id, cantidad: cantidadNum }];
    });

    setProductoSeleccionado(null);
    setCantidadProducto("");
    setBusquedaProducto("");
  };

  const eliminarProducto = (productoId) => {
    setProductos((prev) => prev.filter((p) => p.productoId !== productoId));
  };

  // ─── VALIDACIÓN ─────────────────────────────────────────────────
  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es requerido";
    if (!descripcion.trim()) e.descripcion = "La descripción es requerida";
    if (!categoria) e.categoria = "Debe seleccionar una categoría";
    const duracionNum = Number(duracion);
    if (!duracion.trim() || isNaN(duracionNum) || duracionNum <= 0) {
      e.duracion = "Debe ingresar una duración válida (mayor a 0)";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  // ─── RESET FORMULARIO ──────────────────────────────────────────
  const resetFormulario = () => {
    setNombre("");
    setDescripcion("");
    setCategoria("");
    setDuracion("");
    setEstado("no_iniciada");
    setProductos([]);
    setBusquedaProducto("");
    setProductoSeleccionado(null);
    setCantidadProducto("");
    setErrores({});
    setSubmitted(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  // ─── GUARDAR ────────────────────────────────────────────────────
  const guardar = async () => {
    setSubmitted(true);
    if (!validar()) {
      setErrorMessage("Revisa los campos obligatorios marcados con *");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        categoria,
        duracionEstimada: Number(duracion),
        estado,
        productos,
      };

      if (isEditing) {
        await tareasService.actualizarTarea(id, datos);
        setSuccessMessage("Tarea actualizada correctamente.");
      } else {
        await tareasService.crearTarea(datos);
        setSuccessMessage("Tarea guardada correctamente.");
        // Limpiar formulario solo en creación
        resetFormulario();
        setSubmitted(false);
      }
    } catch (error) {
      setErrorMessage(error.message || "Ocurrió un error al guardar la tarea.");
    } finally {
      setLoading(false);
    }
  };

  // ─── CANCELAR ──────────────────────────────────────────────────
  const cancelar = () => {
    router.back();
  };

  // ─── RETORNO ──────────────────────────────────────────────────
  return {
    nombre,
    descripcion,
    categoria,
    duracion,
    estado,
    productos,
    busquedaProducto,
    productoSeleccionado,
    cantidadProducto,
    errores,
    submitted,
    loading,
    cargandoDatos,
    isEditing,
    productosFiltrados,
    opcionesProductos,
    hayResultados,
    successMessage,
    errorMessage,
    resetFormulario,
    handleChange,
    handleBusquedaProducto,
    seleccionarProducto,
    handleCantidadProducto,
    agregarProducto,
    eliminarProducto,
    guardar,
    cancelar,
  };
}