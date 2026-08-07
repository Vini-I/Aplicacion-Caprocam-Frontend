/**
 * ProveedorContext.js
 * Contexto global para la gestión de proveedores.
 *
 * FUNCIONALIDAD:
 * - Almacena el estado global y lista de proveedores cargados.
 * - Provee métodos CRUD (crear, buscar, editar, eliminar, cargar).
 * - Maneja estados de carga (loading) para feedback de la UI.
 * - Mantiene el estado de "alert" para mostrar mensajes de éxito.
 *
 * REGLAS IMPORTANTES:
 * - Gestiona alertas globales tras acciones exitosas como creación.
 * - Atrapa errores del servicio y los lanza hacia los hooks locales.
 * - Sigue el estándar de arquitectura estricta (Provider pattern).
 *
 * @dependencies - React, ErrorContext, proveedor.service
 * @validations - N/A
 * @navigation - N/A
 */

import { createContext, useContext, useEffect, useState } from "react";
import { useError } from "../../../shared/context/ErrorContext.js";
import {
  getProveedores,
  getProveedorById,
  createProveedor as apiCreateProveedor,
  updateProveedor,
  eliminarProveedor as apiEliminarProveedor,
} from "../services/proveedor.service.js";

const ProveedorContext = createContext();

export function ProveedorProvider({ children }) {
  const [proveedores, setProveedores] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mostrarError } = useError();

  async function cargarProveedores() {
    try {
      setLoading(true);
      const data = await getProveedores();
      setProveedores(data);
    } catch (error) {
      mostrarError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarProveedores();
  }, []);

  async function buscarProveedor(id) {
    try {
      const data = await getProveedorById(id);
      return data;
    } catch (error) {
      mostrarError(error);
      throw error;
    }
  }

  async function crearProveedor(nuevoProveedor) {
    await apiCreateProveedor(nuevoProveedor);
    await cargarProveedores();
    setAlert("created");
  }

  async function editarProveedor(id, datosActualizados) {
    await updateProveedor(id, datosActualizados);
    await cargarProveedores();
    setAlert("edited");
  }

  async function eliminarProveedor(id) {
    try {
      await apiEliminarProveedor(id);
      await cargarProveedores();
      setAlert("deleted");
    } catch (error) {
      mostrarError(error);
    }
  }

  function limpiarAlert() {
    setAlert(null);
  }

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      limpiarAlert();
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <ProveedorContext.Provider
      value={{
        // Estado
        proveedores,
        alert,
        loading,

        // Acciones CRUD
        cargarProveedores,
        buscarProveedor,
        crearProveedor,
        editarProveedor,
        eliminarProveedor,

        // Alert
        setAlert,
        limpiarAlert,
      }}
    >
      {children}
    </ProveedorContext.Provider>
  );
}

export function useProveedor() {
  const context = useContext(ProveedorContext);

  if (!context) {
    throw new Error("useProveedor debe usarse dentro de un ProveedorProvider");
  }

  return context;
}
