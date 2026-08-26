/**
 * ============================================================
 * HOOK USECATALOGOS
 * ============================================================
 *
 * Carga las fincas y estanques reales desde el backend (MySQL)
 * y los deja listos en formato { label, value } para usarlos
 * directamente en el componente Select.
 *
 * Reemplaza los arreglos de fincas/estanques que antes estaban
 * quemados (hardcodeados) con nombres inventados como "laReina"
 * o "A01": ahora `value` es el id numérico real (finca.id /
 * estanque.id) que el backend espera en idFinca / idEstanque.
 *
 * Si se le pasa idFinca, los estanques se filtran para traer
 * solo los que pertenecen a esa finca (usa el filtro que ya
 * soporta el backend en GET /estanques?idFinca=...). Si no se
 * pasa, trae todos los estanques.
 *
 * Retorna:
 * - fincasOptions: [{ label, value }] listos para el Select de Finca.
 * - estanquesOptions: [{ label, value }] listos para el Select de Estanque.
 * - loadingCatalogos: true mientras se están cargando.
 * - errorCatalogos: mensaje de error si la carga falla, si no null.
 * - recargarEstanques(idFinca): vuelve a pedir los estanques,
 *   opcionalmente filtrados por finca (útil si el Select de
 *   estanque debe depender de la finca elegida).
 *
 * Ejemplo:
 * const { fincasOptions, estanquesOptions, loadingCatalogos } = useCatalogos();
 */

import { useState, useEffect, useCallback } from "react";
import { fincaService } from "../../finca/services/finca.service";
import { estanqueService } from "../../estanques/services/estanque.service";

export function useCatalogos(idFincaInicial) {
    const [fincasOptions, setFincasOptions] = useState([]);
    const [estanquesOptions, setEstanquesOptions] = useState([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState(true);
    const [errorCatalogos, setErrorCatalogos] = useState(null);

    const recargarEstanques = useCallback(async (idFinca) => {
        try {
            const filtros = idFinca ? { idFinca } : {};
            const estanques = await estanqueService.getEstanques(filtros);

            setEstanquesOptions(
                (estanques || []).map((e) => ({
                    label: e.codigo,
                    value: e.id,
                }))
            );
        } catch (error) {
            setErrorCatalogos(error.message);
        }
    }, []);

    useEffect(() => {
        let activo = true;

        (async () => {
            setLoadingCatalogos(true);
            setErrorCatalogos(null);

            try {
                const [fincas, estanques] = await Promise.all([
                    fincaService.getFincas(),
                    estanqueService.getEstanques(
                        idFincaInicial ? { idFinca: idFincaInicial } : {}
                    ),
                ]);

                if (!activo) return;

                const opcionesFincas = (fincas || []).map((f) => ({
                    label: f.nombreFinca,
                    value: f.id,
                }));

                const opcionesEstanques = (estanques || []).map((e) => ({
                    label: e.codigo,
                    value: e.id,
                }));

                setFincasOptions(opcionesFincas);
                setEstanquesOptions(opcionesEstanques);

            } catch (error) {
                setErrorCatalogos(error.message);
            } finally {
                if (activo) {
                    setLoadingCatalogos(false);
                }
            }
        })();

        return () => {
            activo = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        fincasOptions,
        estanquesOptions,
        loadingCatalogos,
        errorCatalogos,
        recargarEstanques,
    };
}

export default useCatalogos;