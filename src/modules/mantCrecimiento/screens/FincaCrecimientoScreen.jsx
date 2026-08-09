/**
 * ============================================================
 * PANTALLA DE CRECIMIENTO POR FINCA
 * ============================================================
 * Gestiona el registro del peso actual del estanque y muestra
 * información contextual como días de cultivo y peso anterior.
 *
 * Funcionalidad:
 * - Permite seleccionar finca y estanque.
 * - Muestra información relevante del estanque.
 * - Valida campos obligatorios antes de guardar.
 * - Usa componentes compartidos para mantener el estilo del módulo.
 */

import { ScrollView, View } from "react-native";
import { styles } from "../../../modules/mantCrecimiento/styles/CrecimientoStyle.js";
import { STYLE } from "../../../theme/style.js";
import Alert from "../../../shared/components/Alert.jsx";
import BadgeLabel from "../../../shared/components/Badge.jsx";
import Button from "../../../shared/components/Button.jsx";
import Card from "../../../shared/components/Card.jsx";
import Calendario from "../../../shared/components/DateInput.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";
import NumberInput from "../../../shared/components/NumberInput.jsx";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text.jsx";
import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";
import { useFincaCrecimiento } from "../hooks/useFincaCrecimiento.js";

export default function FincaCrecimientoScreen() {
  const {
    fincaSeleccionada,
    estanqueSeleccionado,
    fechaRegistro,
    opcionesFincas,
    estanquesFiltrados,
    setEstanqueSeleccionado,
    setFechaRegistro,
    handleFincaChange,
    calculos,
    cantidadIndividuos,
    pesoTotal,
    totalActual,
    pesoPromedioCalculado,
    editandoId,
    handleCantidadChange,
    handlePesoTotalChange,
    agregarCalculo,
    editarCalculo,
    eliminarCalculo,
    formatearPeso,
    guardarDatos,
    submitted,
    successMessage,
    errorMessage,
    pesoAnteriorLabel,
    mostrarErrorFinca,
    mostrarErrorEstanque,
    mostrarErrorFecha,
    mostrarErrorCalculos,
    errors,
  } = useFincaCrecimiento();

  return (
    <View style={styles.screenContainer}>
      <NavbarRegistro
        Titulo="Crecimiento"
        Subtitulo="Registro de peso"
        Icono="growth"
      />
      <ScrollView
        style={STYLE.container}
        contentContainerStyle={styles.contentScroll}
      >
        <Card style={STYLE.contentWrapper}>
          <Select
            label="Seleccione la finca *"
            placeholder="Seleccione una finca"
            options={opcionesFincas}
            value={fincaSeleccionada}
            onChange={handleFincaChange}
            selectStyle={mostrarErrorFinca ? styles.inputError : null}
          />

          <Select
            label="Seleccione el estanque *"
            placeholder="Seleccione un estanque"
            options={estanquesFiltrados}
            value={estanqueSeleccionado}
            onChange={setEstanqueSeleccionado}
            disabled={
              estanqueSeleccionado !== "" && estanquesFiltrados.length === 0
            }
            selectStyle={mostrarErrorEstanque ? styles.inputError : null}
          />

          <View style={styles.badgeRow}>
            <BadgeLabel
              label={pesoAnteriorLabel}
              variant="warning"
              style={styles.badgeItem}
            />
          </View>

          <View style={styles.inputColumn}>
            <Calendario
              label="Fecha de registro *"
              value={fechaRegistro}
              onChangeText={setFechaRegistro}
              inputStyle={mostrarErrorFecha ? styles.inputError : null}
            />
          </View>

          <View style={styles.seccionCalculos}>
            <Text style={styles.seccionTitulo}>Cálculos registrados</Text>

            {calculos.map((c, index) => (
              <View key={c.id} style={styles.filaCalculo}>
                <Text style={styles.filaCalculoIndex}>{index + 1}</Text>
                <View style={styles.filaCalculoDatos}>
                  <Text style={styles.filaCalculoValor}>{c.cantidad} ind</Text>
                  <Text style={styles.filaCalculoLabel}>Cantidad</Text>
                </View>
                <View style={styles.filaCalculoDatos}>
                  <Text style={styles.filaCalculoValor}>{c.pesoTotal} g</Text>
                  <Text style={styles.filaCalculoLabel}>Peso total</Text>
                </View>
                <View style={styles.filaCalculoDatos}>
                  <Text
                    style={[styles.filaCalculoValor, styles.filaCalculoPromedio]}
                  >
                    {formatearPeso(c.promedio)} g
                  </Text>
                  <Text style={styles.filaCalculoLabel}>Total (g/Cant)</Text>
                </View>
                <View style={styles.filaCalculoAcciones}>
                  <Button
                    variant="outline"
                    onPress={() => editarCalculo(c)}
                    style={styles.btnFila}
                  >
                    <Text style={styles.btnFilaText}>Editar</Text>
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() => eliminarCalculo(c.id)}
                    style={[styles.btnFila, styles.btnFilaEliminar]}
                  >
                    <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
                  </Button>
                </View>
              </View>
            ))}

            <View style={styles.formCalculo}>
              <View style={styles.formCalculoHeader}>
                <Text style={styles.formCalculoTitulo}>
                  {editandoId != null ? "Editar cálculo" : "Cálculo actual"}
                </Text>
                <Button
                  variant="outline"
                  onPress={agregarCalculo}
                  style={styles.btnAgregar}
                >
                  <View style={styles.btnIconRow}>
                    <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
                    <Text style={styles.btnAgregarText}>
                      {editandoId != null
                        ? "Actualizar cálculo"
                        : "Agregar cálculo"}
                    </Text>
                  </View>
                </Button>
              </View>

              <View style={styles.formCalculoCampos}>
                <View style={styles.formCalculoCampo}>
                  <NumberInput
                    label="Cantidad de individuos *"
                    value={cantidadIndividuos}
                    onChangeText={handleCantidadChange}
                    step={1}
                    min={0}
                    max={10000}
                  />
                </View>
                <View style={styles.formCalculoCampo}>
                  <NumberInput
                    label="Peso total (g) *"
                    value={pesoTotal}
                    onChangeText={handlePesoTotalChange}
                    step={0.5}
                    min={0}
                    max={100000}
                  />
                </View>
                <View style={styles.formCalculoCampo}>
                  <Text style={styles.totalLabel}>Total (g/Cant)</Text>
                  <View style={styles.totalReadonly}>
                    <Text style={styles.totalValor}>
                      {totalActual !== null && totalActual > 0
                        ? formatearPeso(totalActual)
                        : "-"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.promedioBox}>
              <Text style={styles.promedioLabel}>PESO PROMEDIO CALCULADO</Text>
              <Text style={styles.promedioValor}>
                {pesoPromedioCalculado !== null
                  ? `${formatearPeso(pesoPromedioCalculado)} g`
                  : "-"}
              </Text>
            </View>
          </View>

          {submitted && errorMessage ? (
            <Alert variant="danger" message={errorMessage} />
          ) : null}
          {submitted && successMessage ? (
            <Alert variant="success" message={successMessage} />
          ) : null}
          {mostrarErrorCalculos ? (
            <Alert variant="danger" message={errors.calculos} />
          ) : null}

          <Button
            variant="outline"
            onPress={guardarDatos}
            style={styles.submitButton}
          >
            <View style={styles.buttonContent}>
              <Icon icon={ICONS.save} size={24} color={COLORS.primary} />
              <Text style={styles.buttonText}>Guardar</Text>
            </View>
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
}
