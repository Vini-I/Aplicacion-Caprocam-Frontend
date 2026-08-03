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
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { ubicaciones } from "../screens/FincaNuevaData.js";
import { styles } from "../styles/StylesFincaNueva.js";
import { STYLE } from "../../../theme/style.js";
import { COLORS } from "../../../theme/colors.js";
import { useFinca } from "../context/FincaContext";

export function useFincaNueva({ onFinca }) {
  const { crearFinca, ERROR } = useFinca();

  const [formulario, setFormulario] = useState({
    codigoCBO: "",
    nombre: "",
    provincia: "",
    canton: "",
    distrito: "",
    otrasSenas: "",
    responsable: "",
    areaTotal: "",
    espejoAgua: "",
  });

  const [telefonos, setTelefonos] = useState([""]);
  const [errores, setErrores] = useState({});

  function normalizarNumeroDecimal(valor) {
    const valorLimpio = String(valor)
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
      setErrores((actual) => ({ ...actual, [campo]: null }));
    }
  };

  const actualizarTelefono = (index, valor) => {
    const nuevosTelefonos = [...telefonos];
    nuevosTelefonos[index] = String(valor).replace(/\D/g, "").slice(0, 8);
    setTelefonos(nuevosTelefonos);

    if (errores[`telefono${index}`]) {
      setErrores((actual) => ({
        ...actual,
        [`telefono${index}`]: null,
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

  const registrarFinca = useCallback(async () => {
    const nuevosErrores = {};
    const telefonosLimpios = telefonos.map((tel) => String(tel ?? "").trim()).filter((tel) => tel !== "");

    if (!formulario.codigoCBO.trim()) nuevosErrores.codigoCBO = "Código CVO obligatorio";
    if (!formulario.nombre.trim()) nuevosErrores.nombre = "Nombre de la finca obligatorio";
    if (!formulario.provincia) nuevosErrores.provincia = "Provincia obligatoria";
    if (!formulario.canton) nuevosErrores.canton = "Cantón obligatorio";
    if (!formulario.distrito) nuevosErrores.distrito = "Distrito obligatorio";
    if (!formulario.responsable.trim()) nuevosErrores.responsable = "Propietario/Responsable obligatorio";
    if (!formulario.otrasSenas.trim()) nuevosErrores.otrasSenas = "Otras señas obligatorio";

    if (formulario.otrasSenas.trim().length < 10) {
      nuevosErrores.otrasSenas = "Otras señas debe tener al menos 10 caracteres";
    }

    if (!String(formulario.areaTotal).trim() || !isNumber(formulario.areaTotal)) {
      nuevosErrores.areaTotal = "Área total debe ser un número válido";
    }

    if (!String(formulario.espejoAgua).trim() || !isNumber(formulario.espejoAgua)) {
      nuevosErrores.espejoAgua = "Espejo de agua debe ser un número válido";
    }

    for (let i = 0; i < telefonos.length; i++) {
      const tel = String(telefonos[i] ?? "").trim();
      if (tel === "") continue;

      if (!isTelefonoValido(tel)) {
        nuevosErrores[`telefono${i}`] = `Teléfono ${i + 1} inválido. Debe tener 8 dígitos. Ej: 1234 5678`;
      }
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const nuevaFincaDTO = {
      codigoCBO: formulario.codigoCBO,
      nombreFinca: formulario.nombre,
      provincia: formulario.provincia,
      canton: formulario.canton,
      distrito: formulario.distrito,
      otrasSenas: formulario.otrasSenas,
      propietarioResponsable: formulario.responsable,
      telefono: telefonosLimpios,
      areaTotal: Number(formulario.areaTotal),
      espejosAgua: Number(formulario.espejoAgua),
    };

    try {
      await crearFinca(nuevaFincaDTO);
      onFinca();
    } catch (error) {
      // crearFinca setea `ERROR` en el contexto; no relanzamos aquí
      return;
    }
  });

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

  const displayErrorMessage = Object.values(errores || {}).filter(Boolean)[0] || ERROR || null;

  return {
    SectionTitle,
    ContentWrapper,
    formulario,
    setFormulario,
    telefonos,
    setTelefonos,
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

    displayErrorMessage,
  };
}
