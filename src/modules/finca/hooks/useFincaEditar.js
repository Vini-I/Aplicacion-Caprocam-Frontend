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
import { fincaDTO } from "../dtos/finca.dto.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export function useFincaEditar({ onFinca, id }) {
  const { fincas, editarFinca } = useFinca();

  const [formulario, setFormulario] = useState({
    nombre: "",
    responsable: "",
    areaTotal: "",
    espejoAgua: "",
  });

  const [telefonos, setTelefonos] = useState([""]);
  const [errores, setErrores] = useState({});
  const finca = fincas.find((f) => f.id === Number(id));

  const actualizarCampo = (campo, valor) => {
    const nuevoValor =
      campo === "areaTotal" || campo === "espejoAgua"
        ? normalizarNumeroDecimal(valor)
        : valor;
    setFormulario((actual) => ({
      ...actual,
      [campo]: nuevoValor,
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
    nuevosTelefonos[index] = String(valor).replace(/\D/g, "").slice(0, 8);
    setTelefonos(nuevosTelefonos);

    if (errores[`telefono${index}`]) {
      setErrores((actual) => ({
        ...actual,
        [`telefono${index}`]: false,
      }));
    }
  };

  //Función para seguir con decimal(10,2)
  function normalizarNumeroDecimal(valor) {
    let valorLimpio = String(valor)
      .replace(",", ".")
      .replace(/[^0-9.]/g, "");

    const partes = valorLimpio.split(".");
    let entero = partes[0] ?? "";
    let decimal = partes.length > 1 ? partes.slice(1).join("") : null;

    entero = entero.slice(0, 10);

    if (decimal !== null) {
      decimal = decimal.slice(0, 2);
      return `${entero}.${decimal}`;
    }

    return entero;
  }

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
        nombre: finca.nombreFinca ?? "",
        responsable: finca.propietarioResponsable ?? finca.propietario ?? "",
        areaTotal: String(finca.areaTotal ?? ""),
        espejoAgua: String(finca.espejosAgua ?? ""),
      });

      setTelefonos(finca.telefonoParse || [""]);
    }
  }, [finca]);

  const registrarFinca = () => {
    const nuevosErrores = {};
    const telefonosLimpios = telefonos
      .map((tel) => String(tel ?? "").trim())
      .filter((tel) => tel !== "");

    if (!formulario.nombre.trim()) nuevosErrores.nombre = true;
    if (!formulario.responsable.trim()) nuevosErrores.responsable = true;

    if (
      !String(formulario.areaTotal).trim() ||
      !isNumber(formulario.areaTotal)
    ) {
      nuevosErrores.areaTotal = true;
    }

    if (
      !String(formulario.espejoAgua).trim() ||
      !isNumber(formulario.espejoAgua)
    ) {
      nuevosErrores.espejoAgua = true;
    }

    for (let i = 0; i < telefonos.length; i++) {
      const tel = String(telefonos[i] ?? "").trim();
      if (tel === "") continue;

      if (!isTelefonoValido(tel)) {
        nuevosErrores[`telefono${i}`] = true;
        break;
      }
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const EditarFincaDTO = new fincaDTO({
      codigoCBO: finca.codigoCBO,
      nombreFinca: formulario.nombre,
      provincia: finca.provincia,
      canton: finca.canton,
      distrito: finca.distrito,
      otrasSenas: finca.otrasSenas,
      propietarioResponsable: formulario.responsable,
      telefono: telefonosLimpios,
      areaTotal: Number(formulario.areaTotal),
      espejosAgua: Number(formulario.espejoAgua),
    });

    editarFinca(finca.codigoCBO, EditarFincaDTO);
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
        <Icon
          icon={icon}
          size={18}
          color={COLORS.primary}
          style={styles.sectionIcon}
        />
        <Text
          style={styles.sectionTitleText}
          size={14}
          weight="700"
          color={COLORS.textPrimary}
        >
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
    errores,
    finca,

    actualizarCampo,
    actualizarTelefono,
    agregarTelefono,
    eliminarTelefono,
    registrarFinca,

    isLargeScreen,
  };
}
