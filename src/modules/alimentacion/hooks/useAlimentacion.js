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
 *
 * Cargar la lista es una acción FUERA de un formulario: si falla,
 * el error se muestra con el ModalError global vía
 * useError().mostrarError(), no con un estado local (ver
 * ErrorContext.js).
 *
 * Retorna:
 * - { alimentaciones, loading, recargar }
 *
 * Ejemplo:
 * const { alimentaciones, loading, recargar } = useAlimentacion();
 */

import { useState, useEffect } from "react";
import alimentacionService from "../services/Alimentacion.service";
import { useError } from "../../../shared/context/ErrorContext";

const useAlimentacion = () => {
    const [alimentaciones, setAlimentaciones] = useState([]);
    const [loading, setLoading]               = useState(false);
    const { mostrarError }                    = useError();

    const recargar = async () => {
        setLoading(true);
        try {
            const datos = await alimentacionService.getAll();
            setAlimentaciones(datos);
        } catch (error) {
            mostrarError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { recargar(); }, []);

    return { alimentaciones, loading, recargar };
};

export default useAlimentacion;