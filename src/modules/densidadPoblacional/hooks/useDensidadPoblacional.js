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
 * - finca/estanque usa useFincaEstanqueDensidad.
 * - Los estanques se filtran automáticamente según la finca
 *   seleccionada.
 * - fecha se maneja como string dd/mm/aaaa.
 * - handleGuardar valida y persiste el registro.
 * - alerta maneja mensajes visuales de éxito/error.
 *
 * Retorna:
 * - finca, estanque, fecha y setters.
 * - fincas, estanques.
 * - submitted, errores.
 * - alerta.
 * - handleGuardar.
 * - datos de conteo provenientes de useDatosConteo.
 */

import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useDatosConteo } from "./useDatosConteo";
import densidadPoblacionalService from "../services/DensidadPoblacional.service";
import { useFincaEstanqueDensidad } from "./useFincaEstanqueDensidad";

function hoy() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");

  return `${dd}/${mm}/${d.getFullYear()}`;
}

/**
 * Extrae un mensaje legible desde errores Axios/backend.
 *
 * Soporta:
 * - error.response.data.error como arreglo.
 * - error.response.data.message.
 * - error.message.
 */
function extraerMensaje(error) {
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

  const [alerta, setAlerta] = useState({
    visible: false,
    variant: "success",
    mensaje: "",
  });

  const router = useRouter();

  const datosConteo = useDatosConteo();

  /*
   * Carga todas las fincas y estanques una sola vez.
   * Filtra automáticamente los estanques según la finca.
   */
  const {
    fincasOptions,
    estanquesOptions,
  } = useFincaEstanqueDensidad(finca);

  const fincas = fincasOptions;
  const estanques = estanquesOptions;

  /**
   * Cambia la finca seleccionada.
   * Al cambiar finca, el estanque seleccionado
   * deja de ser válido y se limpia.
   */
  const cambiarFinca = (idFinca) => {
    setFinca(idFinca);
    setEstanque(null);
  };

  const validarPrincipal = () => {
    const erroresPrincipales = {};

    if (!finca) {
      erroresPrincipales.finca =
        "La finca es obligatoria";
    }

    if (!estanque) {
      erroresPrincipales.estanque =
        "El estanque es obligatorio";
    }

    if (!fecha) {
      erroresPrincipales.fecha =
        "La fecha es obligatoria";
    }

    return erroresPrincipales;
  };

  const handleGuardar = async () => {
    setSubmitted(true);

    const erroresPrincipales = validarPrincipal();

    const {
      valido: datosValidos,
      errores: erroresDatos,
    } = datosConteo.validar();

    const erroresCombinados = {
      ...erroresPrincipales,
      ...erroresDatos,
    };

    const valido =
      Object.keys(erroresCombinados).length === 0 &&
      datosValidos;

    setErrores(erroresCombinados);

    if (!valido) {
      setAlerta({
        visible: true,
        variant: "danger",
        mensaje:
          "Por favor complete todos los campos obligatorios.",
      });

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

      setAlerta({
        visible: true,
        variant: "success",
        mensaje:
          "Módulo guardado exitosamente",
      });

    } catch (err) {
      setAlerta({
        visible: true,
        variant: "danger",
        mensaje:
          extraerMensaje(err),
      });
    }
  };

  useEffect(() => {
    if (!alerta.visible) {
      return;
    }

    const duracion =
      alerta.variant === "success"
        ? 3000
        : 6000;

    const timer = setTimeout(() => {

      if (alerta.variant === "success") {
        setSubmitted(false);
        setErrores({});
        router.replace(
          "/(drawer)/(tabs)/registros"
        );
      }

      setAlerta((prev) => ({
        ...prev,
        visible: false,
      }));

    }, duracion);

    return () => clearTimeout(timer);

  }, [
    alerta.visible,
    alerta.variant,
    router,
  ]);

  return {
    finca,
    setFinca: cambiarFinca,

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