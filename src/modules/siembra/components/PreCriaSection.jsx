/**
 * ============================================================
 * COMPONENTE: SECCIÓN DE DETALLE DE PRE-CRÍA (MÓDULO SIEMBRA)
 * ============================================================
 *
 * Renderiza los campos adicionales de pre-cría cuando una siembra
 * ha pasado por esta etapa previa.
 *
 * FUNCIONALIDAD:
 * - Se integra dinámicamente en el formulario principal de siembra.
 * - Sigue estrictamente la gestión de estados de error de Caprocam.
 * - Distingue modo vista/edición y modo autónomo/creación.
 * - En modo "view", cada campo se muestra como texto plano
 *   (CampoLectura) en vez de un input/select deshabilitado.
 *
 * DATOS:
 * - Recibe formData, catálogos (fincas, estanques, plOptions) y
 *   handlers (onChange, onChangeFinca, onChangeEstanque) desde el
 *   hook padre. No mantiene estado propio.
 *
 * VALIDACIONES:
 * - Usa fieldHelpers (hasError, requiredLabel) inyectado por el
 *   padre; ver useFieldValidation.js para el contrato.
 *
 * DEPENDENCIAS:
 * - Card, Input, NumberInput, DateInput, Select (shared/components).
 * - SectionTitle, CampoLectura.
 */
import React from "react";
import Card from "../../../shared/components/Card";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import DateInput from "../../../shared/components/DateInput";
import Select from "../../../shared/components/Select";
import CampoLectura from "./CampoLectura";

import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/SiembraSectionStyles";
import SectionTitle from "./SectionTitle";

export default function PreCriaSection({
  formData,
  onChange,
  onChangeFinca,
  onChangeEstanque,
  fincas = [],
  estanques = [],
  mode = "edit",
  fieldHelpers,
  isAutonomous = false,
  isCreating = false,
  plOptions = [],
}) {
  const isViewMode = mode === "view";
  const { hasError, requiredLabel } = fieldHelpers;

  // formData guarda ids, no nombres. Los buscamos acá para poder
  // mostrarlos como texto en modo vista.
  const fincaLabel =
    fincas.find((f) => f.value === formData.finca)?.label || "";
  const estanqueLabel =
    estanques.find((e) => e.value === formData.estanque)?.label || "";
  const plInicialLabel =
    plOptions.find((p) => p.value === formData.plInicial)?.label ||
    formData.plInicial ||
    "";
  const plFinalLabel =
    plOptions.find((p) => p.value === formData.plFinal)?.label ||
    formData.plFinal ||
    "";

  return (
    <Card>
      <SectionTitle
        icon={ICONS.growth}
        title={
          isAutonomous ? "Datos de Ciclo Pre-Cría" : "Información de Pre-Cría"
        }
      />
      {isAutonomous ? (
        <>
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
            <CampoLectura
              label="Fecha de inicio a Pre-Cría"
              value={formData.fechaInicio}
            />
          ) : (
            <DateInput
              label={requiredLabel("Fecha de inicio a Pre-Cría")}
              value={formData.fechaInicio}
              onChangeText={(value) => onChange("fechaInicio", value)}
              labelStyle={styles.requiredLabel}
              inputStyle={hasError("fechaInicio") ? styles.inputError : null}
            />
          )}

          {isViewMode ? (
            <CampoLectura
              label="Duración en Pre-Cría (Días)"
              value={
                formData.duracionDias ? `${formData.duracionDias} días` : ""
              }
            />
          ) : (
            <NumberInput
              label={requiredLabel("Duración en Pre-Cría (Días)")}
              value={formData.duracionDias}
              onChangeText={(value) => onChange("duracionDias", value)}
              min={1}
              max={30}
              step={1}
              labelStyle={styles.requiredLabel}
              style={hasError("duracionDias") ? styles.inputError : null}
            />
          )}

          {isViewMode ? (
            <CampoLectura
              label="Cantidad inicial ingresada a Pre-Cría"
              value={
                formData.cantidadInicial
                  ? Number(formData.cantidadInicial).toLocaleString()
                  : ""
              }
            />
          ) : (
            <NumberInput
              label={requiredLabel("Cantidad inicial ingresada a Pre-Cría")}
              value={formData.cantidadInicial}
              onChangeText={(value) => onChange("cantidadInicial", value)}
              min={0}
              max={10000000}
              step={1000}
              labelStyle={styles.requiredLabel}
              style={hasError("cantidadInicial") ? styles.inputError : null}
            />
          )}

          {isViewMode ? (
            <CampoLectura
              label="PL Inicial de Pre-Cría"
              value={plInicialLabel}
            />
          ) : (
            <Select
              label={requiredLabel("PL Inicial de Pre-Cría")}
              placeholder="Seleccionar PL"
              options={plOptions}
              value={formData.plInicial}
              onChange={(value) => onChange("plInicial", value)}
              labelStyle={styles.requiredLabel}
              selectStyle={hasError("plInicial") ? styles.inputError : null}
            />
          )}

          {/*
            Datos de cierre del ciclo: solo tienen sentido cuando la
            Pre-Cría ya existe y se está editando/finalizando (pantalla
            de Detalle). Al crearla por primera vez todavía no se
            conocen (no ha terminado el ciclo), así que ni siquiera
            se muestran.
          */}
          {!isCreating && (
            <>
              {isViewMode ? (
                <CampoLectura
                  label="Fecha de salida de Pre-Cría"
                  value={formData.fechaFin}
                />
              ) : (
                <DateInput
                  label={requiredLabel("Fecha de salida de Pre-Cría")}
                  value={formData.fechaFin}
                  onChangeText={(value) => onChange("fechaFin", value)}
                  inputStyle={hasError("fechaFin") ? styles.inputError : null}
                  labelStyle={styles.requiredLabel}
                />
              )}

              {isViewMode ? (
                <CampoLectura
                  label="Cantidad final / sobreviviente de Pre-Cría"
                  value={
                    formData.cantidadFinal
                      ? Number(formData.cantidadFinal).toLocaleString()
                      : ""
                  }
                />
              ) : (
                <NumberInput
                  label={requiredLabel(
                    "Cantidad final / sobreviviente de Pre-Cría",
                  )}
                  value={formData.cantidadFinal}
                  onChangeText={(value) => onChange("cantidadFinal", value)}
                  min={0}
                  max={10000000}
                  step={1000}
                  style={hasError("cantidadFinal") ? styles.inputError : null}
                  labelStyle={styles.requiredLabel}
                />
              )}

              {isViewMode ? (
                <CampoLectura
                  label="PL Final de Pre-Cría"
                  value={plFinalLabel}
                />
              ) : (
                <Select
                  label={requiredLabel("PL Final de Pre-Cría")}
                  placeholder="Seleccionar PL"
                  options={plOptions}
                  value={formData.plFinal}
                  onChange={(value) => onChange("plFinal", value)}
                  selectStyle={hasError("plFinal") ? styles.inputError : null}
                  labelStyle={styles.requiredLabel}
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          {isViewMode ? (
            <CampoLectura
              label="Duración en Pre-Cría (Días)"
              value={
                formData.duracionPrecria
                  ? `${formData.duracionPrecria} días`
                  : ""
              }
            />
          ) : (
            <NumberInput
              label={requiredLabel("Duración en Pre-Cría (Días)")}
              value={formData.duracionPrecria}
              onChangeText={(value) => onChange("duracionPrecria", value)}
              min={1}
              max={30}
              step={1}
              labelStyle={styles.requiredLabel}
              style={hasError("duracionPrecria") ? styles.inputError : null}
            />
          )}

          {isViewMode ? (
            <CampoLectura
              label="Fecha de salida de Pre-Cría"
              value={formData.fechaSalidaPrecria}
            />
          ) : (
            <DateInput
              label={requiredLabel("Fecha de salida de Pre-Cría")}
              value={formData.fechaSalidaPrecria}
              onChangeText={(value) => onChange("fechaSalidaPrecria", value)}
              labelStyle={styles.requiredLabel}
              inputStyle={
                hasError("fechaSalidaPrecria") ? styles.inputError : null
              }
            />
          )}

          {isViewMode ? (
            <CampoLectura
              label="Cantidad sobreviviente de Pre-Cría"
              value={
                formData.cantidadSobrevivientePrecria
                  ? Number(
                      formData.cantidadSobrevivientePrecria,
                    ).toLocaleString()
                  : ""
              }
            />
          ) : (
            <Input
              label={requiredLabel("Cantidad sobreviviente de Pre-Cría")}
              placeholder="Ej: 450000"
              keyboardType="numeric"
              value={formData.cantidadSobrevivientePrecria}
              onChangeText={(value) =>
                onChange("cantidadSobrevivientePrecria", value)
              }
              labelStyle={styles.requiredLabel}
              style={
                hasError("cantidadSobrevivientePrecria")
                  ? styles.inputError
                  : null
              }
            />
          )}
        </>
      )}
    </Card>
  );
}
