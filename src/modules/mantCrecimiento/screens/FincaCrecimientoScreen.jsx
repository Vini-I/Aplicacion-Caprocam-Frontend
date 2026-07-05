import { ScrollView, View } from "react-native";
import { styles } from "../../../modules/mantCrecimiento/styles/CrecimientoStyle.js";
import Card from "../../../shared/components/Card.jsx";
import Input from "../../../shared/components/Input.jsx";
import Text from "../../../shared/components/Text.jsx";
import Button from "../../../shared/components/Button.jsx";
import Select from "../../../shared/components/Select";
import { COLORS } from "../../../theme/colors.js";
import BadgeLabel from "../../../shared/components/Badge.jsx";
import Title from "../../../shared/components/Title.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import { ICONS } from "../../../theme/icons.js";
import NumberInput from "../../../shared/components/NumberInput.jsx";
import { useFincaCrecimiento } from "../hooks/useFincaCrecimiento.js";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";

export default function FincaCrecimientoScreen() {
  const {
    fincaSeleccionada,
    estanqueSeleccionado,
    pesoActual,
    opcionesFincas,
    estanquesFiltrados,
    estanqueSeleccionadoObj,
    estanque,
    setEstanqueSeleccionado,
    setPesoActual,
    handleFincaChange,
    guardarDatos,
  } = useFincaCrecimiento();

  if (!estanque) {
    return (
      <ScrollView style={styles.contentWrapper}>
        <Card>
          <Text>No se encontró un estanque válido.</Text>
        </Card>
      </ScrollView>
    );
  }

  return (
    <>
    <NavbarRegistro
      Titulo="Crecimiento"
      Subtitulo="Registro de peso"
      Icono="growth"
    />
    <ScrollView style={styles.container}>
      <Card  style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <Icon
            icon={ICONS.growth}
            size={22}
            color={COLORS.primary}
            style={styles.headerIcon}
          />
          <Text style={styles.cardTitle}>
            Peso y crecimiento
          </Text>
        </View>

        <Select
          label="Seleccione la finca"
          placeholder="Seleccione una finca"
          options={opcionesFincas}
          value={fincaSeleccionada}
          onChange={handleFincaChange}
        />

        <Select
          label="Seleccione el estanque"
          placeholder="Seleccione un estanque"
          options={estanquesFiltrados}
          value={estanqueSeleccionado}
          onChange={setEstanqueSeleccionado}
          disabled={
            estanqueSeleccionado !== "" && estanquesFiltrados.length === 0
          }
        />

        <View style={styles.badgeRow}>
          <BadgeLabel
            label={"Días de cultivo: " + (estanqueSeleccionadoObj?.diasCultivo ?? "-")}
            variant="success"
          />
        </View>

        <View style={styles.inputColumn}>
          <View style={styles.inputItem}>
            <Title level={5}>Peso actual (g)</Title>
            <NumberInput
              style={styles.sameInput}
              value={pesoActual}
              onChangeText={setPesoActual}
              
              step={0.5}
              min={0}
              max={1000}
            />
          </View>

          {/* querido greivin  o equipo de backend esto es para mostrar el peso de la semana anterior,  
          se supone que lo ideal es que guarde el valor y despues se cargue */}
          <View style={styles.inputItem}>
            <Title level={5}>Peso anterior (g)</Title>
            <Input
              disableInput={true}
              editable={false}
              value={
                estanque.pesoSemanaAnterior
                  ? estanque.pesoSemanaAnterior.toString()
                  : "Semana Anterior"}
              style={[styles.sameInput, { borderColor: COLORS.primary }]}
            />
          </View>
        </View>
        <Button onPress={guardarDatos}>Guardar</Button>
      </Card>
    </ScrollView>
    </>
  );
}