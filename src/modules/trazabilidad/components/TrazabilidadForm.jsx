/**
 * Componente: TrazabilidadForm
 *
 * Formulario reutilizable para capturar el movimiento de un lote
 * de camarón de pre-cría a engorde (registro de Trazabilidad).
 *
 * Funcionalidades principales:
 * - Capturar finca, estanque de origen y estanque de destino.
 * - Capturar fecha del movimiento y colaborador responsable.
 * - Capturar tamaño (gramos), días de siembra y PL.
 * - El estanque de destino excluye al estanque ya elegido como origen,
 *   y viceversa, para evitar que coincidan.
 *
 * Componentes utilizados:
 * - Card: agrupación visual de las secciones del formulario.
 * - Select: selección de finca, estanques y colaborador.
 * - NumberInput: campos numéricos de tamaño, días y PL.
 * - DateInput: fecha del movimiento (no permite fechas futuras).
 */
import { View, Platform } from "react-native";

import Text from "../../../shared/components/Text";
import Card from "../../../shared/components/Card";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import DateInput from "../../../shared/components/DateInput";
import { styles } from "../styles/TrazabilidadFormStyles";

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

export default function TrazabilidadForm({
  formData,
  fincas,
  colaboradores,
  estanquesOrigen,
  estanquesDestino,
  onChange,
  onChangeFinca,
  plAutocompletado = false,
  style,
}) {
  const opcionesOrigen = estanquesOrigen.filter(
    (estanque) => estanque.value !== formData.estanqueDestinoId,
  );

  const opcionesDestino = estanquesDestino.filter(
    (estanque) => estanque.value !== formData.estanqueOrigenId,
  );

  function renderFecha() {
    if (Platform.OS === "web") {
      return (
        <View style={styles.webDateContainer}>
          <Text style={styles.webDateLabel}>Fecha del movimiento</Text>

          <input
            type="date"
            value={convertDateToWeb(formData.fecha)}
            max={getTodayWebDate()}
            onChange={(event) =>
              onChange("fecha", convertWebDateToText(event.target.value))
            }
            style={styles.webDateInput}
          />
        </View>
      );
    }

    return (
      <DateInput
        label="Fecha del movimiento"
        value={formData.fecha}
        onChangeText={(value) => onChange("fecha", value)}
      />
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Card title="Movimiento" titleStyle={styles.cardTitle}>
        <Select
          label="Finca"
          placeholder="Seleccionar finca"
          options={fincas}
          value={formData.fincaId}
          onChange={onChangeFinca}
        />

        <Select
          label="Estanque de origen (Pre-cría)"
          placeholder="Seleccionar estanque de origen"
          options={opcionesOrigen}
          value={formData.estanqueOrigenId}
          onChange={(value) => onChange("estanqueOrigenId", value)}
          disabled={formData.fincaId === ""}
        />

        <Select
          label="Estanque de destino (Engorde)"
          placeholder="Seleccionar estanque de destino"
          options={opcionesDestino}
          value={formData.estanqueDestinoId}
          onChange={(value) => onChange("estanqueDestinoId", value)}
          disabled={formData.fincaId === ""}
        />

        {renderFecha()}

        <Select
          label="Colaborador responsable"
          placeholder="Seleccionar colaborador"
          options={colaboradores}
          value={formData.colaboradorId}
          onChange={(value) => onChange("colaboradorId", value)}
        />
      </Card>

      <Card title="Datos del traslado" titleStyle={styles.cardTitle}>
        <NumberInput
          label="Tamaño (gramos)"
          value={formData.tamaño}
          onChangeText={(value) => onChange("tamaño", value)}
          min={0}
          max={100}
          step={1}
        />

        <NumberInput
          label="Días de siembra"
          value={formData.dias}
          onChangeText={(value) => onChange("dias", value)}
          min={0}
          max={365}
          step={1}
        />

        <NumberInput
          label="PL"
          value={formData.pl}
          onChangeText={(value) => onChange("pl", value)}
          editable={!plAutocompletado}
          min={0}
          max={999999}
          step={1000}
        />
        {plAutocompletado && (
          <Text style={styles.plNote}>
            Valor autocompletado desde la siembra del estanque de origen.
          </Text>
        )}
      </Card>
    </View>
  );
}
