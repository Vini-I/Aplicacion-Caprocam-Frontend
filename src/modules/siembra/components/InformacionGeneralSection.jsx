/**
 * ============================================================
 * COMPONENTE: INFORMACIÓN GENERAL
 * ============================================================
 *
 * Renderiza la sección principal de datos generales de una siembra.
 *
 * FUNCIONALIDAD:
 * - Muestra fecha, hora, finca, estanque y técnica de cultivo.
 * - Permite editar campos según el modo recibido.
 * - Utiliza validaciones visuales del formulario.
 *
 * DATOS:
 * - Recibe formData y onChange desde la screen/hook padre.
 * - No mantiene estado propio ni persiste información.
 *
 * VALIDACIONES:
 * - No calcula errores; solo pinta requiredLabel/hasError según
 *   los valores que le pasa el formulario padre.
 *
 * DEPENDENCIAS:
 * - Card, Input, NumberInput, Select, DateInput (shared/components).
 * - SectionTitle.
 *
 * La lógica de negocio permanece en el hook correspondiente.
 */
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import DateInput from "../../../shared/components/DateInput";

import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/SiembraSectionStyles";
import SectionTitle from "./SectionTitle";

export default function InformacionGeneralSection({
  formData,
  onChange,
  onChangeFinca,
  onChangeEstanque,
  fincas,
  estanques,
  tecnicasCultivo,
  mode = "edit",
  fieldHelpers,
}) {
  const isViewMode = mode === "view";
  const { hasError, requiredLabel } = fieldHelpers;

  return (
    <Card>
      <SectionTitle
        icon={ICONS.calendar}
        title="Información general"
      />

      <DateInput
        label={requiredLabel("Fecha de siembra")}
        value={formData.fechaSiembra}
        onChangeText={(value) => onChange("fechaSiembra", value)}
        labelStyle={styles.requiredLabel}
        inputStyle={hasError("fechaSiembra") ? styles.inputError : null}
        disabled={isViewMode}
      />

      <Input
        label={requiredLabel("Hora de ingreso")}
        placeholder="Ej: 07:00 AM"
        value={formData.horaIngreso}
        onChangeText={(value) => onChange("horaIngreso", value)}
        labelStyle={styles.requiredLabel}
        style={hasError("horaIngreso") ? styles.inputError : null}
        editable={!isViewMode}
      />

      <Select
        label={requiredLabel("Finca")}
        placeholder="Seleccionar finca"
        options={fincas}
        value={formData.finca}
        onChange={onChangeFinca}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("finca") ? styles.inputError : null}
        disabled={isViewMode}
      />

      <Select
        label={requiredLabel("Estanque")}
        placeholder="Seleccionar estanque"
        options={estanques}
        value={formData.estanque}
        onChange={onChangeEstanque}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("estanque") ? styles.inputError : null}
        disabled={isViewMode || formData.finca === ""}
      />

      <Select
        label={requiredLabel("Técnica de cultivo")}
        placeholder="Seleccionar técnica"
        options={tecnicasCultivo}
        value={formData.tecnicaCultivo}
        onChange={(value) => onChange("tecnicaCultivo", value)}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("tecnicaCultivo") ? styles.inputError : null}
        disabled={isViewMode}
      />

      <NumberInput
        label={requiredLabel("Duración estimada del ciclo")}
        value={formData.diasMaduracion}
        onChangeText={(value) => onChange("diasMaduracion", value)}
        min={1}
        max={120}
        step={1}
        labelStyle={styles.requiredLabel}
        style={hasError("diasMaduracion") ? styles.inputError : null}
        editable={!isViewMode}
      />
    </Card>
  );
}