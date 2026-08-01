/**
 * ============================================================
 * HOOK USEALIMENTACIONSCREEN
 * ============================================================
 *
 * Orquesta la pantalla principal del módulo de Alimentación:
 * combina la carga de registros (useAlimentacion), el estado del
 * formulario (useAlimentacionForm) y el guardado real del
 * registro. Antes vivía como lógica inline dentro de
 * AlimentacionScreen.jsx; se extrajo aquí para seguir el mismo
 * patrón de separación de hooks que useDensidadPoblacional.js.
 *
 * Funcionalidad:
 * - `submitted` se activa dentro de handleGuardar, ANTES de
 *   validar, para que AlimentacionForm sepa cuándo mostrar los
 *   bordes rojos y mensajes de error de validarForm().
 * - `alerta` maneja tanto el mensaje de éxito (top de pantalla,
 *   3s) como el de error de validación/guardado (in-form, junto
 *   al botón, 6s): la duración depende de `alerta.variant`.
 * - Un guardado fallido por el backend (no por validación local)
 *   usa extraerMensaje(err) de ErrorContext.js para mostrar el
 *   error específico devuelto por el backend cuando existe, en
 *   vez de un mensaje genérico fijo.
 *
 * Retorna:
 * - alimentaciones, loading: datos y estado de carga de la lista.
 * - form, updateField: estado y setter del formulario.
 * - submitted, errores: estado de validación para la UI.
 * - alerta: { visible, variant, mensaje } para el feedback de guardado.
 * - handleGuardar: valida y guarda el registro si es válido.
 *
 * Ejemplo:
 * const { form, updateField, handleGuardar } = useAlimentacionScreen(navigation);
 */

import { useEffect, useState } from "react";

import useAlimentacion from "./useAlimentacion";
import useAlimentacionForm from "./useAlimentacionForm";
import alimentacionService from "../services/Alimentacion.service";

const extraerMensajeAlimentacion = (error) => {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data?.error) && data.error.length > 0) {
    return data.error.join(" ");
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join(" ");
  }

  if (Array.isArray(data?.errores) && data.errores.length > 0) {
    return data.errores.join(" ");
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  if (typeof data?.mensaje === "string") {
    return data.mensaje;
  }

  if (typeof data?.error === "string") {
    return data.error;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  return "No se pudo registrar la alimentación.";
};

export default function useAlimentacionScreen(navigation) {
  const {
    alimentaciones,
    loading,
    recargar,
  } = useAlimentacion();

  const {
    form,
    updateField: updateFormField,
    resetForm,
    validarForm,
  } = useAlimentacionForm();

  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});

  const [alerta, setAlerta] = useState({
    visible: false,
    variant: "success",
    mensaje: "",
  });

  useEffect(() => {
    if (!navigation?.addListener) {
      return undefined;
    }

    const unsubscribe = navigation.addListener("focus", () => {
      recargar();
    });

    return unsubscribe;
  }, [navigation, recargar]);

  useEffect(() => {
    if (!alerta.visible) {
      return undefined;
    }

    const duracion =
      alerta.variant === "success" ? 3000 : 6000;

    const timer = setTimeout(() => {
      if (alerta.variant === "success") {
        resetForm();
        setSubmitted(false);
        setErrores({});
        recargar();
      }

      setAlerta((alertaActual) => ({
        ...alertaActual,
        visible: false,
      }));
    }, duracion);

    return () => clearTimeout(timer);
  }, [
    alerta.visible,
    alerta.variant,
    resetForm,
    recargar,
  ]);

  const updateField = (campo, valor) => {
    updateFormField(campo, valor);

    /*
     * Oculta la alerta anterior cuando el usuario
     * comienza a escribir un registro nuevo.
     */
    if (alerta.visible) {
      setAlerta((alertaActual) => ({
        ...alertaActual,
        visible: false,
      }));
    }

    /*
     * Elimina el error solamente del campo modificado.
     */
    if (errores[campo]) {
      setErrores((erroresActuales) => {
        const nuevosErrores = {
          ...erroresActuales,
        };

        delete nuevosErrores[campo];

        return nuevosErrores;
      });
    }
  };

  const handleGuardar = async () => {
    setSubmitted(true);

    setAlerta({
      visible: false,
      variant: "success",
      mensaje: "",
    });

    const resultadoValidacion = validarForm();

    const valido = resultadoValidacion?.valido;
    const erroresValidacion =
      resultadoValidacion?.errores || {};

    setErrores(erroresValidacion);

    if (!valido) {
      setAlerta({
        visible: true,
        variant: "danger",
        mensaje:
          "Por favor complete todos los campos obligatorios.",
      });

      return;
    }

    try {
      await alimentacionService.create(form);

      /*
       * No se utiliza router.back() ni navigation.goBack().
       * El usuario permanece en Alimentación.
       */
      setAlerta({
        visible: true,
        variant: "success",
        mensaje:
          "Alimentación registrada correctamente.",
      });
    } catch (error) {
      console.error(
        "Error registrando alimentación:",
        error?.response?.data || error
      );

      setAlerta({
        visible: true,
        variant: "danger",
        mensaje: extraerMensajeAlimentacion(error),
      });
    }
  };

  return {
    alimentaciones,
    loading,
    form,
    updateField,
    submitted,
    errores,
    alerta,
    handleGuardar,
  };
}