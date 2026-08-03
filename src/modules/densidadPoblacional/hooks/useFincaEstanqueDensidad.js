/**
 * ============================================================
 * HOOK USEFINCAESTANQUEDENSIDAD
 * ============================================================
 *
 * Carga las fincas y estanques reales desde el backend (MySQL)
 * para el módulo de Densidad Poblacional y los deja listos en
 * formato { label, value } para usarlos directamente en el
 * componente Select.
 *
 * Sigue EXACTAMENTE el mismo patrón que useFincaCrecimiento.js
 * (modules/mantCrecimiento/hooks/), y reemplaza al hook genérico
 * useCatalogos que usaba antes este módulo:
 *
 * - Trae TODAS las fincas y TODOS los estanques una sola vez al
 *   montar (fincaService.getFincas() + estanqueService.getEstanques()
 *   SIN filtros), en vez de pedirle al backend "los estanques de
 *   la finca X" cada vez que el usuario cambia de finca.
 * - Filtra los estanques por finca en memoria (useMemo, JS puro),
 *   usando `estanque.idFinca === Number(idFincaSeleccionada)`. No
 *   dispara ninguna peticion nueva al backend cuando cambia la
 *   finca seleccionada: solo vuelve a calcular el filtro sobre el
 *   arreglo que ya esta cargado.
 *
 * Por que se reemplazo useCatalogos:
 * - useCatalogos exponia recargarEstanques(idFinca), que llamaba a
 *   estanqueService.getEstanques({ idFinca }) cada vez que cambiaba
 *   la finca. Ademas, la version usada por Alimentacion y Densidad
 *   Poblacional tenia un bug real: estanqueService.getEstanques
 *   ignoraba por completo el parametro filtros (nunca mandaba
 *   idFinca como query param), asi que el filtrado por finca nunca
 *   se aplicaba de verdad del lado del servidor.
 * - Con este hook ya no importa si el backend filtra o no: el
 *   filtrado se hace siempre en el cliente, sobre datos reales ya
 *   cargados, igual que en Crecimiento (que nunca tuvo este bug
 *   porque nunca dependio del filtro del servidor).
 *
 * Parametros:
 * - idFincaSeleccionada: id de la finca elegida en el Select. Si es
 *   null/""/undefined, estanquesOptions retorna [] (no se muestra
 *   ningun estanque hasta elegir una finca), igual que Crecimiento.
 *
 * Retorna:
 * - fincasOptions: [{ label, value }] listos para el Select de Finca.
 * - estanquesOptions: [{ label, value }] estanques de la finca
 *   seleccionada, listos para el Select de Estanque.
 * - loadingCatalogos: true mientras se estan cargando.
 * - errorCatalogos: mensaje de error si la carga falla, si no null.
 *
 * Ejemplo:
 * const { fincasOptions, estanquesOptions } = useFincaEstanqueDensidad(finca);
 */

import { useEffect, useMemo, useState } from "react";
import { fincaService } from "../../finca/services/finca.service";
import { estanqueService } from "../../estanques/services/estanque.service";

export function useFincaEstanqueDensidad(idFincaSeleccionada) {
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

export default useFincaEstanqueDensidad;