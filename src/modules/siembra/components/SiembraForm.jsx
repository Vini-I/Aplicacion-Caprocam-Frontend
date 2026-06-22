/**
 * Componente: SiembraForm
 *
 * Formulario reutilizable para capturar la información principal de una siembra.
 *
 * Funcionalidades principales:
 * - Capturar información básica como fecha, hora, estanque y proveedor.
 * - Capturar datos de siembra como cantidad sembrada, certificado,
 *   técnica de cultivo y duración estimada del ciclo.
 * - Organizar los campos en secciones mediante tarjetas.
 *
 * Componentes utilizados:
 * - Card: agrupación visual de las secciones del formulario.
 * - Input: campos de texto y fecha.
 * - Select: selección de estanque, proveedor y técnica de cultivo.
 * - NumberInput: campos numéricos para cantidad y duración del ciclo.
 */
import { StyleSheet, View } from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";

import {
  obtenerEstanques,
  obtenerProveedoresLarva,
  obtenerTecnicasCultivo,
} from "../services/SiembraService";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

export default function SiembraForm({ formData, onChange }) {
  const estanques = obtenerEstanques();
  const proveedoresLarva = obtenerProveedoresLarva();
  const tecnicasCultivo = obtenerTecnicasCultivo();

  function renderInformacionBasica() {
    return (
      <Card title="Información básica" titleStyle={styles.cardTitle}>
        <Input
          label="Fecha de siembra"
          inputType="date"
          value={formData.fechaSiembra}
          onChangeText={(value) => onChange("fechaSiembra", value)}
        />

        <Input
          label="Hora de ingreso"
          placeholder="Ej: 07:00 a.m."
          value={formData.horaIngreso}
          onChangeText={(value) => onChange("horaIngreso", value)}
        />

        <Select
          label="Estanque"
          placeholder="Seleccionar estanque"
          options={estanques}
          value={formData.estanque}
          onChange={(value) => onChange("estanque", value)}
        />

        <Select
          label="Proveedor de larva"
          placeholder="Seleccionar proveedor"
          options={proveedoresLarva}
          value={formData.proveedorLarva}
          onChange={(value) => onChange("proveedorLarva", value)}
        />
      </Card>
    );
  }

  function renderDatosSiembra() {
    return (
      <Card title="Datos de siembra" titleStyle={styles.cardTitle}>
        <NumberInput
          label="Cantidad sembrada"
          value={formData.cantidadSembrada}
          onChangeText={(value) => onChange("cantidadSembrada", value)}
          min={0}
          max={999999}
          step={1000}
        />

        <Input
          label="Certificado de larva"
          placeholder="Ej: 1823092503E"
          value={formData.certificadoLarva}
          onChangeText={(value) => onChange("certificadoLarva", value)}
        />

        <Select
          label="Técnica de cultivo"
          placeholder="Seleccionar técnica"
          options={tecnicasCultivo}
          value={formData.tecnicaCultivo}
          onChange={(value) => onChange("tecnicaCultivo", value)}
        />

        <NumberInput
          label="Duración estimada del ciclo"
          value={formData.diasMaduracion}
          onChangeText={(value) => onChange("diasMaduracion", value)}
          min={1}
          max={90}
          step={1}
        />
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {renderInformacionBasica()}
      {renderDatosSiembra()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  cardTitle: {
    color: COLORS.primary,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
  },
});
