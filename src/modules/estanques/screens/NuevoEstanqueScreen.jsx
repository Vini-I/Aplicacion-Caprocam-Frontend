/**
 * Pantalla: NuevoEstanquePage
 *
 * Esta pantalla permite registrar un nuevo estanque dentro de una finca acuícola.
 * El formulario está diseñado para capturar la información principal necesaria
 * para identificar el estanque, conocer sus dimensiones, registrar datos de
 * siembra y agregar información relacionada con alimentación y equipos.
 *
 * Funcionalidad general:
 * - Muestra un encabezado con la opción de cancelar, el título "Nuevo Estanque"
 *   y el nombre de la finca asociada.
 * - Permite ingresar el código del estanque, seleccionar su estado y definir
 *   el tipo de estanque.
 * - Registra las dimensiones físicas del estanque mediante largo, ancho y
 *   profundidad.
 * - Permite indicar la fuente de agua utilizada, como estero, golfo o reservorio.
 * - Registra datos de siembra como especie, fecha de siembra, densidad de
 *   siembra y uso de precría.
 * - Incluye información de alimentación, proveedor de alimento, número de
 *   aireadores y si el estanque cuenta con alimentador automático.
 * - Valida que los campos principales estén completos antes de registrar.
 * - Muestra mensajes de alerta cuando falta información o cuando el registro
 *   se realiza correctamente.
 *
 * Estados utilizados:
 * - codigo: almacena el código identificador del estanque.
 * - estado: almacena el estado actual del estanque, por ejemplo activo,
 *   en preparación o cosechado.
 * - tipoEstanque: almacena el tipo de estanque seleccionado.
 * - largo, ancho y profundidad: almacenan las dimensiones del estanque.
 * - fuenteAgua: almacena la procedencia del agua utilizada.
 * - especie: almacena la especie cultivada en el estanque.
 * - fechaSiembra: almacena la fecha en que se realiza la siembra.
 * - densidadSiembra: almacena la cantidad de camarones por metro cuadrado.
 * - precria: indica si el estanque utiliza precría o siembra directa.
 * - metodoAlimentacion: almacena el método de alimentación utilizado.
 * - proveedorAlimento: almacena el proveedor del alimento.
 * - numeroAireadores: almacena la cantidad de aireadores disponibles.
 * - tieneAlimentadorAutomatico: indica si se cuenta con alimentador automático.
 * - mensaje: almacena el mensaje que se muestra en pantalla mediante una alerta.
 *
 * Funciones principales:
 * - seleccionarEstado: actualiza el estado seleccionado del estanque.
 * - registrarEstanque: valida los campos obligatorios y construye el objeto
 *   con la información del nuevo estanque.
 * - cancelar: permite regresar a la pantalla anterior usando la navegación.
 *
 * Componentes utilizados:
 * - Card: agrupa visualmente cada sección del formulario.
 * - Input: permite ingresar datos escritos o numéricos.
 * - Select: permite seleccionar opciones predefinidas.
 * - Button: ejecuta la acción de registrar el estanque.
 * - Title: muestra el título principal de la pantalla.
 * - CustomText: muestra textos informativos o etiquetas.
 * - Alert: muestra mensajes de validación o confirmación.
 *
 * Nota:
 * La pantalla solo construye y muestra por consola el objeto del nuevo estanque.
 * Más adelante, este objeto puede enviarse a una API, guardarse en una base de
 * datos o conectarse con el estado global de la aplicación.
 */


import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import Title from "../components/Title";
import CustomText from "../components/Text";
import Alert from "../components/Alert";

export default function NuevoEstanquePage({ navigation }) {
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState("activo");
  const [tipoEstanque, setTipoEstanque] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [profundidad, setProfundidad] = useState("");
  const [fuenteAgua, setFuenteAgua] = useState("");
  const [especie, setEspecie] = useState("litopenaeus_vannamei");
  const [fechaSiembra, setFechaSiembra] = useState("");
  const [densidadSiembra, setDensidadSiembra] = useState("12");
  const [precria, setPrecria] = useState("");
  const [metodoAlimentacion, setMetodoAlimentacion] = useState("");
  const [proveedorAlimento, setProveedorAlimento] = useState("Biomar");
  const [numeroAireadores, setNumeroAireadores] = useState("");
  const [tieneAlimentadorAutomatico, setTieneAlimentadorAutomatico] =
    useState("");
  const [mensaje, setMensaje] = useState("");

  const tiposEstanque = [
    {
      label: "Estanque de tierra semiintensivo",
      value: "tierra_semiintensivo",
    },
    {
      label: "Estanque reservorio",
      value: "reservorio",
    },
    {
      label: "Estanque con geomembrana",
      value: "geomembrana",
    },
    {
      label: "Estanque súperintensivo",
      value: "superintensivo",
    },
  ];

  const fuentesAgua = [
    {
      label: "Estero",
      value: "estero",
    },
    {
      label: "Golfo",
      value: "golfo",
    },
    {
      label: "Reservorio",
      value: "reservorio",
    },
  ];

  const especies = [
    {
      label: "Litopenaeus vannamei - Camarón blanco",
      value: "litopenaeus_vannamei",
    },
  ];

  const opcionesPrecria = [
    {
      label: "Sí, usa precría",
      value: "si",
    },
    {
      label: "No, siembra directa",
      value: "no",
    },
  ];

  const metodosAlimentacion = [
    {
      label: "Manual",
      value: "manual",
    },
    {
      label: "Automático",
      value: "automatico",
    },
    {
      label: "Manual y automático",
      value: "manual_automatico",
    },
  ];

  const opcionesAlimentador = [
    {
      label: "Sí",
      value: "si",
    },
    {
      label: "No",
      value: "no",
    },
  ];

  function seleccionarEstado(nuevoEstado) {
    setEstado(nuevoEstado);
  }

  function registrarEstanque() {
    if (codigo === "") {
      setMensaje("Debe ingresar el código del estanque.");
      return;
    }

    if (tipoEstanque === "") {
      setMensaje("Debe seleccionar el tipo de estanque.");
      return;
    }

    if (largo === "" || ancho === "" || profundidad === "") {
      setMensaje("Debe completar largo, ancho y profundidad.");
      return;
    }

    if (fechaSiembra === "") {
      setMensaje("Debe ingresar la fecha de siembra.");
      return;
    }

    const nuevoEstanque = {
      codigo: codigo,
      estado: estado,
      tipoEstanque: tipoEstanque,
      largo: largo,
      ancho: ancho,
      profundidad: profundidad,
      fuenteAgua: fuenteAgua,
      especie: especie,
      fechaSiembra: fechaSiembra,
      densidadSiembra: densidadSiembra,
      precria: precria,
      metodoAlimentacion: metodoAlimentacion,
      proveedorAlimento: proveedorAlimento,
      numeroAireadores: numeroAireadores,
      tieneAlimentadorAutomatico: tieneAlimentadorAutomatico,
    };

    console.log("Estanque registrado:", nuevoEstanque);

    setMensaje("Estanque registrado correctamente.");
  }

  function cancelar() {
    if (navigation) {
      navigation.goBack();
    }
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={cancelar}>
          <Text style={styles.cancelar}>‹ Cancelar</Text>
        </TouchableOpacity>

        <Title level={3} color="#ffffff" style={styles.headerTitle}>
          Nuevo Estanque
        </Title>

        <CustomText tamano="md" color="#ffffff">
          Finca: Finca La Reina
        </CustomText>
      </View>

      <View style={styles.content}>
        {mensaje !== "" && (
          <View style={styles.alertWrapper}>
            <Alert
              alertWidth="100%"
              alertHeight={48}
              alertColor="#e8f4ff"
              borderColor="#009EF5"
              borderWidth={1}
              borderRadius={12}
              alertMessage={mensaje}
              textColor="#1E3A5F"
              textSize={14}
              textFontWeight="600"
            />
          </View>
        )}

        <Card title="IDENTIFICACIÓN">
          <Input
            label="Código del estanque *"
            value={codigo}
            onChangeText={setCodigo}
            placeholder="Ej: EST-01, E-01, TANQUE-A"
          />

          <Select
            label="Tipo de estanque *"
            options={tiposEstanque}
            value={tipoEstanque}
            onChange={setTipoEstanque}
            placeholder="Seleccione el tipo de estanque"
          />

          <CustomText tamano="sm" color="#1E3A5F">
            Estado
          </CustomText>

          <View style={styles.optionsRow}>
            <EstadoOption
              title="Activo"
              value="activo"
              selectedValue={estado}
              onPress={seleccionarEstado}
            />

            <EstadoOption
              title="En preparación"
              value="preparacion"
              selectedValue={estado}
              onPress={seleccionarEstado}
            />

            <EstadoOption
              title="Cosechado"
              value="cosechado"
              selectedValue={estado}
              onPress={seleccionarEstado}
            />
          </View>
        </Card>

        <Card title="DIMENSIONES">
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Input
                label="Largo (m) *"
                value={largo}
                onChangeText={setLargo}
                placeholder="Ej: 100"
              />
            </View>

            <View style={styles.column}>
              <Input
                label="Ancho (m) *"
                value={ancho}
                onChangeText={setAncho}
                placeholder="Ej: 80"
              />
            </View>
          </View>

          <Input
            label="Profundidad (m) *"
            value={profundidad}
            onChangeText={setProfundidad}
            placeholder="Ej: 0.80"
          />

          <Select
            label="Fuente de agua"
            options={fuentesAgua}
            value={fuenteAgua}
            onChange={setFuenteAgua}
            placeholder="Seleccione la fuente de agua"
          />
        </Card>

        <Card title="SIEMBRA">
          <Select
            label="Especie"
            options={especies}
            value={especie}
            onChange={setEspecie}
            placeholder="Seleccione la especie"
          />

          <Input
            label="Fecha de siembra *"
            value={fechaSiembra}
            onChangeText={setFechaSiembra}
            placeholder="dd/mm/aaaa"
          />

          <Input
            label="Densidad de siembra (ind/m²) *"
            value={densidadSiembra}
            onChangeText={setDensidadSiembra}
            placeholder="Ej: 12"
          />

          <Select
            label="Precría"
            options={opcionesPrecria}
            value={precria}
            onChange={setPrecria}
            placeholder="Seleccione si usa precría"
          />
        </Card>

        <Card title="ALIMENTACIÓN Y EQUIPOS">
          <Select
            label="Método de alimentación"
            options={metodosAlimentacion}
            value={metodoAlimentacion}
            onChange={setMetodoAlimentacion}
            placeholder="Seleccione el método"
          />

          <Input
            label="Proveedor de alimento"
            value={proveedorAlimento}
            onChangeText={setProveedorAlimento}
            placeholder="Ej: Biomar"
          />

          <Input
            label="N° aireadores"
            value={numeroAireadores}
            onChangeText={setNumeroAireadores}
            placeholder="Ej: 4"
          />

          <Select
            label="¿Tiene alimentador automático?"
            options={opcionesAlimentador}
            value={tieneAlimentadorAutomatico}
            onChange={setTieneAlimentadorAutomatico}
            placeholder="Seleccione una opción"
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button title="Registrar estanque" onPress={registrarEstanque} />
        </View>
      </View>
    </ScrollView>
  );
}

function EstadoOption({ title, value, selectedValue, onPress }) {
  let optionStyle = [styles.optionButton];
  let textStyle = [styles.optionText];

  if (value === selectedValue) {
    optionStyle.push(styles.optionSelected);
    textStyle.push(styles.optionTextSelected);
  }

  function presionar() {
    onPress(value);
  }

  return (
    <TouchableOpacity style={optionStyle} onPress={presionar}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },

  header: {
    backgroundColor: "#009EF5",
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  cancelar: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },

  headerTitle: {
    marginBottom: 4,
  },

  content: {
    padding: 18,
  },

  alertWrapper: {
    marginBottom: 16,
  },

  optionsRow: {
    flexDirection: "row",
    gap: 10,
  },

  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D9E2EC",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  optionSelected: {
    borderColor: "#009EF5",
    backgroundColor: "#EAF7FF",
  },

  optionText: {
    color: "#1E3A5F",
    fontSize: 14,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#006DB3",
    fontWeight: "700",
  },

  twoColumns: {
    flexDirection: "row",
    gap: 12,
  },

  column: {
    flex: 1,
  },

  buttonContainer: {
    marginBottom: 32,
  },
});
