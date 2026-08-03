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
      mostrarError(error);
      throw error;
    }
  }

  async function crearEstanque(nuevoEstanque) {
    await estanqueService.createEstanque(nuevoEstanque);
    await cargarEstanques();
    setAlert("created");
  }

  async function editarEstanque(codigo, datosActualizados) {
    await estanqueService.actualizarEstanque(codigo, datosActualizados);
    await cargarEstanques();
    setAlert("edited");
  }

  async function eliminarEstanque(id) {
    await estanqueService.eliminarEstanque(id);
    await cargarEstanques();
    setAlert("deleted");
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