import { useState, useEffect } from "react";
import alimentacionService from "../services/alimentacion.service";

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