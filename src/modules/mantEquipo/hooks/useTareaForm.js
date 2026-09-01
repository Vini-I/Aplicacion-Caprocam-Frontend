/**
 * HOOK: useTareaForm
 * Maneja el estado, precarga, validaciones y envío del formulario de creación y edición de tareas.
 *
 * @dependencies - tareasService.js (services/tareasService.js), expo-router (useRouter, useLocalSearchParams)
 * @validations  - Valida que nombre, descripción, categoría y duración estimada sean obligatorios.
 * @navigation   - Navega a la lista de tareas ('/equipos/tareas') al guardar o cancelar.
 */

// src/modules/mantEquipo/hooks/useTareaForm.js

import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as tareasService from "../services/tareasService";

export function useTareaForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [duracion, setDuracion] = useState("");
  const [errores, setErrores] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(isEditing);

  // Alert local para la pantalla (hook-local)
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = { current: null };
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, []);
  const showAlert = (type, message, ms = 4000) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setAlert({ type, message });
    alertTimeoutRef.current = setTimeout(() => setAlert(null), ms);
  };

  // Cargar datos si es edición
  useEffect(() => {
    if (isEditing) {
      const cargarTarea = async () => {
        try {
          const tarea = await tareasService.obtenerTareaPorId(id);
          setNombre(tarea.nombre || "");
          setDescripcion(tarea.descripcion || "");
          setCategoria(tarea.categoria || "");
          setDuracion(String(tarea.duracionEstimada || ""));
        } catch (error) {
          // Mostrar el mensaje tal como viene desde el servicio cuando sea posible
          const msg = error?.response?.data?.message || error?.message || String(error);
          showAlert('danger', msg);
        } finally {
          setCargandoDatos(false);
        }
      };
      cargarTarea();
    }
  }, [isEditing, id]);
  
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
      default:
        break;
    }
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

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

  const resetFormulario = () => {
    setNombre("");
    setDescripcion("");
    setCategoria("");
    setDuracion("");
    setErrores({});
    setSubmitted(false);
    setLoading(false);
  };

  const guardar = async () => {
    setSubmitted(true);
    if (!validar()) {
      showAlert('danger', 'Revisa los campos obligatorios marcados con *');
      return;
    }

    setLoading(true);
    try {
      const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        categoria,
        duracionEstimada: Number(duracion),
      };

      if (isEditing) {
        await tareasService.actualizarTarea(id, datos);
        showAlert('success', 'Tarea editada correctamente');
        router.back();
      } else {
        await tareasService.crearTarea(datos);
        showAlert('success', 'Tarea registrada correctamente');
        router.back();
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || String(error);
      showAlert('danger', msg);
    } finally {
      setLoading(false);
    }
  };

  const cancelar = () => {
    router.back();
  };

  return {
    nombre,
    descripcion,
    categoria,
    duracion,
    errores,
    submitted,
    loading,
    cargandoDatos,
    isEditing,
    alert,
    showAlert,
    handleChange,
    guardar,
    cancelar,
  };
}