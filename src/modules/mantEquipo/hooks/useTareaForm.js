/**
 * ============================================================
 * HOOK: useTareaForm
 * ============================================================
 *
 * Responsabilidad:
 * Manejar el estado, validaciones y envío del formulario de tareas.
 *
 * Funcionalidad:
 * - Recibe un id de tarea para edición (desde parámetros de ruta).
 * - Carga los datos de la tarea si es edición.
 * - Mantiene estado de los campos, productos seleccionados, errores y submitted.
 * - Permite agregar/eliminar productos de la lista.
 * - Valida campos obligatorios (nombre, descripción, categoría, duración).
 * - Guarda la tarea (crear o actualizar) y navega de vuelta a la lista.
 *
 * Datos:
 * - id: string | undefined (id de la tarea a editar, opcional)
 *
 * Validaciones:
 * - Nombre: obligatorio, mínimo 3 caracteres.
 * - Descripción: obligatoria, mínimo 5 caracteres.
 * - Categoría: obligatoria.
 * - Duración: obligatoria, mayor a 0.
 *
 * Navegación:
 * - Al guardar exitosamente, navega a la lista de tareas ('/equipos/tareas').
 * - Al cancelar, navega a la lista de tareas.
 *
 * Dependencias:
 * - tareasService (obtenerTareaPorId, crearTarea, actualizarTarea)
 * - useRouter, useLocalSearchParams de expo-router
 * - getProductosInventario de InventarioService
 */

import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as tareasService from '../services/tareasService';
import { getProductosInventario } from '../../inventarios/services/InventarioService';

export function useTareaForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [duracion, setDuracion] = useState('');
  const [estado, setEstado] = useState('no_iniciada');
  const [productos, setProductos] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadProducto, setCantidadProducto] = useState('');
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(isEditing);

  const productosDisponibles = getProductosInventario();

  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing) {
      const cargarTarea = async () => {
        try {
          const tarea = await tareasService.obtenerTareaPorId(id);
          setNombre(tarea.nombre || '');
          setDescripcion(tarea.descripcion || '');
          setCategoria(tarea.categoria || '');
          setDuracion(String(tarea.duracionEstimada || ''));
          setEstado(tarea.estado || 'no_iniciada');
          setProductos(tarea.productos || []);
        } catch (error) {
          console.error('Error al cargar tarea:', error);
        } finally {
          setCargandoDatos(false);
        }
      };
      cargarTarea();
    }
  }, [isEditing, id]);

  // Handlers para campos simples
  const handleChange = (campo, valor) => {
    switch (campo) {
      case 'nombre': setNombre(valor); break;
      case 'descripcion': setDescripcion(valor); break;
      case 'categoria': setCategoria(valor); break;
      case 'duracion': setDuracion(valor); break;
      case 'estado': setEstado(valor); break;
      default: break;
    }
    // Limpiar error del campo si existe
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: undefined }));
    }
  };

  // Manejo de productos
  const handleBusquedaProducto = (text) => setBusquedaProducto(text);

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCantidadProducto('1');
  };

  const handleCantidadProducto = (text) => setCantidadProducto(text);

  const agregarProducto = () => {
    if (!productoSeleccionado) return;
    const cantidadNum = Number(cantidadProducto);
    if (!cantidadProducto || isNaN(cantidadNum) || cantidadNum <= 0) return;

    setProductos(prev => {
      const existe = prev.some(p => p.productoId === productoSeleccionado.id);
      if (existe) {
        return prev.map(p =>
          p.productoId === productoSeleccionado.id
            ? { ...p, cantidad: p.cantidad + cantidadNum }
            : p
        );
      }
      return [...prev, { productoId: productoSeleccionado.id, cantidad: cantidadNum }];
    });

    // Limpiar selección
    setProductoSeleccionado(null);
    setCantidadProducto('');
    setBusquedaProducto('');
  };

  const eliminarProducto = (productoId) => {
    setProductos(prev => prev.filter(p => p.productoId !== productoId));
  };

  // Validación
  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = 'El nombre es requerido';
    if (!descripcion.trim()) e.descripcion = 'La descripción es requerida';
    if (!categoria) e.categoria = 'Debe seleccionar una categoría';
    const duracionNum = Number(duracion);
    if (!duracion.trim() || isNaN(duracionNum) || duracionNum <= 0) {
      e.duracion = 'Debe ingresar una duración válida (mayor a 0)';
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  // Guardar
  const guardar = async () => {
    setSubmitted(true);
    if (!validar()) return;

    setLoading(true);
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
      } else {
        await tareasService.crearTarea(datos);
      }

      // Éxito: navegar de vuelta
router.back();
    } catch (error) {
      setErrores({ general: error.message || 'Ocurrió un error al guardar la tarea.' });
    } finally {
      setLoading(false);
    }
  };

  const cancelar = () => {
router.back();
  };

  // Filtrado de productos para búsqueda
  const productosFiltrados = productosDisponibles.filter(p =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase().trim())
  );

  return {
    // Estado
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
    productosDisponibles,
    productosFiltrados,

    // Handlers
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