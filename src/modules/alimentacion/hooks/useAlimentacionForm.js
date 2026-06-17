import { useState } from "react";

function hoy() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
}

const estadoInicial = {
    estanque:         "",
    fecha:            hoy(),
    hora:             "",
    metodo:           "",
    cantidadKg:       0,
    proveedor:        "",
    observaciones:    "",
    tipoAlimento:     "",
    racionesDia:      1,
    totalKg:          0,
    tasaAlimentacion: 0,
    lecturaAM:        0,
    lecturaPM:        0,
};

const useAlimentacionForm = () => {
    const [form, setForm] = useState(estadoInicial);

    const updateField = (campo, valor) =>
        setForm((prev) => ({ ...prev, [campo]: valor }));

    const resetForm = () => setForm(estadoInicial);

    const validarForm = () => {
        const errores = {};
        if (!form.estanque)               errores.estanque   = "Estanque es obligatorio";
        if (!form.fecha)                  errores.fecha      = "Fecha es obligatoria";
        if (!form.hora)                   errores.hora       = "Hora es obligatoria";
        if (!form.metodo)                 errores.metodo     = "Método es obligatorio";
        if (Number(form.cantidadKg) <= 0) errores.cantidadKg = "La cantidad debe ser mayor a 0";
        return { valido: Object.keys(errores).length === 0, errores };
    };

    return { form, updateField, resetForm, validarForm };
};

export default useAlimentacionForm;