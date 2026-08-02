/**
 * HOOK: useWorkers
 * Obtiene la lista de trabajadores/colaboradores al montar el componente, gestionando estados de carga y errores.
 *
 * @dependencies - workerService.js (services/workerService.js)
 * @validations  - Ejecuta la petición una sola vez al montar (useEffect).
 * @navigation   - Ninguna
 */

import { useState, useEffect } from 'react';
import { getWorkers } from '../services/workerService';

/**
 * useWorkers()
 *
 * Hook que obtiene la lista de trabajadores cuando el
 * componente se monta.
 *
 * @returns {Object} Con propiedades:
 *   - workers: Array de trabajadores ([] inicialmente)
 *   - loading: boolean - true mientras se cargan datos
 *   - error: string|null - mensaje de error si ocurre uno
 *
 * DETALLES TECNICOS:
 * - useState() crea variables de estado (workers, loading, error)
 * - useEffect() ejecuta código cuando el componente se monta
 *   (segunda dependencia vacía [] = solo una vez)
 * - La función async dentro maneja la promesa de getWorkers()
 */
export const useWorkers = () => {
  // ESTADO: Variables que cambian y hacen re-render al actualizar
  const [workers, setWorkers] = useState([]);        // Lista de trabajadores
  const [loading, setLoading] = useState(true);      // ¿Está cargando?
  const [error, setError] = useState(null);          // Mensaje de error

  // EFECTO: Se ejecuta UNA SOLA VEZ cuando el componente se monta
  useEffect(() => {
    // Función async para obtener datos
    const fetchWorkers = async () => {
      try {
        // Llamar al servicio
        const data = await getWorkers();

        // Si llegamos aqui, todo fue bien
        setWorkers(data);       // Guardar los trabajadores
        setError(null);         // Limpiar error si habia uno
      } catch (err) {
        // Si hubo error, capturarlo aqui
        setError(err.message || 'Error al cargar trabajadores');
        setWorkers([]);         // Limpiar trabajadores
      } finally {
        // Siempre (error o no) dejar de cargar
        setLoading(false);
      }
    };

    // Ejecutar la función
    fetchWorkers();
  }, []); // Dependencias vacías = solo una vez al montar

  // Retornar objeto con los valores de estado
  return {
    workers,
    loading,
    error,
  };
};
