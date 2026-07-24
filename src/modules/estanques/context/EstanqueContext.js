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

const EstanqueContext = createContext();

export function EstanqueProvider({ children }) {
  const [estanques, setEstanques] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  async function cargarEstanques() {
    try {

      setLoading(true);
      const data = await estanqueService.getEstanques();
      setEstanques(data);
    
    } catch (error) {
    
      console.error("Error cargando estanques:", error);
    
    } finally {
    
      setLoading(false);
    
    }
  }

  useEffect(() => {
  
    cargarEstanques();
  
  }, []);

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