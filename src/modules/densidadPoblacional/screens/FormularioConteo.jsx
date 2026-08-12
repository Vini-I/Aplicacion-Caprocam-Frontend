/**
 * ============================================================
 * SCREEN FORMULARIOCONTEO
 * ============================================================
 *
 * Formulario de datos de conteo dentro del modulo de Densidad
 * Poblacional.
 *
 * CAMBIO (documento de requerimientos):
 *
 * El conteo ahora se registra TIRO POR TIRO (ver TirosAtarraya.jsx)
 * y el formulario muestra los resultados que antes el usuario
 * tenia que calcular a mano.
 *
 * Campos que dejaron de digitarse y ahora se calculan:
 * - "Total de camarones contados": es la suma de los tiros.
 * - "Tiros de atarraya": es la cantidad de tiros registrados.
 * - "Promedio por tiro": el documento lo define como derivado
 *   (total / cantidad de tiros), no como un dato que se ingresa.
 *
 * Ademas se muestran, de solo lectura, los dos resultados que pide
 * el documento y que antes no se veian en ninguna parte:
 * - Densidad por m2   = camarones / area muestreada
 * - Poblacion total   = densidad x (hectareas x 10 000)
 *
 * CAMBIO: `supervivencia` no se digita. Se muestra como un resultado
 * de solo lectura y se actualiza automaticamente con los datos del
 * conteo. El backend vuelve a calcularla al guardar.
 *
 * Funcionalidad:
 * - Recibe todo su estado como props (desde useDensidadPoblacional,
 *   via DensidadPoblacionalScreen -> DatosConteo).
 * - Usa la prop nativa `label` de Input/Select en vez de <Text>
 *   manuales, para poder agregar el asterisco de forma consistente.
 * - Los campos calculados usan `editable={false}`, el mismo patron
 *   que ya usa el modulo de Raleo para la biomasa restante.
 *
 * Ejemplo:
 * <FormularioConteo
 *   tiros={tiros}
 *   setTiro={setTiro}
 *   agregarTiro={agregarTiro}
 *   submitted={submitted}
 *   errores={errores}
 * />
 */

import React from "react";
import { View } from "react-native";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Text from "../../../shared/components/Text";
import TirosAtarraya from "../components/TirosAtarraya";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/DensidadPoblacionalStyles";

export default function FormularioConteo({
  // Tiros
  tiros,
  setTiro,
  agregarTiro,
  eliminarTiro,
  setCantidadTiros,
  maxTiros,

  // Digitados
  areaAtarraya,
  setAreaAtarraya,
  notasConteo,
  setNotasConteo,

  // Calculados
  numeroCamarones = 0,
  areaMuestreadaTexto = "",
  promedioPorTiroTexto = "",
  densidadPorM2Texto = "",
  poblacionTotalTexto = "",
  supervivencia = "",

  submitted = false,
  errores = {},
}) {
  return (
    <>
      <Select
        label="Área de la atarraya"
        value={areaAtarraya}
        onChange={setAreaAtarraya}
        placeholder="Seleccionar área"
        options={[
          { label: "2.5 m²", value: "2.5" },
          { label: "3.5 m²", value: "3.5" },
          { label: "4.5 m²", value: "4.5" },
          { label: "5.5 m²", value: "5.5" },
        ]}
        required
        submitted={submitted}
        error={submitted ? (errores.areaAtarraya || "") : ""}
      />

      <TirosAtarraya
        tiros={tiros}
        setTiro={setTiro}
        agregarTiro={agregarTiro}
        eliminarTiro={eliminarTiro}
        setCantidadTiros={setCantidadTiros}
        maxTiros={maxTiros}
        submitted={submitted}
        errores={errores}
      />

      {submitted && errores.tiros ? (
        <Text size={13} color={COLORS.error} style={styles.tirosAyuda}>
          {errores.tiros}
        </Text>
      ) : null}

      <View style={styles.resultadosSeparador} />

      {/*
        Todo lo de aqui abajo lo calcula el sistema. Se muestra para
        que el usuario vea el resultado del muestreo sin salir de la
        pantalla, pero no se digita ni se envia: el backend lo
        recalcula al guardar.
      */}
      <Input
        label="Total de camarones contados"
        value={numeroCamarones > 0 ? String(numeroCamarones) : ""}
        placeholder="Suma de todos los tiros"
        editable={false}
      />

      <Input
        label="Promedio por tiro"
        value={promedioPorTiroTexto}
        placeholder="Se calcula automáticamente"
        editable={false}
      />

      <Input
        label="Área muestreada (m²)"
        value={areaMuestreadaTexto !== "" ? `${areaMuestreadaTexto} m²` : ""}
        placeholder="Tiros × área de la atarraya"
        editable={false}
      />

      <Input
        label="Densidad (camarones por m²)"
        value={densidadPorM2Texto}
        placeholder="Se calcula automáticamente"
        editable={false}
      />

      <Input
        label="Población total estimada del estanque"
        value={poblacionTotalTexto !== "" ? `${poblacionTotalTexto} camarones` : ""}
        placeholder="Se calcula automáticamente"
        editable={false}
      />
      <Input
        label="Supervivencia (%)"
        value={supervivencia !== "" ? `${supervivencia}%` : ""}
        placeholder="Se calcula automáticamente"
        editable={false}
      />

      {/*
        maxLength coincide con el limite que valida el backend
        (controllers/densidadPoblacional.controller.js). Sin el, una
        nota larga se digitaba completa y recien al guardar
        aparecia un 422 que obligaba a recortarla a ciegas.
      */}
      <Input
        label="Notas o comentarios del conteo"
        placeholder="Ej: Agua turbia, buena visibilidad de red"
        value={notasConteo}
        onChangeText={setNotasConteo}
        maxLength={255}
        multiline
      />
    </>
  );
}
