/**
 * ============================================================
 * COMPONENTE: INFORMACIÓN GENERAL
 * ============================================================
 *
 * Renderiza la sección principal de datos generales de una siembra.
 *
 * FUNCIONALIDAD:
 * - Muestra fecha, finca, estanque y técnica de cultivo.
 * - Permite editar campos según el modo recibido.
 * - Utiliza validaciones visuales del formulario.
 * - En modo "view", cada campo se muestra como texto plano
 *   (CampoLectura) en vez de un input/select deshabilitado.
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
 * - Card, NumberInput, Select, DateInput (shared/components).
 * - SectionTitle, CampoLectura.
 *
 * La lógica de negocio permanece en el hook correspondiente.
 */
import Card from "../../../shared/components/Card";
import NumberInput from "../../../shared/components/NumberInput";
import Select from "../../../shared/components/Select";
import DateInput from "../../../shared/components/DateInput";
import CampoLectura from "./CampoLectura";

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

  // formData guarda el id de finca/estanque/técnica, no el nombre.
  // Lo buscamos acá para poder mostrarlo como texto en modo vista.
  const fincaLabel =
    fincas.find((f) => f.value === formData.finca)?.label || "";
  const estanqueLabel =
    estanques.find((e) => e.value === formData.estanque)?.label || "";
  const tecnicaLabel =
    tecnicasCultivo.find((t) => t.value === formData.tecnicaCultivo)?.label ||
    "";

  return (
    <Card>
      <SectionTitle icon={ICONS.calendar} title="Información general" />

      {isViewMode ? (
        <CampoLectura label="Fecha de siembra" value={formData.fechaSiembra} />
      ) : (
        <DateInput
          label={requiredLabel("Fecha de siembra")}
          value={formData.fechaSiembra}
          onChangeText={(value) => onChange("fechaSiembra", value)}
          labelStyle={styles.requiredLabel}
          inputStyle={hasError("fechaSiembra") ? styles.inputError : null}
          allowFutureDates={false}
        />
      )}

      {isViewMode ? (
        <CampoLectura label="Finca" value={fincaLabel} />
      ) : (
        <Select
          label={requiredLabel("Finca")}
          placeholder="Seleccionar finca"
          options={fincas}
          value={formData.finca}
          onChange={onChangeFinca}
          labelStyle={styles.requiredLabel}
          selectStyle={hasError("finca") ? styles.inputError : null}
        />
      )}

      {isViewMode ? (
        <CampoLectura label="Estanque" value={estanqueLabel} />
      ) : (
        <Select
          label={requiredLabel("Estanque")}
          placeholder="Seleccionar estanque"
          options={estanques}
          value={formData.estanque}
          onChange={onChangeEstanque}
          labelStyle={styles.requiredLabel}
          selectStyle={hasError("estanque") ? styles.inputError : null}
          disabled={formData.finca === ""}
        />
      )}

      {isViewMode ? (
        <CampoLectura label="Técnica de cultivo" value={tecnicaLabel} />
      ) : (
        <Select
          label={requiredLabel("Técnica de cultivo")}
          placeholder="Seleccionar técnica"
          options={tecnicasCultivo}
          value={formData.tecnicaCultivo}
          onChange={(value) => onChange("tecnicaCultivo", value)}
          labelStyle={styles.requiredLabel}
          selectStyle={hasError("tecnicaCultivo") ? styles.inputError : null}
        />
      )}

      {isViewMode ? (
        <CampoLectura
          label="Duración estimada del ciclo"
          value={formData.duracionCiclo ? `${formData.duracionCiclo} días` : ""}
        />
      ) : (
        <NumberInput
          label={requiredLabel("Duración estimada del ciclo")}
          value={formData.duracionCiclo}
          onChangeText={(value) => onChange("duracionCiclo", value)}
          min={1}
          max={120}
          step={1}
          labelStyle={styles.requiredLabel}
          style={hasError("duracionCiclo") ? styles.inputError : null}
        />
      )}
      {isViewMode && formData.estado === "Finalizada" && (
        <CampoLectura
          label="Producción"
          value={`${Number(formData.produccionKg ?? 0).toLocaleString()} kg`}
        />
      )}
    </Card>
  );
}
