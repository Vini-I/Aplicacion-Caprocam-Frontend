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
 * - `fecha` se maneja como string dd/mm/aaaa (antes era un
 *   objeto Date), igual que el resto de la app, ya que DateInput
 *   entrega directamente el string formateado vía onChangeText.
 * - `fecha` inicia en la fecha de hoy (hoy()) y no en "": DateInput
 *   solo llama a onChangeText cuando el usuario abre el calendario
 *   y elige una fecha, pero ya muestra "hoy" por defecto sin
 *   disparar ese evento. Con el estado inicial en "", el campo se
 *   veía lleno mientras `fecha` seguía vacío, y la validación
 *   mostraba "La fecha es obligatoria" aunque se viera una fecha.
 * - handleGuardar YA NO es un mock: activa `submitted = true`,
 *   valida finca/estanque/fecha aquí mismo y delega la
 *   validación de los datos de conteo en validar() de
 *   useDatosConteo; solo si todo es válido persiste el registro
 *   completo con DensidadPoblacional.service.js y navega. Si es
 *   inválido, no navega ni muestra éxito: deja `submitted=true`
 *   para que la UI muestre los errores.
 * - El feedback de guardado (éxito, campos incompletos, error de
 *   guardado) se maneja con un estado `modal` ({ visible, variant,
 *   mensaje }) y una función cerrarModal(): la screen los usa para
 *   renderizar los componentes globales Modal + Alert de
 *   shared/components/, en vez de window.alert/Alert.alert
 *   nativos (mismo patrón que useAlimentacionForm + AlimentacionScreen).
 *   cerrarModal() solo dispara el reset (submitted/errores) y la
 *   navegación cuando el modal se cierra estando en variant "success".
 *
 * Retorna:
 * - finca, estanque, fecha y sus setters, fincas, estanques.
 * - submitted, errores: estado de validación para la UI.
 * - modal, cerrarModal: estado y cierre del modal de feedback.
 * - handleGuardar: valida y guarda el registro si es válido.
 * - todos los campos/setters de datos de conteo (numeroCamarones,
 *   tirosAtarraya, areaAtarraya, promedioPorTiro, supervivencia,
 *   notasConteo, siembraPorM2, areaEstanque), reexportados desde
 *   useDatosConteo para que la screen los distribuya hacia
 *   InformacionEstanque y DatosConteo/FormularioConteo.
 * - Si notasConteo queda vacío, handleGuardar lo completa con
 *   "No hay notas" antes de persistir el registro (no bloquea el
 *   guardado, a diferencia de promedioPorTiro/supervivencia que
 *   sí son obligatorios).
 *
 * Ejemplo:
 * const { finca, estanque, fecha, handleGuardar } = useDensidadPoblacional();
 */

import { useState,useEffect } from "react";
import { useRouter } from "expo-router";
import { useDatosConteo } from "./useDatosConteo";
import densidadPoblacionalService from "../services/DensidadPoblacional.service";

function hoy() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export default function useDensidadPoblacional() {
  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [fecha, setFecha] = useState(hoy());
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState({ visible: false, variant: "success", mensaje: "" });

  const router = useRouter();
  const datosConteo = useDatosConteo();

  const fincas = [
    { label: "Finca La Reina", value: "laReina" },
    { label: "Finca La Esperanza", value: "laEsperanza" },
    { label: "Finca La Villa", value: "laVilla" },
    { label: "Finca El Paraíso", value: "elParaiso" },
  ];

  const estanques = [
    { label: "A01", value: "A01" },
    { label: "A02", value: "A02" },
    { label: "B01", value: "B01" },
    { label: "B02", value: "B02" },
    { label: "B03", value: "B03" },
    { label: "E01", value: "E01" },
    { label: "E02", value: "E02" },
    { label: "V01", value: "V01" },
    { label: "V02", value: "V02" },
  ];

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

    const registro = {
      finca,
      estanque,
      fecha,
      numeroCamarones: datosConteo.numeroCamarones,
      tirosAtarraya: datosConteo.tirosAtarraya,
      areaAtarraya: datosConteo.areaAtarraya,
      promedioPorTiro: datosConteo.promedioPorTiro,
      supervivencia: datosConteo.supervivencia,
      notasConteo: datosConteo.notasConteo?.trim()
        ? datosConteo.notasConteo
        : "No hay notas",
      siembraPorM2: datosConteo.siembraPorM2,
      areaEstanque: datosConteo.areaEstanque,
    };

    try {
      await densidadPoblacionalService.create(registro);
      setAlerta({ visible: true, variant: "success", mensaje: "Módulo guardado exitosamente" });
    } catch {
      setAlerta({ visible: true, variant: "danger", mensaje: "No se pudo guardar el registro" });
    }
  };

  useEffect(() => {
  if (!alerta.visible) return;

  const timer = setTimeout(() => {
    if (alerta.variant === "success") {
      setSubmitted(false);
      setErrores({});
      router.replace("/(drawer)/(tabs)/registros");
    }

    setAlerta((prev) => ({
      ...prev,
      visible: false,
    }));
  }, 3000);

  return () => clearTimeout(timer);
}, [alerta.visible]);

  return {
    finca,
    setFinca,
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
