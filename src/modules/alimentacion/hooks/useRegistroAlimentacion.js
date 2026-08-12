/**
 * ============================================================
 * HOOK USEREGISTROALIMENTACION
 * ============================================================
 *
 * Concentra la lógica que antes vivía inline dentro de
 * screens/RegistroAlimentacionScreen.jsx (la pantalla alterna de
 * registro, sin listado ni estadísticas): el estado del modal de
 * feedback, la validación previa al guardado, el POST contra
 * Alimentacion.service.js y el cierre del modal. La screen queda
 * solamente con la composición de la UI.
 *
 * Funcionalidad:
 * - Reusa useAlimentacionForm para el estado y la validación del
 *   formulario, igual que useAlimentacionScreen.
 * - Si la validación falla, arma el listado de campos faltantes
 *   con viñetas y lo muestra en el modal con variant "warning";
 *   no llega a llamar al service.
 * - Al cerrar el modal después de un guardado exitoso limpia el
 *   formulario y vuelve atrás con navigation.goBack(). Si el modal
 *   se cerró por un error, solo se oculta y el usuario conserva lo
 *   que había escrito.
 *
 * Parámetros:
 * - navigation: objeto de navegación (se usa navigation.goBack()).
 *
 * Retorna:
 * - form, updateField: estado y setter del formulario.
 * - modal: { visible, variant, mensaje } del feedback de guardado.
 * - handleGuardar: valida y guarda el registro si es válido.
 * - cerrarModal: oculta el modal y navega atrás si fue exitoso.
 *
 * Ejemplo:
 * const { form, updateField, modal, handleGuardar, cerrarModal } =
 *   useRegistroAlimentacion(navigation);
 */

import { useState } from "react";

import useAlimentacionForm from "./useAlimentacionForm";
import alimentacionService from "../services/Alimentacion.service";

export default function useRegistroAlimentacion(navigation) {
  const {
    form,
    updateField,
    resetForm,
    validarForm,
  } = useAlimentacionForm();

  const [modal, setModal] = useState({
    visible: false,
    variant: "success",
    mensaje: "",
  });

  const handleGuardar = async () => {
    const { valido, errores } = validarForm();

    if (!valido) {
      const lista = Object.values(errores)
        .map((error) => `• ${error}`)
        .join("\n");

      setModal({
        visible: true,
        variant: "warning",
        mensaje: `Por favor complete:\n${lista}`,
      });

      return;
    }

    try {
      await alimentacionService.create(form);

      setModal({
        visible: true,
        variant: "success",
        mensaje: "Alimentación registrada correctamente",
      });
    } catch {
      setModal({
        visible: true,
        variant: "danger",
        mensaje: "No se pudo guardar el registro",
      });
    }
  };

  const cerrarModal = () => {
    setModal((modalActual) => ({
      ...modalActual,
      visible: false,
    }));

    if (modal.variant === "success") {
      resetForm();
      navigation?.goBack();
    }
  };

  return {
    form,
    updateField,
    modal,
    handleGuardar,
    cerrarModal,
  };
}
