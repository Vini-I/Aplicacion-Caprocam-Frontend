import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  ScrollView,
  Text,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";

import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import DateInput from "../../../shared/components/DateInput";
import Select from "../../../shared/components/Select";
import ProgressBar from "../../../shared/components/ProgressBar";
import Alert from "../../../shared/components/Alert";
import NumberInput from "../../../shared/components/NumberInput";
import Icon from "../../../shared/components/Icons";

import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/DetalleSiembraStyles";
import useDetalleSiembra from "../hooks/useDetalleSiembra";

import {
  obtenerProveedoresLarva,
  obtenerTecnicasCultivo,
  obtenerLaboratoriosLarva,
  obtenerProcedenciasLarva,
  obtenerPLLarva,
  obtenerOpcionesPrecria,
} from "../services/SiembraService";

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

function convertirADdMmAaaa(fechaIso) {
  const partes = fechaIso.split("-");

  if (partes.length !== 3) return "";

  const anio = partes[0];
  const mes = partes[1];
  const dia = partes[2];

  return `${dia}/${mes}/${anio}`;
}

function convertirAAaaaMmDd(fechaTexto) {
  const partes = fechaTexto.split("/");

  if (partes.length !== 3) return "";

  const dia = partes[0];
  const mes = partes[1];
  const anio = partes[2];

  return `${anio}-${mes}-${dia}`;
}

export default function DetalleSiembraScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const {
    siembra,
    formData,
    isEditing,
    mensaje,
    mensajeVariant,
    diaActual,
    totalDias,
    etapa,
    progreso,
    handleChange,
    iniciarEdicion,
    cancelarEdicion,
    guardar,
  } = useDetalleSiembra(id);

  const proveedoresLarva = obtenerProveedoresLarva();
  const tecnicasCultivo = obtenerTecnicasCultivo();
  const laboratoriosLarva = obtenerLaboratoriosLarva();
  const procedenciasLarva = obtenerProcedenciasLarva();
  const plLarva = obtenerPLLarva();
  const opcionesPrecria = obtenerOpcionesPrecria();

  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  function regresarASiembra() {
    router.push("/siembra");
  }

  function renderDateField(label, field) {
    if (Platform.OS === "web") {
      return (
        <View style={styles.webDateContainer}>
          <Text style={styles.webDateLabel}>{label}</Text>

          <input
            type="date"
            value={convertirAAaaaMmDd(formData[field])}
            max={convertirAAaaaMmDd(obtenerFechaActual())}
            onChange={(event) =>
              handleChange(field, convertirADdMmAaaa(event.target.value))
            }
            style={styles.webDateInput}
          />
        </View>
      );
    }

    return (
      <DateInput
        label={label}
        value={formData[field]}
        onChangeText={(value) => handleChange(field, value)}
        inputStyle={styles.inputEditing}
        labelStyle={styles.labelNombre}
      />
    );
  }

  function renderReadInput(label, value) {
    return (
      <Input
        label={label}
        value={String(value ?? "")}
        editable={false}
        style={styles.inputNombre}
        labelStyle={styles.labelNombre}
      />
    );
  }

  if (!siembra || !formData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable onPress={regresarASiembra} style={styles.backButton}>
              <Icon icon={ICONS.exit} size={22} style={styles.headerIcon} />
            </Pressable>

            <View>
              <Text style={styles.headerSubtitle}>Detalle de Siembra</Text>
              <Text style={styles.headerTitle}>Siembra no encontrada</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={regresarASiembra} style={styles.backButton}>
            <Icon icon={ICONS.exit} size={22} style={styles.headerIcon} />
          </Pressable>

          <View>
            <Text style={styles.headerSubtitle}>Detalle de Siembra</Text>
            <Text style={styles.headerTitle}>
              {formData.estanque} – {formData.finca}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mensaje !== "" && (
          <Alert
            message={mensaje}
            variant={mensajeVariant}
            style={styles.alert}
          />
        )}

        <Card>
          <View style={styles.resumenHeader}>
            <View style={styles.iconContainer}>
              <Icon icon={ICONS.shrimp} size={28} style={styles.summaryIcon} />
            </View>

            <View style={styles.resumenInfo}>
              <Badge
                label={`Día ${diaActual} de ${totalDias}`}
                variant="success"
                textStyle={styles.badgeText}
              />

              <Text style={styles.siembraTitle}>
                Siembra #{siembra.siembraId}
              </Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Avance del ciclo</Text>
          <ProgressBar progress={progreso} />

          <Text style={styles.subtitle}>Estado de Etapa</Text>

          <View style={styles.etapas}>
            <Badge
              label="Siembra"
              variant={etapa >= 1 ? "success" : undefined}
              style={isWeb ? styles.badgeEtapa : undefined}
              textStyle={styles.badgeText}
            />
            <Badge
              label="Maduración"
              variant={etapa >= 2 ? "warning" : undefined}
              style={isWeb ? styles.badgeEtapa : undefined}
              textStyle={styles.badgeText}
            />
            <Badge
              label="Cosecha"
              variant={etapa >= 3 ? "success" : undefined}
              style={isWeb ? styles.badgeEtapa : undefined}
              textStyle={styles.badgeText}
            />
          </View>
        </Card>

        <Card title="Información general" titleStyle={styles.cardTitle}>
          {!isEditing ? (
            <>
              <DateInput
                label="Fecha de siembra"
                value={formData.fechaSiembra}
                disabled={true}
                inputStyle={styles.dateInputLectura}
                textStyle={styles.dateInputTexto}
                labelStyle={styles.labelNombre}
              />

              {renderReadInput("Hora de ingreso", formData.horaIngreso)}
              {renderReadInput("Finca", formData.finca)}
              {renderReadInput("Estanque", formData.estanque)}

              <Select
                label="Técnica de cultivo"
                options={tecnicasCultivo}
                value={formData.tecnicaCultivo}
                disabled={true}
                selectStyle={styles.selectVista}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <NumberInput
                label="Duración estimada del ciclo"
                value={formData.diasMaduracion}
                editable={false}
                style={styles.inputNombre}
                labelStyle={styles.labelNombre}
                min={0}
                max={120}
              />
            </>
          ) : (
            <>
              {renderDateField("Fecha de siembra", "fechaSiembra")}

              <Input
                label="Hora de ingreso"
                value={formData.horaIngreso}
                onChangeText={(value) => handleChange("horaIngreso", value)}
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
              />

              {renderReadInput("Finca", formData.finca)}
              {renderReadInput("Estanque", formData.estanque)}

              <Select
                label="Técnica de cultivo"
                options={tecnicasCultivo}
                value={formData.tecnicaCultivo}
                onChange={(value) => handleChange("tecnicaCultivo", value)}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <NumberInput
                label="Duración estimada del ciclo"
                value={formData.diasMaduracion}
                onChangeText={(value) => handleChange("diasMaduracion", value)}
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
                min={1}
                max={120}
              />
            </>
          )}
        </Card>

        <Card title="Pre-cría previa" titleStyle={styles.cardTitle}>
          {!isEditing ? (
            <>
              <Select
                label="¿La larva proviene de una pre-cría?"
                options={opcionesPrecria}
                value={formData.pasoPorPrecria}
                disabled={true}
                selectStyle={styles.selectVista}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              {formData.pasoPorPrecria === "si" && (
                <>
                  {renderReadInput(
                    "Duración de pre-cría",
                    `${formData.duracionPrecria} días`,
                  )}

                  <DateInput
                    label="Fecha de salida de pre-cría"
                    value={formData.fechaSalidaPrecria}
                    disabled={true}
                    inputStyle={styles.dateInputLectura}
                    textStyle={styles.dateInputTexto}
                    labelStyle={styles.labelNombre}
                  />

                  {formData.cantidadSobrevivientePrecria !== "" &&
                    renderReadInput(
                      "Cantidad sobreviviente",
                      `${Number(
                        formData.cantidadSobrevivientePrecria,
                      ).toLocaleString()} camarones`,
                    )}
                </>
              )}
            </>
          ) : (
            <>
              <Select
                label="¿La larva proviene de una pre-cría?"
                options={opcionesPrecria}
                value={formData.pasoPorPrecria}
                onChange={(value) => handleChange("pasoPorPrecria", value)}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              {formData.pasoPorPrecria === "si" && (
                <>
                  <NumberInput
                    label="Duración de pre-cría"
                    value={formData.duracionPrecria}
                    onChangeText={(value) =>
                      handleChange("duracionPrecria", value)
                    }
                    style={styles.inputEditing}
                    labelStyle={styles.labelNombre}
                    min={1}
                    max={60}
                  />

                  {renderDateField(
                    "Fecha de salida de pre-cría",
                    "fechaSalidaPrecria",
                  )}

                  <NumberInput
                    label="Cantidad sobreviviente (opcional)"
                    value={formData.cantidadSobrevivientePrecria}
                    onChangeText={(value) =>
                      handleChange("cantidadSobrevivientePrecria", value)
                    }
                    style={styles.inputEditing}
                    labelStyle={styles.labelNombre}
                    min={0}
                    max={9999999}
                    step={1000}
                  />
                </>
              )}
            </>
          )}
        </Card>

        <Card title="Datos de larva" titleStyle={styles.cardTitle}>
          {!isEditing ? (
            <>
              <Select
                label="Proveedor de larva"
                options={proveedoresLarva}
                value={formData.proveedorLarva}
                disabled={true}
                selectStyle={styles.selectVista}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <Select
                label="Laboratorio"
                options={laboratoriosLarva}
                value={formData.laboratorioLarva}
                disabled={true}
                selectStyle={styles.selectVista}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <Select
                label="Procedencia de larva"
                options={procedenciasLarva}
                value={formData.procedenciaLarva}
                disabled={true}
                selectStyle={styles.selectVista}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              {renderReadInput("Código de lote", formData.codigoLoteLarva)}

              <Select
                label="PL de larva"
                options={plLarva}
                value={formData.plLarva}
                disabled={true}
                selectStyle={styles.selectVista}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              {renderReadInput(
                "Certificado de larva",
                formData.certificadoLarva,
              )}
            </>
          ) : (
            <>
              <Select
                label="Proveedor de larva"
                options={proveedoresLarva}
                value={formData.proveedorLarva}
                onChange={(value) => handleChange("proveedorLarva", value)}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <Select
                label="Laboratorio"
                options={laboratoriosLarva}
                value={formData.laboratorioLarva}
                onChange={(value) => handleChange("laboratorioLarva", value)}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <Select
                label="Procedencia de larva"
                options={procedenciasLarva}
                value={formData.procedenciaLarva}
                onChange={(value) => handleChange("procedenciaLarva", value)}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <Input
                label="Código de lote"
                value={formData.codigoLoteLarva}
                onChangeText={(value) => handleChange("codigoLoteLarva", value)}
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
              />

              <Select
                label="PL de larva"
                options={plLarva}
                value={formData.plLarva}
                onChange={(value) => handleChange("plLarva", value)}
                labelStyle={styles.labelSelect}
                selectedTextStyle={styles.textoSeleccionado}
                optionTextStyle={styles.textoOpciones}
              />

              <Input
                label="Certificado de larva"
                value={formData.certificadoLarva}
                onChangeText={(value) =>
                  handleChange("certificadoLarva", value)
                }
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
              />
            </>
          )}
        </Card>

        <Card title="Cálculo de población" titleStyle={styles.cardTitle}>
          {renderReadInput("Área del estanque", `${formData.areaHectareas} ha`)}

          {!isEditing ? (
            <>
              {renderReadInput(
                "Densidad poblacional",
                `${formData.densidadPoblacional} PL/m²`,
              )}

              {renderReadInput(
                "Cantidad sembrada calculada",
                `${Number(formData.cantidadSembrada).toLocaleString()} camarones`,
              )}
            </>
          ) : (
            <>
              <NumberInput
                label={`Densidad poblacional (${formData.densidadPoblacional} PL/m²)`}
                value={formData.densidadPoblacional}
                onChangeText={(value) =>
                  handleChange("densidadPoblacional", value)
                }
                style={styles.inputEditing}
                labelStyle={styles.labelNombre}
                min={1}
                max={30}
                step={1}
              />

              {renderReadInput(
                "Cantidad sembrada calculada",
                `${Number(formData.cantidadSembrada).toLocaleString()} camarones`,
              )}
            </>
          )}
        </Card>

        {!isEditing ? (
          <Button onPress={iniciarEdicion} textStyle={styles.textoBoton}>
            Editar
          </Button>
        ) : (
          <View style={styles.actions}>
            <Button
              style={styles.button}
              onPress={guardar}
              textStyle={styles.textoBoton}
            >
              Guardar
            </Button>

            <Button
              variant="outline"
              style={styles.button}
              onPress={cancelarEdicion}
              textStyle={styles.textoBoton}
            >
              Cancelar
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
