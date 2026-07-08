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
import { useState } from "react";
import { Dimensions, View } from "react-native";
import { provincias, ubicaciones } from "../screens/FincaNuevaData.js";
import { styles } from "../styles/StylesFincaNueva.js";
import { STYLE } from "../../../theme/style.js";
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
  const [errores, setErrores] = useState({});

  const actualizarCampo = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
    if (errores[campo]) {
      setErrores((actual) => ({ ...actual, [campo]: false }));
    }
  };

  const actualizarTelefono = (index, valor) => {
    const nuevosTelefonos = [...telefonos];
    nuevosTelefonos[index] = valor;
    setTelefonos(nuevosTelefonos);
  };

  const agregarTelefono = () => {
    setTelefonos([...telefonos, ""]);
  };

  const eliminarTelefono = (index) => {
    const nuevosTelefonos = telefonos.filter((_, i) => i !== index);
    setTelefonos(nuevosTelefonos);
  };

  const registrarFinca = () => {
    const nuevosErrores = {};

    if (!formulario.codigoInterno.trim()) nuevosErrores.codigoInterno = true;
    if (!formulario.nombre.trim()) nuevosErrores.nombre = true;
    if (!formulario.provincia) nuevosErrores.provincia = true;
    if (!formulario.canton) nuevosErrores.canton = true;
    if (!formulario.distrito) nuevosErrores.distrito = true;
    if (!formulario.responsable.trim()) nuevosErrores.responsable = true;
    if (!formulario.areaTotal.trim()) nuevosErrores.areaTotal = true;
    if (!formulario.espejoAgua.trim()) nuevosErrores.espejoAgua = true;

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

  const ContentWrapper = ({ children }) => (
    <View style={STYLE.contentWrapper}>{children}</View>
  );
  return {
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

    isLargeScreen,
  };
}
