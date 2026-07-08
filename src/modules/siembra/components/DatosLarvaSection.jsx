/**
 * ============================================================
 * COMPONENTE: DATOS DE LARVA
 * ============================================================
 *
 * Renderiza la información relacionada con la larva utilizada
 * en una siembra.
 *
 * FUNCIONALIDAD:
 * - Muestra proveedor, laboratorio, procedencia y lote.
 * - Permite edición según el modo recibido.
 * - Utiliza validaciones visuales del formulario.
 */
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";

import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/SiembraSectionStyles";
import SectionTitle from "./SectionTitle";

export default function DatosLarvaSection({
  formData,
  onChange,
  proveedoresLarva,
  laboratoriosLarva,
  procedenciasLarva,
  plLarva,
  mode = "edit",
  fieldHelpers,
}) {
  const isViewMode = mode === "view";
  const { hasError, requiredLabel } = fieldHelpers;
  const esPreCria =formData.tipoRegistro === "precria";

  return (
    <Card>
      <SectionTitle icon={ICONS.shrimp} title="Datos de larva" />

      <Select
        label={requiredLabel("Proveedor de larva")}
        placeholder="Seleccionar proveedor"
        options={proveedoresLarva}
        value={formData.proveedorLarva}
        onChange={(value) => onChange("proveedorLarva", value)}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("proveedorLarva") ? styles.inputError : null}
        disabled={isViewMode}
      />

      <Select
        label={requiredLabel("Laboratorio")}
        placeholder="Seleccionar laboratorio"
        options={laboratoriosLarva}
        value={formData.laboratorioLarva}
        onChange={(value) => onChange("laboratorioLarva", value)}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("laboratorioLarva") ? styles.inputError : null}
        disabled={isViewMode}
      />

      <Select
        label={requiredLabel("Procedencia de larva")}
        placeholder="Seleccionar procedencia"
        options={procedenciasLarva}
        value={formData.procedenciaLarva}
        onChange={(value) => onChange("procedenciaLarva", value)}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("procedenciaLarva") ? styles.inputError : null}
        disabled={isViewMode}
      />

      <Input
        label={requiredLabel("Código de lote")}
        placeholder="Ej: LARV-2026-001"
        value={formData.codigoLoteLarva}
        onChangeText={(value) => onChange("codigoLoteLarva", value)}
        labelStyle={styles.requiredLabel}
        style={hasError("codigoLoteLarva") ? styles.inputError : null}
        editable={!isViewMode}
      />

      <Select
        label={requiredLabel("PL de Siembra")}
        placeholder="Seleccionar PL"
        options={plLarva}
        value={formData.plSiembra}
        onChange={(value) => onChange("plSiembra", value)}
        labelStyle={styles.requiredLabel}
        selectStyle={hasError("plSiembra") ? styles.inputError : null}
        disabled={isViewMode}
      />

      <Input
        label={requiredLabel("Certificado de larva")}
        placeholder="Ej: CERT-2026-001"
        value={formData.certificadoLarva}
        onChangeText={(value) => onChange("certificadoLarva", value)}
        labelStyle={styles.requiredLabel}
        style={hasError("certificadoLarva") ? styles.inputError : null}
        editable={!isViewMode}
      />
    </Card>
  );
}
