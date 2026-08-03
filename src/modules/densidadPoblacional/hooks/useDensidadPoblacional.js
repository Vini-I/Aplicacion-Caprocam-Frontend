/**
 * ============================================================
 * HOOK USEDENSIDADPOBLACIONAL
 * ============================================================
 *
 * Orquesta el estado de finca/estanque/fecha, delega el estado
 * de los datos de conteo en useDatosConteo, y maneja el guardado
 * real del registro de densidad poblacional.
 *
 * Funcionalidad:
 * - finca/estanque: usa useFincaEstanqueDensidad (mismo patron que
 *   useFincaCrecimiento.js) en vez del useCatalogos generico que
 *   usaba antes. Trae TODAS las fincas y TODOS los estanques una
 *   sola vez al montar, y filtra los estanques de la finca elegida
 *   en memoria (useMemo), sin pedirle al backend "los estanques de
 *   la finca X" cada vez que cambia la finca. Ver el docstring de
 *   useFincaEstanqueDensidad.js para el detalle completo.
 * - `fecha` se maneja como string dd/mm/aaaa (antes era un
 *   objeto Date), igual que el resto de la app, ya que DateInput
 *   entrega directamente el string formateado via onChangeText.
 * - `fecha` inicia en la fecha de hoy (hoy()) y no en "": DateInput
 *   solo llama a onChangeText cuando el usuario abre el calendario
 *   y elige una fecha, pero ya muestra "hoy" por defecto sin
 *   disparar ese evento. Con el estado inicial en "", el campo se
 *   veia lleno mientras `fecha` seguia vacio, y la validacion
 *   mostraba "La fecha es obligatoria" aunque se viera una fecha.
 * - handleGuardar YA NO es un mock: activa `submitted = true`,
 *   valida finca/estanque/fecha aqui mismo y delega la
 *   validacion de los datos de conteo en validar() de
 *   useDatosConteo; solo si todo es valido arma el DTO con los
 *   nombres reales de columna del backend (idFinca, idEstanque,
 *   cantidadSiembra, sobrevivencia...) y la fecha ya convertida a
 *   ISO YYYY-MM-DD (toMysqlDate), y lo persiste con
 *   DensidadPoblacional.service.js. Si es invalido, no navega ni
 *   muestra exito: deja `submitted=true` para que la UI muestre
 *   los errores.
 * - IMPORTANTE: DensidadPoblacional.service.js ya NO mapea nombres
 *   de campo ni convierte fechas (es un passthrough puro que solo
 *   llama a axios). Por eso este hook arma el DTO exacto que
 *   espera el backend antes de llamar a
 *   densidadPoblacionalService.create(). Si en el futuro se agrega
 *   una pantalla de listado/edicion que use getAll/getById/update,
 *   esa pantalla (o este hook) tambien debe encargarse de mapear
 *   idFinca/idEstanque -> finca/estanque y la fecha ISO -> dd/mm/aaaa
 *   para mostrarla, ya que el service ya no lo hace por si solo.
 * - El feedback de guardado (exito, campos incompletos, error de
 *   guardado) se maneja con un estado `alerta` ({ visible, variant,
 *   mensaje }): la screen lo usa para renderizar el componente
 *   global Alert de shared/components/ en linea, dentro de la
 *   card (mismo patron visual que FincaCrecimientoScreen), en vez
 *   de window.alert/Alert.alert nativos. NO se usa el componente
 *   Modal (a diferencia de useAlimentacionForm + AlimentacionScreen,
 *   que si envuelven el Alert en un Modal/popup): aqui el Alert es
 *   siempre un banner en linea dentro del formulario. El timer del
 *   useEffect de mas abajo oculta la alerta y, solo si fue exito,
 *   resetea submitted/errores y navega de vuelta a /registros.
 *
 * Retorna:
 * - finca, estanque, fecha y sus setters, fincas, estanques.
 * - submitted, errores: estado de validacion para la UI.
 * - alerta: estado { visible, variant, mensaje } que la screen usa
 *   para renderizar el Alert en linea (se oculta sola con un timer).
 * - handleGuardar: valida y guarda el registro si es valido.
 * - todos los campos/setters de datos de conteo (numeroCamarones,
 *   tirosAtarraya, areaAtarraya, promedioPorTiro, supervivencia,
 *   notasConteo, siembraPorM2, areaEstanque), reexportados desde
 *   useDatosConteo para que la screen los distribuya hacia
 *   InformacionEstanque y DatosConteo/FormularioConteo.
 * - Si notasConteo queda vacio, handleGuardar lo completa con
 *   "No hay notas" antes de persistir el registro (no bloquea el
 *   guardado, a diferencia de promedioPorTiro/supervivencia que
 *   si son obligatorios).
 *
 * Ejemplo:
 * const { finca, estanque, fecha, handleGuardar } = useDensidadPoblacional();
 */

import { useState,useEffect } from "react";
import { useDatosConteo } from "./useDatosConteo";
import densidadPoblacionalService from "../services/DensidadPoblacional.service";
import { useFincaEstanqueDensidad } from "./useFincaEstanqueDensidad";
import { toMysqlDate } from "../../../shared/utils/dateUtils";

function hoy() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function extraerMensaje(error) {
  /*
  Descripcion:
  Extrae un mensaje legible de un error de axios (o de cualquier
  error). Se agrego porque handleGuardar ya llamaba a esta funcion
  en su catch, pero no existia en el archivo: si el backend
  respondia con error (422/409/500...), la app lanzaba un
  ReferenceError en vez de mostrar el Alert de error.

  Parametros:
  - error: Error capturado (tipicamente de una llamada axios).

  Retorna:
  - String con el mensaje mas especifico disponible.
  */
  if (typeof error === "string") {
    return error;
  }

  const detalles = error?.response?.data?.error;
  if (Array.isArray(detalles) && detalles.length > 0) {
    return detalles.join(" ");
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Ocurrió un error inesperado."
  );
}

export default function useDensidadPoblacional() {
  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [fecha, setFecha] = useState(hoy());
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });

  const datosConteo = useDatosConteo();

  const { fincasOptions, estanquesOptions } = useFincaEstanqueDensidad(finca);
  const fincas = fincasOptions;
  const estanques = estanquesOptions;

  const setFincaYResetEstanque = (idFinca) => {
    setFinca(idFinca);
    setEstanque(null);
  };

  const validarPrincipal = () => {
    const erroresPrincipales = {};
    if (!finca) erroresPrincipales.finca = "La finca es obligatoria";
    if (!estanque) erroresPrincipales.estanque = "El estanque es obligatorio";
    if (!fecha) erroresPrincipales.fecha = "La fecha es obligatoria";
    return erroresPrincipales;
  };

  const handleGuardar = async () => {
    setSubmitted(true);

    const erroresPrincipales = validarPrincipal();
    const { valido: datosValidos, errores: erroresDatos } = datosConteo.validar();
    const erroresCombinados = { ...erroresPrincipales, ...erroresDatos };
    const valido = Object.keys(erroresCombinados).length === 0 && datosValidos;

    setErrores(erroresCombinados);

    if (!valido) {
      setAlerta({ visible: true, variant: "danger", mensaje: "Por favor complete todos los campos obligatorios." });
      return;
    }

    // El service ahora es un passthrough puro (no mapea nombres de
    // campo ni convierte la fecha): este objeto ya tiene que tener
    // exactamente los nombres que espera el backend
    // (dtos/densidadpoblacional.dto.js) y la fecha en ISO YYYY-MM-DD.
    const densidadDTO = {
      idFinca: finca,
      idEstanque: estanque,
      fecha: toMysqlDate(fecha),
      numeroCamarones: datosConteo.numeroCamarones,
      tirosAtarraya: datosConteo.tirosAtarraya,
      areaAtarraya: datosConteo.areaAtarraya,
      promedioPorTiro: datosConteo.promedioPorTiro,
      sobrevivencia: datosConteo.supervivencia,
      notasConteo: datosConteo.notasConteo?.trim()
        ? datosConteo.notasConteo
        : "No hay notas",
      cantidadSiembra: datosConteo.siembraPorM2,
      areaEstanque: datosConteo.areaEstanque,
    };

    try {
      await densidadPoblacionalService.create(densidadDTO);
      setAlerta({ visible: true, variant: "success", mensaje: "Modulo guardado exitosamente" });
    } catch (err) {
      setAlerta({ visible: true, variant: "danger", mensaje: extraerMensaje(err) });
    }
  };

  useEffect(() => {
  if (!alerta.visible) return;

  // Exito: 3s en pantalla. Error (validacion o del backend): 6s,
  // para dar tiempo a leer el mensaje especifico.
  const duracion = alerta.variant === "success" ? 3000 : 6000;

  const timer = setTimeout(() => {
    if (alerta.variant === "success") {
      setSubmitted(false);
      setErrores({});
      setFinca(null);
      setEstanque(null);
      setFecha(hoy());
      datosConteo.resetear();
    }

    setAlerta((prev) => ({
      ...prev,
      visible: false,
    }));
  }, duracion);

  return () => clearTimeout(timer);
}, [alerta.visible]);

  return {
    finca,
    setFinca: setFincaYResetEstanque,
    estanque,
    setEstanque,
    fecha,
    setFecha,
    fincas,
    estanques,
    submitted,
    errores,
    alerta,
    handleGuardar,
    ...datosConteo,
  };
}