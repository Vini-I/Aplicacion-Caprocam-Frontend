/**
 * ============================================================
 * COMPONENTE TrazabilidadForm
 * ============================================================
 *
 * Descripción:
 * Formulario reutilizable para capturar el movimiento de un lote de camarón de pre-cría a engorde.
 * Utiliza DateInput de forma unificada para la selección de fecha.
 *
 * @dependencies Select, Input, DateInput, TrazabilidadFormStyles
 * @validations Encadenamiento de estanques, origen != destino, formato de fecha y valores numéricos.
 * @navigation N/A
 */
import { View } from "react-native";

import Text from "../../../shared/components/Text";
import Card from "../../../shared/components/Card";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/TrazabilidadFormStyles";
import {
  esFechaValida,
  esFechaFutura,
} from "../../../shared/utils/dateUtils";

export default function TrazabilidadForm({
  formData,
  fincas,
  colaboradorSesion,
  estanquesOrigen,
  estanquesDestino,
  onChange,
  onChangeFinca,
  plAutocompletado = false,
  submitted = false,
}) {
  const opcionesOrigen = estanquesOrigen.filter(
    (estanque) => estanque.value !== formData.estanqueDestinoId,
  );

  const opcionesDestino = estanquesDestino.filter(
    (estanque) => estanque.value !== formData.estanqueOrigenId,
  );

  const mismoEstanqueOrigenDestino =
    formData.estanqueOrigenId !== "" &&
    formData.estanqueOrigenId === formData.estanqueDestinoId;

  const mostrarErrorFinca = submitted && !formData.fincaId;
  const mostrarErrorOrigen =
    submitted && (!formData.estanqueOrigenId || mismoEstanqueOrigenDestino);
  const mostrarErrorDestino =
    submitted && (!formData.estanqueDestinoId || mismoEstanqueOrigenDestino);
  const mostrarErrorFecha =
    submitted &&
    (!formData.fecha ||
      !esFechaValida(formData.fecha) ||
      esFechaFutura(formData.fecha));
  const mostrarErrorTamano = submitted && (!formData.tamaño || Number(formData.tamaño) <= 0);
  const mostrarErrorDias = submitted && (!formData.dias || Number(formData.dias) <= 0);
  const mostrarErrorPl = submitted && (!formData.pl || Number(formData.pl) <= 0);
  return (

    <View style={[STYLE.contentWrapper]}>
      <Card>
        <View style={styles.cardTitleRow}>
          <Icon icon={ICONS.transfer} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Movimiento</Text>
        </View>
        <Select
          label="Finca *"
          placeholder="Seleccionar finca"
          options={fincas}
          value={formData.fincaId}
          onChange={onChangeFinca}
          containerStyle={styles.field}
          labelStyle={styles.label}
          selectStyle={mostrarErrorFinca ? styles.errorInput : undefined}
        />

        <Select
          label="Estanque de origen (Pre-cría) *"
          placeholder="Seleccionar estanque de origen"
          options={opcionesOrigen}
          value={formData.estanqueOrigenId}
          onChange={(value) => onChange("estanqueOrigenId", value)}
          disabled={formData.fincaId === ""}
          containerStyle={styles.field}
          labelStyle={styles.label}
          selectStyle={mostrarErrorOrigen ? styles.errorInput : undefined}
        />

        <Select
          label="Estanque de destino (Engorde) *"
          placeholder="Seleccionar estanque de destino"
          options={opcionesDestino}
          value={formData.estanqueDestinoId}
          onChange={(value) => onChange("estanqueDestinoId", value)}
          disabled={formData.fincaId === ""}
          containerStyle={styles.field}
          labelStyle={styles.label}
          selectStyle={mostrarErrorDestino ? styles.errorInput : undefined}
        />

        <DateInput
          label="Fecha del movimiento *"
          value={formData.fecha}
          onChangeText={(value) => onChange("fecha", value)}
          containerStyle={styles.field}
          inputStyle={mostrarErrorFecha ? styles.errorInput : undefined}
          labelStyle={styles.label}
          placeholder="dd/mm/aaaa"
        />

        <Input
          label={colaboradorSesion?.labelCampo || "Responsable"}
          value={colaboradorSesion?.nombre || colaboradorSesion?.label || ""}
          editable={false}
          containerStyle={styles.field}
          labelStyle={styles.label}
        />
      </Card>

      <Card>
        <View style={styles.cardTitleRow}>
          <Icon icon={ICONS.clipboard} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Datos del traslado</Text>
        </View>
        <NumberInput
          label="Tamaño (gramos) *"
          value={formData.tamaño}
          onChangeText={(value) => onChange("tamaño", value)}
          min={0}
          max={100}
          step={1}
          containerStyle={styles.field}
          labelStyle={styles.label}
          style={mostrarErrorTamano ? styles.errorInput : undefined}
        />

        <NumberInput
          label="Días de siembra *"
          value={formData.dias}
          onChangeText={(value) => onChange("dias", value)}
          editable={!plAutocompletado}
          min={0}
          max={365}
          step={1}
          containerStyle={styles.field}
          labelStyle={styles.label}
          style={mostrarErrorDias ? styles.errorInput : undefined}
        />

        <NumberInput
          label="PL *"
          value={formData.pl}
          onChangeText={(value) => onChange("pl", value)}
          editable={!plAutocompletado}
          min={0}
          max={999999}
          step={1000}
          containerStyle={styles.field}
          labelStyle={styles.label}
          style={mostrarErrorPl ? styles.errorInput : undefined}
        />
        {plAutocompletado && (
          <Text style={styles.plNote}>
            PL y días autocompletados desde la siembra activa del estanque de origen.
          </Text>
        )}
      </Card>
    </View>
  );
}