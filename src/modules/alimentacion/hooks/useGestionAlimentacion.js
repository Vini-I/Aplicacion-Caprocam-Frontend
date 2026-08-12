/**
 * ============================================================
 * HOOK USEGESTIONALIMENTACION
 * ============================================================
 *
 * Concentra la lógica que antes vivía inline dentro de
 * screens/GestionAlimentacion.jsx: el cálculo de las estadísticas
 * del día, el estado de los errores de catálogos que reportan las
 * secciones del formulario, la resolución de cuál alerta mostrar y
 * el auto-scroll hacia esa alerta. GestionAlimentacion.jsx queda
 * solamente con la composición de la UI, siguiendo el mismo patrón
 * de separación que useAlimentacionScreen.js.
 *
 * Funcionalidad:
 * - `stats` se calcula con useMemo a partir de la lista de
 *   registros, para no recorrerla en cada render.
 * - Prioridad de la alerta (la misma que había inline):
 *   alerta de guardado > error de catálogos > error del listado.
 * - Cuando aparece una alerta hace scrollToEnd sobre el ScrollView
 *   referenciado por `scrollRef`, para que el usuario la vea sin
 *   tener que desplazarse a mano.
 *
 * Parámetros:
 * - alimentaciones: lista de registros ya guardados.
 * - errorListado: mensaje de error al cargar el listado, o null.
 * - alerta: { visible, variant, mensaje } que entrega el hook de
 *   la pantalla (useAlimentacionScreen).
 *
 * Retorna:
 * - scrollRef: ref que debe asignarse al ScrollView de la pantalla.
 * - stats: { registrosHoy, kgSuministrados, estanquesActivos }.
 * - alertVisible, alertVariant, alertMessage: alerta ya resuelta.
 * - handleCatalogoErrorChange(seccion, mensaje): callback que se le
 *   pasa a AlimentacionForm como onCatalogoErrorChange.
 *
 * Ejemplo:
 * const { scrollRef, stats, alertVisible, alertMessage } =
 *   useGestionAlimentacion({ alimentaciones, errorListado, alerta });
 */

import { useEffect, useMemo, useRef, useState } from "react";

const ALERTA_VACIA = {
  visible: false,
  variant: "success",
  mensaje: "",
};

function calcularStats(registros = []) {
  const registrosHoy = registros.length;

  const kgSuministrados = registros.reduce((total, registro) => {
    return total + Number(registro.cantidadKg || 0);
  }, 0);

  const estanquesActivos = new Set(
    registros
      .map((registro) => registro.estanque)
      .filter(Boolean)
  ).size;

  return {
    registrosHoy,
    kgSuministrados,
    estanquesActivos,
  };
}

export default function useGestionAlimentacion({
  alimentaciones = [],
  errorListado = null,
  alerta = ALERTA_VACIA,
} = {}) {
  const scrollRef = useRef(null);

  const [catalogoErrors, setCatalogoErrors] = useState({
    infoGeneral: "",
    consumo: "",
  });

  const stats = useMemo(
    () => calcularStats(alimentaciones),
    [alimentaciones]
  );

  const catalogoError =
    catalogoErrors.infoGeneral || catalogoErrors.consumo;

  /*
   * Prioridad: alerta de guardado > error de catálogos >
   * error al cargar el listado.
   */
  const alertVisible =
    alerta.visible || !!catalogoError || !!errorListado;

  const alertMessage = alerta.visible
    ? alerta.mensaje
    : (catalogoError || errorListado);

  const alertVariant = alerta.visible ? alerta.variant : "danger";

  useEffect(() => {
    if (alertVisible) {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }
  }, [alertVisible]);

  const handleCatalogoErrorChange = (seccion, mensaje) => {
    setCatalogoErrors((erroresActuales) => ({
      ...erroresActuales,
      [seccion]: mensaje || "",
    }));
  };

  return {
    scrollRef,
    stats,
    alertVisible,
    alertVariant,
    alertMessage,
    handleCatalogoErrorChange,
  };
}
