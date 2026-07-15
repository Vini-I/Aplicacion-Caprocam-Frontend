/**
 * ============================================================
 * COMPONENTE TRAZABILIDADFORM
 * ============================================================
 *
 * Formulario reutilizable para capturar el movimiento de un lote
 * de camarón de pre-cría a engorde (registro de Trazabilidad).
 *
 * FUNCIONALIDAD:
 * 1. Captura finca, estanque de origen y estanque de destino mediante
 *    Select encadenados (el destino excluye al estanque ya elegido
 *    como origen, y viceversa, para evitar que coincidan).
 * 2. Captura fecha del movimiento y colaborador responsable. En
 *    iOS/Android usa DateInput (calendario nativo); en web usa Input
 *    de texto con formato dd/mm/aaaa, porque el picker nativo que usa
 *    DateInput (@react-native-community/datetimepicker) no tiene
 *    soporte para web.
 * 3. Captura tamaño (gramos), días de siembra y PL.
 * 4. Marca en rojo los campos obligatorios solo después de intentar
 *    guardar (prop `submitted`).
 *
 * COMPONENTES UTILIZADOS:
 * - Card: agrupación visual de las secciones del formulario.
 * - Select: selección de finca, estanques y colaborador.
 * - NumberInput: campos numéricos de tamaño, días y PL.
 * - DateInput: fecha del movimiento en iOS/Android (dd/mm/aaaa).
 * - Input: fallback de fecha en web (dd/mm/aaaa, sin picker nativo).
 *
 * IMPORTANTE:
 * - No modifica el login.
 * - No cambia rutas existentes.
 * - Usa la estructura existente del proyecto.
 * - No se modificó el código de DateInput.jsx; el fallback de web se
 *   resuelve aquí con Platform.OS.
 */
import { View, Platform } from "react-native";

import Text from "../../../shared/components/Text";
import Card from "../../../shared/components/Card";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import { STYLE } from "../../../theme/style";
import { styles } from "../styles/TrazabilidadFormStyles";
import { esFechaValida, esFechaFutura } from "../../../shared/utils/dateUtils";

export default function TrazabilidadForm({
  formData,
  fincas,
  colaboradores,
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
  const mostrarErrorColaborador = submitted && !formData.colaboradorId;
  const mostrarErrorTamano = submitted && (!formData.tamaño || Number(formData.tamaño) <= 0);
  const mostrarErrorDias = submitted && (!formData.dias || Number(formData.dias) <= 0);
  const mostrarErrorPl = submitted && (!formData.pl || Number(formData.pl) <= 0);
  function renderFecha() {
    if (Platform.OS === "web") {
      return (
        <Input
          label="Fecha del movimiento *"
          value={formData.fecha}
          onChangeText={(value) => onChange("fecha", value)}
          containerStyle={styles.field}
          style={mostrarErrorFecha ? styles.errorInput : undefined}
          labelStyle={styles.label}
          keyboardType="numbers-and-punctuation"
          placeholder="dd/mm/aaaa"
        />
      );
    }

    return (
      <DateInput
        label="Fecha del movimiento *"
        value={formData.fecha}
        onChangeText={(value) => onChange("fecha", value)}
        containerStyle={styles.field}
        inputStyle={mostrarErrorFecha ? styles.errorInput : undefined}
        labelStyle={styles.label}
        placeholder="dd/mm/aaaa"
      />
    );
  }

  return (
    
    <View style={[STYLE.contentWrapper]}>
      <Card title="Movimiento" titleStyle={styles.cardTitle} style={styles.movimientoCard}>
        <View style={[styles.selectWrapper, styles.selectWrapperFinca]}>
          <View style={styles.selectContainer}>
            <Select
              label="Finca *"
              placeholder="Seleccionar finca"
              options={fincas}
              value={formData.fincaId}
              onChange={onChangeFinca}
              containerStyle={styles.selectField}
              labelStyle={[styles.label, styles.selectLabel]}
              selectStyle={[
                styles.selectButton,
                mostrarErrorFinca ? styles.errorInput : undefined,
              ]}
            />
          </View>
          <View style={styles.selectPlaceholder} />
        </View>

        <View style={[styles.selectWrapper, styles.selectWrapperOrigen]}>
          <View style={styles.selectContainer}>
            <Select
              label="Estanque de origen (Pre-cría) *"
              placeholder="Seleccionar estanque de origen"
              options={opcionesOrigen}
              value={formData.estanqueOrigenId}
              onChange={(value) => onChange("estanqueOrigenId", value)}
              disabled={formData.fincaId === ""}
              containerStyle={styles.selectField}
              labelStyle={[styles.label, styles.selectLabel]}
              selectStyle={[
                styles.selectButton,
                mostrarErrorOrigen ? styles.errorInput : undefined,
              ]}
            />
          </View>
          <View style={styles.selectPlaceholder} />
        </View>

        <View style={[styles.selectWrapper, styles.selectWrapperDestino]}>
          <View style={styles.selectContainer}>
            <Select
              label="Estanque de destino (Engorde) *"
              placeholder="Seleccionar estanque de destino"
              options={opcionesDestino}
              value={formData.estanqueDestinoId}
              onChange={(value) => onChange("estanqueDestinoId", value)}
              disabled={formData.fincaId === ""}
              containerStyle={styles.selectField}
              labelStyle={[styles.label, styles.selectLabel]}
              selectStyle={[
                styles.selectButton,
                mostrarErrorDestino ? styles.errorInput : undefined,
              ]}
            />
          </View>
          <View style={styles.selectPlaceholder} />
        </View>

        {renderFecha()}

        <View style={[styles.selectWrapper, styles.selectWrapperColaborador]}>
          <View style={styles.selectAbsoluteWrapper}>
            <Select
              label="Colaborador responsable *"
              placeholder="Seleccionar colaborador"
              options={colaboradores}
              value={formData.colaboradorId}
              onChange={(value) => onChange("colaboradorId", value)}
              containerStyle={styles.selectField}
              labelStyle={[styles.label, styles.selectLabel]}
              selectStyle={[
                styles.selectButton,
                mostrarErrorColaborador ? styles.errorInput : undefined,
              ]}
            />
          </View>
          <View style={styles.selectPlaceholder} />
        </View>
      </Card>

      <Card title="Datos del traslado" titleStyle={styles.cardTitle}>
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
            Valor autocompletado desde la siembra del estanque de origen.
          </Text>
        )}
      </Card>
    </View>
  );
}
