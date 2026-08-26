/**
 * ============================================================
 * CONTEXTO DE ESTANQUES
 * ============================================================
 *
 * Maneja los estanques de forma global, igual que FincaContext.
 *
 * Funcionalidad:
 * - Lista estanques.
 * - Permite crear estanques.
 * - Permite editar estanques.
 * - Permite eliminar estanques.
 * - Refresca las pantallas que usan el contexto.
 */

import { createContext, useContext, useEffect, useState } from "react";

import { estanqueService } from "../services/estanque.service.js";
import { useError } from "../../../shared/context/ErrorContext.js";

const EstanqueContext = createContext();

export function EstanqueProvider({ children }) {
  const [estanques, setEstanques] = useState([]);
  const [alert, setAlert] = useState(null);
  const { mostrarError } = useError();
  const [loading, setLoading] = useState(true);

  async function cargarEstanques() {
    try {
      setLoading(true);
      const data = await estanqueService.getEstanques();
      setEstanques(data);
    } catch (error) {
      mostrarError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarEstanques();
  }, []);

  async function buscarEstanque(id) {
    try {
      const data = await estanqueService.getEstanqueById(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function crearEstanque(nuevoEstanque) {
    try {
      await estanqueService.createEstanque(nuevoEstanque);
      await cargarEstanques();
      setAlert("created");
    } catch (error) {
      throw error;
    }
    
  }

  async function editarEstanque(codigo, datosActualizados) {
    try{
    await estanqueService.actualizarEstanque(codigo, datosActualizados);
    await cargarEstanques();
    setAlert("edited");
    } catch (error) {
      throw error;
    }
  }

  async function eliminarEstanque(id) {
    try{
    await estanqueService.eliminarEstanque(id);
    await cargarEstanques();
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
    <EstanqueContext.Provider
      value={{
        // Estado
        estanques,
        alert,
        loading,  

        // Acciones CRUD
        cargarEstanques,
        buscarEstanque,
        crearEstanque,
        editarEstanque,
        eliminarEstanque,

        // Alert  
        setAlert,
        limpiarAlert,
      }}
    >
      {children}
    </EstanqueContext.Provider>
  );
}

export function useEstanque(){

  const context = useContext(EstanqueContext);

  if(!context){
    throw new Error("useEstanque debe usarse dentro de un EstanqueProvider");
  }

  return context;

}