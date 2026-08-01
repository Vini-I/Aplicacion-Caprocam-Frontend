/**
 * ============================================================
 * HOOK USEPROVEEDORPRODUCTOALIMENTACION
 * ============================================================
 *
 * Carga los proveedores y productos reales desde el backend
 * (MySQL) para el módulo de Alimentación y los deja listos en
 * formato { label, value } para usarlos directamente en el
 * componente Select.
 *
 * Sigue el mismo patrón que useFincaEstanqueAlimentacion.js:
 * trae todos los proveedores y todos los productos una sola vez
 * al montar.
 *
 * Antes, el Select de "Proveedor" usaba una lista fija hardcodeada
 * (PROVEEDORES en constants/alimentacionOpciones.js) que guardaba
 * texto libre en vez del id real del proveedor (proveedor_id
 * siempre quedaba en NULL). Este hook reemplaza esa lista fija
 * por el catálogo real, y agrega el catálogo de productos que
 * antes no existía (producto_id también quedaba en NULL).
 *
 * Filtrado: productosOptions solo incluye los productos cuyo
 * proveedorId coincide con idProveedorSeleccionado (mismo patrón
 * que useFincaEstanqueAlimentacion filtra estanques por finca).
 * Si no hay proveedor elegido, productosOptions retorna [].
 *
 * Parametros:
 * - idProveedorSeleccionado: id del proveedor elegido en el Select.
 *   Si es null/""/undefined, productosOptions retorna [] (no se
 *   muestra ningun producto hasta elegir un proveedor).
 *
 * Retorna:
 * - proveedoresOptions: [{ label, value }] listos para el Select de Proveedor.
 * - productosOptions: [{ label, value }] productos del proveedor
 *   seleccionado, listos para el Select de Producto.
 * - loadingCatalogos: true mientras se estan cargando.
 * - errorCatalogos: mensaje de error si la carga falla, si no null.
 *
 * Ejemplo:
 * const { proveedoresOptions, productosOptions } = useProveedorProductoAlimentacion(form.idProveedor);
 */

import { useEffect, useMemo, useState } from "react";
import { getProveedores } from "../../proveedores/services/proveedor.service";
import { productoService } from "../../productos/services/producto.service";

export function useProveedorProductoAlimentacion(idProveedorSeleccionado) {
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState(true);
    const [errorCatalogos, setErrorCatalogos] = useState(null);

    useEffect(() => {
        let activo = true;

        (async () => {
            setLoadingCatalogos(true);
            setErrorCatalogos(null);

            try {
                const [proveedoresData, productosData] = await Promise.all([
                    getProveedores(),
                    productoService.getProductos(),
                ]);
                if (!activo) return;

                setProveedores(proveedoresData || []);
                setProductos(productosData || []);
            } catch (error) {
                if (activo) {
                    setErrorCatalogos("No se pudieron cargar proveedores y productos.");
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

    const proveedoresOptions = useMemo(
        () =>
            proveedores.map((proveedor) => ({
                label: proveedor.nombre,
                value: proveedor.id,
            })),
        [proveedores]
    );

    const productosOptions = useMemo(() => {
        if (!idProveedorSeleccionado) {
            return [];
        }

        return productos
            .filter((producto) => Number(producto.proveedorId) === Number(idProveedorSeleccionado))
            .map((producto) => ({
                label: producto.nombre,
                value: producto.id,
            }));
    }, [productos, idProveedorSeleccionado]);

    return {
        proveedoresOptions,
        productosOptions,
        loadingCatalogos,
        errorCatalogos,
    };
}

export default useProveedorProductoAlimentacion;