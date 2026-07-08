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
import { View, Platform, Text } from "react-native";

import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import DateInput from "../../../shared/components/DateInput";
import { styles } from "../styles/SiembraFormStyles";

import {
  obtenerFincas,
  obtenerEstanquesPorFinca,
  obtenerEstanquePorCodigo,
  obtenerProveedoresLarva,
  obtenerTecnicasCultivo,
  obtenerLaboratoriosLarva,
  obtenerProcedenciasLarva,
  obtenerPLLarva,
  obtenerOpcionesPrecria,
} from "../services/SiembraService";

function convertDateToWeb(textDate) {
  const parts = textDate.split("/");

  if (parts.length !== 3) return "";

  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

function convertWebDateToText(webDate) {
  const parts = webDate.split("-");

  if (parts.length !== 3) return "";

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
  const laboratoriosLarva = obtenerLaboratoriosLarva();
  const procedenciasLarva = obtenerProcedenciasLarva();
  const plLarva = obtenerPLLarva();
  const opcionesPrecria = obtenerOpcionesPrecria();

  function handleChangeEstanque(value) {
    const estanqueSeleccionado = obtenerEstanquePorCodigo(
      formData.finca,
      value,
    );

    onChange("estanque", value);
    onChange("areaHectareas", estanqueSeleccionado?.areaHectareas ?? "");
  }

  function renderInformacionGeneral() {
    return (
      <Card title="Información general" titleStyle={styles.cardTitle}>
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
            onChange("areaHectareas", "");
            onChange("cantidadSembrada", "");
          }}
        />

        <Select
          label="Estanque"
          placeholder="Seleccionar estanque"
          options={estanques}
          value={formData.estanque}
          onChange={handleChangeEstanque}
          disabled={formData.finca === ""}
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
          max={120}
          step={1}
        />
      </Card>
    );
  }

  function renderDatosLarva() {
    return (
      <Card title="Datos de larvas" titleStyle={styles.cardTitle}>
        <Select
          label="Proveedor de larva"
          placeholder="Seleccionar proveedor"
          options={proveedoresLarva}
          value={formData.proveedorLarva}
          onChange={(value) => onChange("proveedorLarva", value)}
        />

        <Select
          label="Laboratorio"
          placeholder="Seleccionar laboratorio"
          options={laboratoriosLarva}
          value={formData.laboratorioLarva}
          onChange={(value) => onChange("laboratorioLarva", value)}
        />

        <Select
          label="Procedencia de larva"
          placeholder="Seleccionar procedencia"
          options={procedenciasLarva}
          value={formData.procedenciaLarva}
          onChange={(value) => onChange("procedenciaLarva", value)}
        />

        <Input
          label="Código de lote"
          placeholder="Ej: LARV-2026-001"
          value={formData.codigoLoteLarva}
          onChangeText={(value) => onChange("codigoLoteLarva", value)}
        />

        <Select
          label="PL de larva"
          placeholder="Seleccionar PL"
          options={plLarva}
          value={formData.plLarva}
          onChange={(value) => onChange("plLarva", value)}
        />

        <Input
          label="Certificado de larva"
          placeholder="Ej: CERT-2026-001"
          value={formData.certificadoLarva}
          onChangeText={(value) => onChange("certificadoLarva", value)}
        />
      </Card>
    );
  }
  function renderPrecriaPrevia() {
    return (
      <Card title="Pre-cría previa" titleStyle={styles.cardTitle}>
        <Select
          label="¿La larva proviene de una pre-cría?"
          placeholder="Seleccionar opción"
          options={opcionesPrecria}
          value={formData.pasoPorPrecria}
          onChange={(value) => {
            onChange("pasoPorPrecria", value);

            if (value === "no") {
              onChange("duracionPrecria", "");
              onChange("fechaSalidaPrecria", "");
              onChange("cantidadSobrevivientePrecria", "");
            }
          }}
        />

        {formData.pasoPorPrecria === "si" && (
          <>
            <NumberInput
              label="Duración de pre-cría"
              value={formData.duracionPrecria}
              onChangeText={(value) => onChange("duracionPrecria", value)}
              min={1}
              max={60}
              step={1}
            />

            {Platform.OS === "web" ? (
              <View style={styles.webDateContainer}>
                <Text style={styles.webDateLabel}>
                  Fecha de salida de pre-cría
                </Text>

                <input
                  type="date"
                  value={convertDateToWeb(formData.fechaSalidaPrecria)}
                  max={getTodayWebDate()}
                  onChange={(event) =>
                    onChange(
                      "fechaSalidaPrecria",
                      convertWebDateToText(event.target.value),
                    )
                  }
                  style={styles.webDateInput}
                />
              </View>
            ) : (
              <DateInput
                label="Fecha de salida de pre-cría"
                value={formData.fechaSalidaPrecria}
                onChangeText={(value) => onChange("fechaSalidaPrecria", value)}
              />
            )}

            <NumberInput
              label="Cantidad sobreviviente (opcional)"
              value={formData.cantidadSobrevivientePrecria}
              onChangeText={(value) =>
                onChange("cantidadSobrevivientePrecria", value)
              }
              min={0}
              max={9999999}
              step={1000}
            />
          </>
        )}
      </Card>
    );
  }
  function renderCalculoPoblacion() {
    const areaMostrada = formData.areaHectareas
      ? `${formData.areaHectareas} ha`
      : "Seleccione un estanque";

    const densidadMostrada = formData.densidadPoblacional
      ? `${formData.densidadPoblacional} PL/m²`
      : "0 PL/m²";

    const cantidadMostrada = formData.cantidadSembrada
      ? Number(formData.cantidadSembrada).toLocaleString()
      : "0";

    return (
      <Card title="Cálculo de población" titleStyle={styles.cardTitle}>
        <View style={styles.calculationBox}>
          <Text style={styles.calculationLabel}>Área del estanque</Text>
          <Text style={styles.calculationValue}>{areaMostrada}</Text>
        </View>

        <NumberInput
          label={`Densidad poblacional (${densidadMostrada})`}
          value={formData.densidadPoblacional}
          onChangeText={(value) => onChange("densidadPoblacional", value)}
          min={1}
          max={30}
          step={1}
        />

        <View style={styles.calculationBox}>
          <Text style={styles.calculationLabel}>
            Cantidad sembrada calculada
          </Text>
          <Text style={styles.calculationValue}>
            {cantidadMostrada} camarones
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {renderInformacionGeneral()}
      {renderPrecriaPrevia()}
      {renderDatosLarva()}
      {renderCalculoPoblacion()}
    </View>
  );
}
