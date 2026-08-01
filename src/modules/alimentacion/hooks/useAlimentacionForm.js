/**
 * ============================================================
 * HOOK USEALIMENTACIONFORM
 * ============================================================
 *
 * Maneja el estado local del formulario de alimentación y su
 * validación. No muestra ni renderiza nada en pantalla: la
 * interfaz (la screen) decide cuándo mostrar los errores
 * devueltos, usando su propio estado `submitted`.
 *
 * Estado que maneja:
 * - form: objeto con los valores actuales de todos los campos.
 *
 * Retorna:
 * - form: valores actuales del formulario.
 * - updateField(campo, valor): actualiza un campo del formulario.
 * - resetForm(): restaura el formulario a sus valores iniciales.
 * - validarForm(): retorna { valido, errores } sin mostrar nada.
 *   Además de finca/estanque/fecha/hora/metodo/cantidadKg, ahora
 *   también exige tipoAlimento, presentacion, proveedor y
 *   observaciones.
 *
 * Ejemplo:
 * const { form, updateField, resetForm, validarForm } = useAlimentacionForm();
 */
/**
 * ============================================================
 * HOOK USEALIMENTACIONFORM
 * ============================================================
 *
 * Maneja el estado local del formulario de alimentación y su
 * validación. No muestra ni renderiza nada en pantalla: la
 * interfaz (la screen) decide cuándo mostrar los errores
 * devueltos, usando su propio estado `submitted`.
 *
 * Estado que maneja:
 * - form: objeto con los valores actuales de todos los campos.
 *
 * Retorna:
 * - form: valores actuales del formulario.
 * - updateField(campo, valor): actualiza un campo del formulario.
 * - resetForm(): restaura el formulario a sus valores iniciales.
 * - validarForm(): retorna { valido, errores } sin mostrar nada.
 *   Además de finca/estanque/fecha/hora/metodo/cantidadKg, ahora
 *   también exige tipoAlimento, presentacion, proveedor y
 *   observaciones.
 *
 * Ejemplo:
 * const { form, updateField, resetForm, validarForm } = useAlimentacionForm();
 */

import { useState } from "react";

function hoy() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${ d.getFullYear() }-${ mm }-${ dd }`;
}

const estadoInicial = {
    finca: "",
    estanque: "",
    fecha: hoy(),
    hora: "",
    metodo: "",
    cantidadKg: "",
    idProveedor: "",
    proveedor: "",
    idProducto: "",
    idColaborador: "",
    observaciones: "",
    tipoAlimento: "",
    presentacion: "",
    racionesDia: 1,
    totalKg: 0,
    tasaAlimentacion: 0,
    lecturaAM: 0,
    lecturaPM: 0,
};

const useAlimentacionForm = () => {
    const [form, setForm] = useState(estadoInicial);

    const updateField = (campo, valor) =>
        setForm((prev) => ({ ...prev, [campo]: valor }));

    const resetForm = () => setForm(estadoInicial);

    const validarForm = () => {
        const errores = {};
        if (!form.finca) errores.finca = "Finca es obligatoria";
        if (!form.estanque) errores.estanque = "Estanque es obligatorio";
        if (!form.fecha) errores.fecha = "Fecha es obligatoria";
        if (!form.hora) errores.hora = "Hora es obligatoria";
        if (!form.metodo) errores.metodo = "Método es obligatorio";
        if (Number(form.cantidadKg) <= 0) errores.cantidadKg = "La cantidad debe ser mayor a 0";
        if (!Number.isInteger(Number(form.cantidadKg))) errores.cantidadKg = "Solo se permiten números enteros";
        if (!form.tipoAlimento) errores.tipoAlimento = "Tipo de alimento es obligatorio";
        if (!form.presentacion) errores.presentacion = "Presentación es obligatoria";
        if (!form.idProveedor) errores.proveedor = "Proveedor es obligatorio";
        if (!form.idProducto) errores.producto = "Producto es obligatorio";
        if (!form.observaciones) errores.observaciones = "Observaciones es obligatorio";
        return { valido: Object.keys(errores).length === 0, errores };
    };

    return { form, updateField, resetForm, validarForm };
};

export default useAlimentacionForm;