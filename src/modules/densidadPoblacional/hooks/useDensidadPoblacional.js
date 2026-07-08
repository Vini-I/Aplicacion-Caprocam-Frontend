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
 * - handleGuardar YA NO es un mock: activa `submitted = true`,
 *   valida finca/estanque/fecha aquí mismo y delega la
 *   validación de los datos de conteo en validar() de
 *   useDatosConteo; solo si todo es válido persiste el registro
 *   completo con DensidadPoblacional.service.js y navega. Si es
 *   inválido, no navega ni muestra éxito: deja `submitted=true`
 *   para que la UI muestre los errores.
 * - Reutiliza el mismo patrón de alertas que Alimentación
 *   (Platform.OS === 'web' ? window.alert : Alert.alert).
 *
 * Retorna:
 * - finca, estanque, fecha y sus setters, fincas, estanques.
 * - submitted, errores: estado de validación para la UI.
 * - handleGuardar: valida y guarda el registro si es válido.
 * - todos los campos/setters de datos de conteo (numeroCamarones,
 *   tirosAtarraya, areaAtarraya, promedioPorTiro, sobrevivencia,
 *   notasConteo, siembraPorM2, areaEstanque), reexportados desde
 *   useDatosConteo para que la screen los distribuya hacia
 *   InformacionEstanque y DatosConteo/FormularioConteo.
 *
 * Ejemplo:
 * const { finca, estanque, fecha, handleGuardar } = useDensidadPoblacional();
 */

import { useState } from "react";
import { Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useDatosConteo } from "./useDatosConteo";
import densidadPoblacionalService from "../services/DensidadPoblacional.service";

const showAlert = (title, message, buttons) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    buttons?.[0]?.onPress?.();
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default function useDensidadPoblacional() {
  const [finca, setFinca] = useState(null);
  const [estanque, setEstanque] = useState(null);
  const [fecha, setFecha] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errores, setErrores] = useState({});

  const router = useRouter();
  const datosConteo = useDatosConteo();

  const fincas = [
    { label: "Finca Norte", value: 1 },
    { label: "Finca Sur", value: 2 },
  ];

  const estanques = [
    { label: "Estanque A", value: 1 },
    { label: "Estanque B", value: 2 },
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

    if (!valido) return;

    const registro = {
      finca,
      estanque,
      fecha,
      numeroCamarones: datosConteo.numeroCamarones,
      tirosAtarraya: datosConteo.tirosAtarraya,
      areaAtarraya: datosConteo.areaAtarraya,
      promedioPorTiro: datosConteo.promedioPorTiro,
      sobrevivencia: datosConteo.sobrevivencia,
      notasConteo: datosConteo.notasConteo,
      siembraPorM2: datosConteo.siembraPorM2,
      areaEstanque: datosConteo.areaEstanque,
    };

    try {
      await densidadPoblacionalService.create(registro);
      showAlert("Éxito", "Módulo guardado exitosamente", [
        {
          text: "OK",
          onPress: () => {
            setSubmitted(false);
            setErrores({});
            router.replace("/(drawer)/(tabs)/registros");
          },
        },
      ]);
    } catch {
      showAlert("Error", "No se pudo guardar el registro");
    }
  };

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
    handleGuardar,
    ...datosConteo,
  };
}
