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
import { StyleSheet, View, Platform, Text } from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import DateInput from "../../../shared/components/DateInput";

import {
  obtenerFincas,
  obtenerEstanquesPorFinca,
  obtenerProveedoresLarva,
  obtenerTecnicasCultivo,
  obtenerTiposLarva,
} from "../services/SiembraService";

import { COLORS } from "../../../theme/colors";
import { TYPOGRAPHY } from "../../../theme/typography";

function convertDateToWeb(textDate) {
  const parts = textDate.split("/");

  if (parts.length !== 3) {
    return "";
  }

  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

function convertWebDateToText(webDate) {
  const parts = webDate.split("-");

  if (parts.length !== 3) {
    return "";
  }

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}/${month}/${year}`;
}

function getTodayWebDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${year}-${month}-${day}`;
}

export default function SiembraForm({ formData, onChange }) {
  const fincas = obtenerFincas();
  const estanques = obtenerEstanquesPorFinca(formData.finca);
  const proveedoresLarva = obtenerProveedoresLarva();
  const tecnicasCultivo = obtenerTecnicasCultivo();
  const tiposLarva = obtenerTiposLarva();

  function renderInformacionBasica() {
    return (
      <Card title="Información básica" titleStyle={styles.cardTitle}>
        {Platform.OS === "web" ? (
          <View style={styles.webDateContainer}>
            <Text style={styles.webDateLabel}>Fecha de siembra</Text>

            <input
              type="date"
              value={convertDateToWeb(formData.fechaSiembra)}
              max={getTodayWebDate()}
              onChange={(event) =>
                onChange(
                  "fechaSiembra",
                  convertWebDateToText(event.target.value),
                )
              }
              style={styles.webDateInput}
            />
          </View>
        ) : (
          <DateInput
            label="Fecha de siembra"
            value={formData.fechaSiembra}
            onChangeText={(value) => onChange("fechaSiembra", value)}
          />
        )}

        <Input
          label="Hora de ingreso"
          placeholder="Ej: 07:00 a.m."
          value={formData.horaIngreso}
          onChangeText={(value) => onChange("horaIngreso", value)}
        />

        <Select
          label="Finca"
          placeholder="Seleccionar finca"
          options={fincas}
          value={formData.finca}
          onChange={(value) => {
            onChange("finca", value);
            onChange("estanque", "");
          }}
        />

        <Select
          label="Estanque"
          placeholder="Seleccionar estanque"
          options={estanques}
          value={formData.estanque}
          onChange={(value) => onChange("estanque", value)}
          disabled={formData.finca === ""}
        />

        <Select
          label="Proveedor de larva"
          placeholder="Seleccionar proveedor"
          options={proveedoresLarva}
          value={formData.proveedorLarva}
          onChange={(value) => onChange("proveedorLarva", value)}
        />

        <Select
          label="Tipo de larva"
          placeholder="Seleccionar tipo de larva"
          options={tiposLarva}
          value={formData.tipoLarva}
          onChange={(value) => onChange("tipoLarva", value)}
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
  webDateContainer: {
    marginBottom: 12,
  },
  webDateLabel: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  webDateInput: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.white,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
});
