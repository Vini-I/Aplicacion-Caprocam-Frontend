/**
 * ============================================================
 * HOOK USEFINCAESTANQUERALEO
 * ============================================================
 *
 * Carga las fincas y estanques reales desde el backend (MySQL)
 * para el módulo de Raleo y los deja listos en formato
 * { label, value } para usarlos directamente en el componente
 * Select.
 *
 * Sigue EXACTAMENTE el mismo patrón que useFincaCrecimiento.js
 * (modules/mantCrecimiento/hooks/):
 *
 * - Trae TODAS las fincas y TODOS los estanques una sola vez al
 *   montar (fincaService.getFincas() + estanqueService.getEstanques()
 *   SIN filtros).
 * - Filtra los estanques por finca en memoria (useMemo, JS puro),
 *   usando `estanque.idFinca === Number(idFincaSeleccionada)`. No
 *   dispara ninguna peticion nueva al backend cuando cambia la
 *   finca seleccionada.
 *
 * IMPORTANTE: antes de este hook, RaleoForm.jsx usaba dos arreglos
 * hardcodeados (FINCAS y ESTANQUES, con nombres inventados como
 * "Finca La Reina" y códigos "A01"–"V02") en vez de datos reales.
 * El guardado (RaleoScreen.jsx -> Raleo.service.js) ya mandaba
 * form.finca/form.estanque como si fueran ids reales del backend,
 * asi que con las opciones mock, cualquier combinacion que el
 * usuario eligiera terminaba enviando un id que probablemente no
 * correspondia a una finca/estanque real. Este hook conecta por
 * primera vez esos selects a datos reales, sin tocar el resto de
 * la logica de guardado (que ya esperaba ids reales).
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
 * const { fincasOptions, estanquesOptions } = useFincaEstanqueRaleo(form.finca);
 */

import { useEffect, useMemo, useState } from "react";
import { fincaService } from "../../finca/services/finca.service";
import { estanqueService } from "../../estanques/services/estanque.service";

export function useFincaEstanqueRaleo(idFincaSeleccionada) {
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

export default useFincaEstanqueRaleo;