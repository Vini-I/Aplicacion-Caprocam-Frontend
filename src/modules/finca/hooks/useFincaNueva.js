import { useState } from "react";
import { Dimensions, View } from "react-native";
import { provincias, ubicaciones } from "../screens/FincaNuevaData.js";
import { styles } from "../styles/StylesFincaNueva.js";
import { STYLE } from "../../../theme/style.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export function useFincaNueva() {
  const [formulario, setFormulario] = useState({
    codigoInterno: "",
    nombre: "",
    provincia: "",
    canton: "",
    distrito: "",
    otrasSenas: "",
    propietario: "",
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
    if (!formulario.otrasSenas.trim()) nuevosErrores.otrasSenas = true;
    if (!formulario.propietario.trim()) nuevosErrores.propietario = true;
    if (!formulario.areaTotal.trim()) nuevosErrores.areaTotal = true;
    if (!formulario.espejoAgua.trim()) nuevosErrores.espejoAgua = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    console.log({ ...formulario, telefonos });
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
