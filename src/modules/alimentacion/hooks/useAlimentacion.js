/**
 * ============================================================
 * HOOK USEALIMENTACION
 * ============================================================
 *
 * Maneja el fetch y el estado de los registros de alimentación
 * ya guardados. No contiene ninguna lógica de UI ni de
 * validación de formularios: solo carga/recarga datos.
 *
 * IMPORTANTE: Alimentacion.service.js es un passthrough puro (solo
 * llama a axios, no mapea nombres de campo). El backend devuelve
 * cada registro con idFinca/idEstanque (no finca/estanque), pero
 * AlimentacionList.jsx y GestionAlimentacion.jsx leen
 * item.finca/item.estanque. Por eso este hook agrega esos alias
 * (sin quitar idFinca/idEstanque) antes de guardar el estado, para
 * no tener que tocar esos componentes.
 *
 * Estado que maneja:
 * - alimentaciones: lista de registros obtenidos del service, con
 *   alias finca/estanque agregados.
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

function conAliasFincaEstanque(registro) {
    if (!registro) return registro;
    return {
        ...registro,
        finca: registro.idFinca,
        estanque: registro.idEstanque,
    };
}

const useAlimentacion = () => {
    const [alimentaciones, setAlimentaciones] = useState([]);
    const [loading, setLoading]               = useState(false);
    const [error, setError]                   = useState(null);

    const recargar = async () => {
        setLoading(true);
        setError(null);
        try {
            const datos = await alimentacionService.getAll();
            setAlimentaciones((datos || []).map(conAliasFincaEstanque));
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