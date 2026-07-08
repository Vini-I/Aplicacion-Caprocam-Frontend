/**
 * ============================================================
 * HOOK USEALIMENTACION
 * ============================================================
 *
 * Maneja el fetch y el estado de los registros de alimentación
 * ya guardados. No contiene ninguna lógica de UI ni de
 * validación de formularios: solo carga/recarga datos.
 *
 * Estado que maneja:
 * - alimentaciones: lista de registros obtenidos del service.
 * - loading: true mientras se están cargando los datos.
 * - error: mensaje de error si la carga falla, si no null.
 *
 * Retorna:
 * - { alimentaciones, loading, error, recargar }
 *
 * Ejemplo:
 * const { alimentaciones, loading, error, recargar } = useAlimentacion();
 */

import { useState, useEffect } from "react";
import alimentacionService from "../services/Alimentacion.service";

const useAlimentacion = () => {
    const [alimentaciones, setAlimentaciones] = useState([]);
    const [loading, setLoading]               = useState(false);
    const [error, setError]                   = useState(null);

    const recargar = async () => {
        setLoading(true);
        setError(null);
        try {
            const datos = await alimentacionService.getAll();
            setAlimentaciones(datos);
        } catch {
            setError("No se pudieron cargar los registros.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { recargar(); }, []);

    return { alimentaciones, loading, error, recargar };
};

export default useAlimentacion;