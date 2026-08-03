/**
 * ============================================================
 * CONTEXTO DE GESTIÓN DE FINCAS
 * ============================================================
 *
 * Administra la información de las fincas de forma global dentro
 * de la aplicación utilizando Context API, permitiendo compartir
 * y actualizar los datos entre las diferentes pantallas del módulo.
 *
 * Funcionalidad:
 * - Mantiene el listado de fincas disponible en la aplicación.
 * - Permite crear nuevas fincas.
 * - Permite editar la información de una finca existente.
 * - Permite eliminar fincas mediante su código interno.
 * - Gestiona alertas para indicar el resultado de las acciones.
 * - Limpia automáticamente las alertas después de un tiempo definido.
 */
import { createContext, useContext, useState, useEffect } from "react";
import { fincaService } from "../services/finca.service.js";
import { useError } from "../../../shared/context/ErrorContext.js";

const FincaContext = createContext();

export function FincaProvider({ children }) {
  const [fincas, setFincas] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mostrarError } = useError();
  const [ERROR, setERROR] = useState(null);

  async function cargarFincas() {
    try {
      setLoading(true);
      const data = await fincaService.getFincas();
      setFincas(data);
    } catch (error) {
      mostrarError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarFincas();
  }, []);

  async function buscarFinca(codigoCBO) {
    try {
      const data = await fincaService.getFincasById(codigoCBO);
      return data;
    } catch (error) {
      mostrarError(error);
    }
  }

  async function crearFinca(nuevaFinca) {
    try {
      await fincaService.createFincas(nuevaFinca);
      await cargarFincas();
      setAlert("created");
    } catch (error) {
      const msg = (error && error.message) || String(error);
      setERROR(msg);
      return;
    }
  }

  async function editarFinca(codigoCBO, datosActualizados) {
    try {
      await fincaService.updateFincas(datosActualizados, codigoCBO);
      await cargarFincas();
      setAlert("edited");
    } catch (error) {
      const msg = (error && error.message) || String(error);
      setERROR(msg);
      return;
    }
  }

  async function eliminarFinca(codigoCBO) {
    try {
      await fincaService.deleteFincas(codigoCBO);
      await cargarFincas();
    } catch (error) {
      mostrarError(error);
    }
    setAlert("deleted");
  }

  function limpiarAlert() {
    setAlert(null);
  }

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        limpiarAlert();
      }, 3000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [alert]);

  // Limpiar mensajes de error automáticamentemente después de mostrar
  useEffect(() => {
    if (!ERROR) return;

    const timer = setTimeout(() => {
      setERROR(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [ERROR]);

  return (
    <FincaContext.Provider
      value={{
        // Estado
        fincas,
        alert,
        loading,
        ERROR,  setERROR,

        // Acciones CRUD
        cargarFincas,
        buscarFinca,
        crearFinca,
        editarFinca,
        eliminarFinca,

        // Alert
        setAlert,
        limpiarAlert,
      }}
    >
      {children}
    </FincaContext.Provider>
  );
}

export function useFinca() {
  const context = useContext(FincaContext);

  if (!context) {
    throw new Error("useFincas debe usarse dentro de un FincaProvider");
  }

  return context;
}
