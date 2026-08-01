/*============================================================
 * SCREEN ALIMENTACIONSCREEN
 * ============================================================
 *
 * Pantalla principal del módulo de Alimentación. Toda la lógica
 * (carga de registros, estado del formulario, guardado y
 * feedback del proceso) vive en hooks/useAlimentacionScreen.js;
 * esta screen solo arma la UI a partir de lo que ese hook retorna.
 *
 * Funcionalidad:
 * - Los mensajes de éxito, validación y error se muestran dentro
 *   del formulario, inmediatamente antes del botón Guardar, igual
 *   que en el módulo de Crecimiento.
 * - Después de guardar, el usuario permanece en el módulo para
 *   poder registrar varias alimentaciones consecutivas.
 * - Usa NavbarRegistro (header celeste con botón volver) en vez
 *   del Header.jsx compartido: Header.jsx está diseñado para
 *   pantallas de login (logo + título + subtítulo centrados),
 *   no para navegación con botón volver + ruta contextual.
 *
 * Props principales:
 * - navigation: objeto de navegación (opcional, usado para
 *   recargar datos al enfocar la pantalla).
 * - onBack: callback opcional para volver atrás.
 *
 * Ejemplo:
 * <AlimentacionScreen navigation={navigation} />
 */

import React from "react";
import { View } from "react-native";
import useAlimentacionScreen from "../hooks/useAlimentacionScreen";
import GestionAlimentacion from "./GestionAlimentacion";
import Spinner from "../../../shared/components/Spinner";
import NavbarRegistro from "../../../shared/components/NavbarRegistro";
import { STYLE } from "../../../theme/style";

export default function AlimentacionScreen({ navigation, onBack }) {
  const {
    alimentaciones,
    loading,
    form,
    updateField,
    submitted,
    errores,
    alerta,
    handleGuardar,
  } = useAlimentacionScreen(navigation);

  if (loading) return <Spinner />;

  return (
    <>
      <NavbarRegistro
        Titulo="Alimentación"
        Subtitulo="Registro de alimentación"
        Icono="food"
      />

      <View style={STYLE.container}>
        <GestionAlimentacion
          alimentaciones={alimentaciones}
          form={form}
          updateField={updateField}
          submitted={submitted}
          errores={errores}
          handleGuardar={handleGuardar}
          alerta={alerta}
          onBack={onBack}
        />
      </View>
    </>
  );
} 