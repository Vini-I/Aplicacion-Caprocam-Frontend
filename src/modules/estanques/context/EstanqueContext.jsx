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

import { estanques as estanquesIniciales } from "../../finca/screens/EstanqueData.js";

const EstanqueContext = createContext();

export function EstanqueProvider({ children }) {
  const [estanques, setEstanques] = useState(estanquesIniciales);
  const [alert, setAlert] = useState(null);

  function crearEstanque(nuevoEstanque) {
    setEstanques(function (prev) {
      return [...prev, nuevoEstanque];
    });

    setAlert("created");
  }

  function editarEstanque(codigo, datosActualizados) {
    setEstanques(function (prev) {
      return prev.map(function (estanque) {
        if (estanque.codigo === codigo) {
          return {
            ...estanque,
            ...datosActualizados,
          };
        }

        return estanque;
      });
    });

    setAlert("edited");
  }

  function eliminarEstanque(codigo) {
    setEstanques(function (prev) {
      return prev.filter(function (estanque) {
        return estanque.codigo !== codigo;
      });
    });

    setAlert("deleted");
  }

  function limpiarAlert() {
    setAlert(null);
  }

  useEffect(
    function () {
      let timer = null;

      if (alert) {
        timer = setTimeout(function () {
          limpiarAlert();
        }, 3000);
      }

      return function () {
        if (timer !== null) {
          clearTimeout(timer);
        }
      };
    },
    [alert],
  );

  return (
    <EstanqueContext.Provider
      value={{
        estanques,
        alert,
        crearEstanque,
        editarEstanque,
        eliminarEstanque,
        setAlert,
        limpiarAlert,
      }}
    >
      {children}
    </EstanqueContext.Provider>
  );
}

export function useEstanque() {
  const context = useContext(EstanqueContext);

  if (!context) {
    throw new Error("useEstanque debe usarse dentro de un EstanqueProvider");
  }

  return context;
}