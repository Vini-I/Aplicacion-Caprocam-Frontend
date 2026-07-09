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
import { fincas as fincasIniciales } from "../screens/FincaData.js";

const FincaContext = createContext();

export function FincaProvider({ children }) {
  const [fincas, setFincas] = useState(fincasIniciales);
  const [alert, setAlert] = useState(null);

  function crearFinca(nuevaFinca) {
    setFincas((prev) => [...prev, nuevaFinca]);
    setAlert("created");
  }

  function editarFinca(codigoInterno, datosActualizados) {
    setFincas((prev) =>
      prev.map((finca) =>
        finca.codigoInterno === codigoInterno
          ? { ...finca, ...datosActualizados }
          : finca,
      ),
    );

    setAlert("edited");
  }

  function eliminarFinca(codigoInterno) {
    setFincas((prev) =>
      prev.filter((finca) => finca.codigoInterno !== codigoInterno),
    );

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
    <FincaContext.Provider
      value={{
        // Estado
        fincas,
        alert,

        // Acciones CRUD
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
