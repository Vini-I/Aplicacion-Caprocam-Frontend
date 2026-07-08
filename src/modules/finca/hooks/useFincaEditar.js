import { useState } from "react";
import { Dimensions, View } from "react-native";
import { styles } from "../styles/StylesFincaNueva.js";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 700;

export function useFincaEditar() {
  const [formulario, setFormulario] = useState({
    nombre: "",
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

    if (!formulario.nombre.trim());
    if (!formulario.otrasSenas.trim());
    if (!formulario.propietario.trim());
    if (!formulario.areaTotal.trim());
    if (!formulario.espejoAgua.trim());

    console.log({ ...formulario, telefonos });
  };

  const ContentWrapper = ({ children }) => (
    <View style={styles.contentWrapper}>{children}</View>
  );

  return {
    ContentWrapper,
    formulario,
    telefonos,
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
