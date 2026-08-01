/**
 * ============================================================
 * HOOK USEFINCAESTANQUEALIMENTACION
 * ============================================================
 *
 * Carga las fincas y estanques reales desde el backend (MySQL)
 * para el módulo de Alimentación y los deja listos en formato
 * { label, value } para usarlos directamente en el componente
 * Select.
 *
 * Sigue EXACTAMENTE el mismo patrón que useFincaCrecimiento.js
 * (modules/mantCrecimiento/hooks/), y reemplaza al hook genérico
 * useCatalogos que usaba antes este módulo (importado, de forma
 * un poco confusa, desde modules/densidadPoblacional/hooks/).
 *
 * - Trae TODAS las fincas y TODOS los estanques una sola vez al
 *   montar (fincaService.getFincas() + estanqueService.getEstanques()
 *   SIN filtros), en vez de pedirle al backend "los estanques de
 *   la finca X" cada vez que el usuario cambia de finca.
 * - Filtra los estanques por finca en memoria (useMemo, JS puro),
 *   usando `estanque.idFinca === Number(idFincaSeleccionada)`. No
 *   dispara ninguna peticion nueva al backend cuando cambia la
 *   finca seleccionada.
 *
 * Ver useFincaEstanqueDensidad.js (modulo densidadPoblacional)
 * para el detalle completo de por que se reemplazo useCatalogos.
 *
 * Parametros:
 * - idFincaSeleccionada: id de la finca elegida en el Select. Si es
 *   null/""/undefined, estanquesOptions retorna [] (no se muestra
 *   ningun estanque hasta elegir una finca).
 *
 * Retorna:
 * - fincasOptions: [{ label, value }] listos para el Select de Finca.
 * - estanquesOptions: [{ label, value }] estanques de la finca
 *   seleccionada, listos para el Select de Estanque.
 * - loadingCatalogos: true mientras se estan cargando.
 * - errorCatalogos: mensaje de error si la carga falla, si no null.
 *
 * Ejemplo:
 * const { fincasOptions, estanquesOptions } = useFincaEstanqueAlimentacion(form.finca);
 */
 
import { useEffect, useMemo, useState } from "react";
import { fincaService } from "../../finca/services/finca.service";
import { estanqueService } from "../../estanques/services/estanque.service";

export function useFincaEstanqueAlimentacion(idFincaSeleccionada) {
    const [fincas, setFincas] = useState([]);
    const [estanques, setEstanques] = useState([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState(true);
    const [errorCatalogos, setErrorCatalogos] = useState(null);

    useEffect(() => {
        let activo = true;

        (async () => {
            setLoadingCatalogos(true);
            setErrorCatalogos(null);

            try {
                const [fincasData, estanquesData] = await Promise.all([
                    fincaService.getFincas(),
                    estanqueService.getEstanques(),
                ]);

                if (!activo) return;

                setFincas(fincasData || []);
                setEstanques(estanquesData || []);
            } catch (error) {
                if (activo) {
                    setErrorCatalogos("No se pudieron cargar fincas y estanques.");
                }
            } finally {
                if (activo) {
                    setLoadingCatalogos(false);
                }
            }
        })();

        return () => {
            activo = false;
        };
    }, []);

    const fincasOptions = useMemo(
        () =>
            fincas.map((finca) => ({
                label: finca.nombreFinca,
                value: finca.id,
            })),
        [fincas]
    );

    const estanquesOptions = useMemo(() => {
        if (!idFincaSeleccionada) {
            return [];
        }

        return estanques
            .filter((estanque) => Number(estanque.idFinca) === Number(idFincaSeleccionada))
            .map((estanque) => ({
                label: estanque.codigo,
                value: estanque.id,
            }));
    }, [estanques, idFincaSeleccionada]);

    return {
        fincasOptions,
        estanquesOptions,
        loadingCatalogos,
        errorCatalogos,
    };
}

export default useFincaEstanqueAlimentacion;