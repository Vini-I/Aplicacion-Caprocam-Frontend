/**
 * ============================================================
 * HOOK DE REGISTRO DE NUEVA FINCA
 * ============================================================
 *
 * Gestiona la lógica necesaria para registrar una nueva finca,
 * controlando los datos del formulario, teléfonos, ubicaciones
 * disponibles y validaciones antes de guardar la información.
 *
 * Funcionalidad:
 * - Maneja el estado del formulario de creación de fincas.
 * - Permite actualizar los datos ingresados por el usuario.
 * - Administra múltiples números de teléfono.
 * - Valida que los campos obligatorios estén completos.
 * - Obtiene las opciones de cantones y distritos según la ubicación.
 * - Registra una nueva finca mediante el contexto global.
 */
import Text from "../../../shared/components/Text.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { provincias, ubicaciones } from "../screens/FincaNuevaData.js";
import { styles } from "../styles/StylesFincaNueva.js";
import { STYLE } from "../../../theme/style.js";
import { COLORS } from "../../../theme/colors.js";
import { useFinca } from "../context/FincaContext";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export function useFincaNueva({ onFinca }) {
  const { crearFinca } = useFinca();

  const [formulario, setFormulario] = useState({
    codigoInterno: "",
    nombre: "",
    provincia: "",
    canton: "",
    distrito: "",
    responsable: "",
    areaTotal: "",
    espejoAgua: "",
  });

  const [telefonos, setTelefonos] = useState([""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errores, setErrores] = useState({});

  function normalizarNumeroDecimal(valor) {
    const valorLimpio = String(valor).replace(",", ".").replace(/[^0-9.]/g, "");
    const partes = valorLimpio.split(".");
    return partes.length > 1
      ? `${partes[0]}.${partes.slice(1).join("")}`
      : valorLimpio;
  }

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

  const agregarTelefono = () => {
    setTelefonos([...telefonos, ""]);
  };

  const eliminarTelefono = (index) => {
    const nuevosTelefonos = telefonos.filter((_, i) => i !== index);
    setTelefonos(nuevosTelefonos);
  };

  function isTelefonoValido(telefono) {
    return /^\d{8}$/.test(telefono);
  }

  function isNumber(valor) {
    const numero = Number(valor);
    return !isNaN(numero) && numero >= 0;
  }

  const registrarFinca = () => {
    const nuevosErrores = {};
    setErrorMessage("");

    if (!formulario.codigoInterno.trim()) nuevosErrores.codigoInterno = true;
    if (!formulario.nombre.trim()) nuevosErrores.nombre = true;
    if (!formulario.provincia) nuevosErrores.provincia = true;
    if (!formulario.canton) nuevosErrores.canton = true;
    if (!formulario.distrito) nuevosErrores.distrito = true;
    if (!formulario.responsable.trim()) nuevosErrores.responsable = true;

    if (
      !String(formulario.areaTotal).trim() ||
      !isNumber(formulario.areaTotal)
    ) {
      nuevosErrores.areaTotal = true;
      setErrorMessage("El area total debe ser un numero positivo");
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

    crearFinca({ ...formulario, telefonos });
    onFinca();
  };

  const cantones =
    formulario.provincia !== ""
      ? Object.keys(ubicaciones[formulario.provincia] || {})
      : [];
  const distritos =
    formulario.provincia !== "" && formulario.canton !== ""
      ? ubicaciones[formulario.provincia][formulario.canton] || []
      : [];

  const opcionesCantones = cantones.map((canton) => ({
    label: canton,
    value: canton,
  }));
  const opcionesDistritos = distritos.map((distrito) => ({
    label: distrito,
    value: distrito,
  }));

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
    setFormulario,
    telefonos,
    setTelefonos,
    errorMessage,
    errores,
    setErrores,

    actualizarCampo,
    actualizarTelefono,
    agregarTelefono,
    eliminarTelefono,
    registrarFinca,

    cantones,
    distritos,
    opcionesCantones,
    opcionesDistritos,

    isLargeScreen,
  };
}
