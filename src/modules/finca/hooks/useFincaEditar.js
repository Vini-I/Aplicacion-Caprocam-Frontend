/**
 * ============================================================
 * HOOK DE EDICIÓN DE FINCAS
 * ============================================================
 *
 * Gestiona la lógica necesaria para editar la información de una
 * finca existente, controlando los datos del formulario, teléfonos,
 * validaciones y actualización de la información.
 *
 * Funcionalidad:
 * - Obtiene la finca seleccionada mediante su código interno.
 * - Carga los datos actuales de la finca en el formulario.
 * - Permite modificar información básica y números de teléfono.
 * - Valida campos obligatorios antes de guardar los cambios.
 * - Verifica que los valores numéricos sean correctos.
 * - Valida que los teléfonos tengan 8 dígitos numéricos.
 * - Actualiza la finca mediante el contexto global.
 */
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { useState, useEffect, useMemo } from "react";
import { Dimensions, View } from "react-native";
import { styles } from "../styles/StylesFincaNueva.js";
import { STYLE } from "../../../theme/style.js";
import { COLORS } from "../../../theme/colors.js";
import { useFinca } from "../context/FincaContext";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export function useFincaEditar({ onFinca, codigoInterno }) {
  const { fincas, editarFinca } = useFinca();

  const [formulario, setFormulario] = useState({
    nombre: "",
    responsable: "",
    areaTotal: "",
    espejoAgua: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [telefonos, setTelefonos] = useState([""]);
  const [errores, setErrores] = useState({});
  const finca = fincas.find((f) => f.codigoInterno === codigoInterno);

  const actualizarCampo = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
    if (errores[campo]) {
      setErrores((actual) => ({ ...actual, [campo]: false }));
    }
  };

  function isTelefonoValido(telefono) {
    return /^\d{8}$/.test(telefono);
  }

  const actualizarTelefono = (index, valor) => {
    const nuevosTelefonos = [...telefonos];
    nuevosTelefonos[index] = valor;
    setTelefonos(nuevosTelefonos);

    if (errores[`telefono${index}`]) {
      setErrores((actual) => ({
        ...actual,
        [`telefono${index}`]: false,
      }));
    }
  };

  const agregarTelefono = () => {
    setTelefonos([...telefonos, ""]);
  };

  const eliminarTelefono = (index) => {
    const nuevosTelefonos = telefonos.filter((_, i) => i !== index);
    setTelefonos(nuevosTelefonos);
  };

  function isNumber(valor) {
    const numero = Number(valor);
    return !isNaN(numero) && numero >= 0;
  }

  useEffect(() => {
    if (finca) {
      setFormulario({
        nombre: finca.nombre ?? "",
        responsable: finca.responsable ?? finca.propietario ?? "",
        areaTotal: String(finca.areaTotal ?? ""),
        espejoAgua: String(finca.espejoAgua ?? ""),
      });

      setTelefonos(finca.telefonos || [""]);
    }
  }, [finca]);

  const registrarFinca = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) nuevosErrores.nombre = true;
    if (!formulario.responsable.trim()) nuevosErrores.responsable = true;

    if (
      !String(formulario.areaTotal).trim() ||
      !isNumber(formulario.areaTotal)
    ) {
      nuevosErrores.areaTotal = true;
      setErrorMessage("El área total debe ser un numero positivo");
    }

    if (
      !String(formulario.espejoAgua).trim() ||
      !isNumber(formulario.espejoAgua)
    ) {
      nuevosErrores.espejoAgua = true;
      setErrorMessage("El espejo de agua debe ser un numero positivo");
    }

    for (let i = 0; i < telefonos.length; i++) {
      const tel = String(telefonos[i] ?? "").trim();
      if (tel === "") continue;

      if (!isTelefonoValido(tel)) {
        nuevosErrores[`telefono${i}`] = true;
        setErrorMessage(
          "Cada teléfono debe contener exactamente 8 dígitos numéricos.",
        );
        break;
      }
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    editarFinca(codigoInterno, { ...formulario, telefonos });
    onFinca();
  };

  const ContentWrapper = useMemo(() => {
    return function ContentWrapper({ children, style }) {
      return <View style={[STYLE.contentWrapper, style]}>{children}</View>;
    };
  }, []);

  function SectionTitle({ icon, title }) {
    return (
      <View style={styles.sectionTitleRow}>
        <Icon icon={icon} size={18} color={COLORS.primary} style={styles.sectionIcon} />
        <Text style={styles.sectionTitleText} size={14} weight="700" color={COLORS.textPrimary}>
          {title}
        </Text>
      </View>
    );
  }

  return {
    SectionTitle,
    ContentWrapper,
    formulario,
    telefonos,
    errorMessage,
    errores,
    setErrores,

    actualizarCampo,
    actualizarTelefono,
    agregarTelefono,
    eliminarTelefono,
    registrarFinca,

    isLargeScreen,
  };
}
