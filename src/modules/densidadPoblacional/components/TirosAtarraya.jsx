/**
 * ============================================================
 * COMPONENTE TIROSATARRAYA
 * ============================================================
 *
 * Lista incremental de tiros de atarraya. Cada tiro es una fila
 * con su numero, la cantidad de camarones contados en ese tiro y
 * un boton para eliminarlo. Debajo queda el boton "Agregar tiro".
 *
 * Por que asi: en campo el conteo se hace tiro por tiro (se lanza
 * la atarraya, se cuentan los camarones, se anota, y se repite).
 * El documento lo describe igual: "Primer tiro: 20 camarones,
 * segundo tiro: 15, tercer tiro: 30... al finalizar se suman todos
 * los camarones obtenidos". Antes el formulario pedia un unico
 * "total de camarones" ya sumado a mano, y por separado la
 * cantidad de tiros, dos datos que podian no corresponderse.
 *
 * El campo "Cantidad de tiros" de arriba y la lista son el mismo
 * dato: subirlo agrega filas vacias al final, bajarlo recorta las
 * ultimas. Asi el usuario puede decir de entrada cuantos tiros va
 * a hacer (10 por hectarea, segun el documento) sin tener que
 * apretar el boton uno por uno, pero igual puede ir agregando
 * sobre la marcha.
 *
 * CAMBIO: el boton "Agregar tiro" ahora tambien se deshabilita
 * cuando el ULTIMO tiro todavia esta vacio (ademas de cuando se
 * llega al tope). agregarTiro() (useDatosConteo.js) ya rechaza la
 * accion en ese caso; aqui se refleja el mismo estado en el boton
 * para que no se vea habilitado sin estarlo, y se agrega una ayuda
 * corta explicando por que.
 *
 * Estilos: usa los mismos COLORS y el mismo contrato visual de
 * error (borde rojo tras `submitted`) que el resto del modulo. No
 * introduce colores nuevos.
 *
 * Props principales:
 * - tiros: arreglo de strings, la cantidad de camarones por tiro.
 * - setTiro(indice, valor): actualiza un tiro puntual.
 * - agregarTiro(): agrega un tiro vacio al final.
 * - eliminarTiro(indice): quita ese tiro.
 * - setCantidadTiros(n): ajusta la lista a n tiros.
 * - maxTiros: tope de tiros permitido.
 * - submitted / errores: estado de validacion.
 *
 * Ejemplo:
 * <TirosAtarraya
 *   tiros={tiros}
 *   setTiro={setTiro}
 *   agregarTiro={agregarTiro}
 *   eliminarTiro={eliminarTiro}
 * />
 */

import React from "react";
import { View, Pressable } from "react-native";
import Input from "../../../shared/components/Input";
import NumberInput from "../../../shared/components/NumberInput";
import Text from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles } from "../styles/DensidadPoblacionalStyles";

export default function TirosAtarraya({
  tiros = [""],
  setTiro = () => {},
  agregarTiro = () => {},
  eliminarTiro = () => {},
  setCantidadTiros = () => {},
  maxTiros = 20,
  submitted = false,
  errores = {},
}) {
  const tirosVacios = errores.tirosVacios || [];
  const puedeEliminar = tiros.length > 1;
  const ultimoTiro = tiros[tiros.length - 1];
  const ultimoTiroVacio = String(ultimoTiro ?? "").trim() === "";
  const puedeAgregar = tiros.length < maxTiros && !ultimoTiroVacio;

  return (
    <View>
      <NumberInput
        label="Cantidad de tiros"
        value={String(tiros.length)}
        min={1}
        max={maxTiros}
        onChangeText={setCantidadTiros}
        required
        submitted={submitted}
      />

      <Text size={13} color={COLORS.textTertiary} style={styles.tirosAyuda}>
        Se recomiendan 10 tiros por hectárea.
      </Text>

      {tiros.map((tiro, indice) => {
        const numeroTiro = indice + 1;
        const invalido = submitted && tirosVacios.includes(numeroTiro);

        return (
          <View key={`tiro-${indice}`} style={styles.tiroFila}>
            <View style={styles.tiroBadge}>
              <Text size={13} weight="700" color={COLORS.primary}>
                {numeroTiro}
              </Text>
            </View>

            <View style={styles.tiroCampo}>
              <Input
                label={`Camarones del tiro ${numeroTiro}`}
                placeholder="Ej: 20"
                value={String(tiro ?? "")}
                onChangeText={(v) => setTiro(indice, v.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={5}
                containerStyle={styles.tiroInputContainer}
                style={invalido ? styles.bordeError : null}
              />
            </View>

            {/*
              El boton queda deshabilitado (no oculto) cuando solo
              hay un tiro, para que la fila no cambie de ancho al
              agregar o quitar tiros.
            */}
            <Pressable
              onPress={() => eliminarTiro(indice)}
              disabled={!puedeEliminar}
              style={styles.tiroEliminar}
              accessibilityRole="button"
              accessibilityLabel={`Eliminar tiro ${numeroTiro}`}
            >
              <Icon
                icon={ICONS.delete}
                size={20}
                color={puedeEliminar ? COLORS.error : COLORS.textQuaternary}
              />
            </Pressable>
          </View>
        );
      })}

      <Pressable
        onPress={agregarTiro}
        disabled={!puedeAgregar}
        style={[styles.agregarTiro, !puedeAgregar && styles.agregarTiroDeshabilitado]}
        accessibilityRole="button"
      >
        <Icon
          icon={ICONS.add}
          size={18}
          color={puedeAgregar ? COLORS.primary : COLORS.textQuaternary}
        />
        <Text
          size={15}
          weight="600"
          color={puedeAgregar ? COLORS.primary : COLORS.textQuaternary}
        >
          Agregar tiro
        </Text>
      </Pressable>

      {tiros.length >= maxTiros ? (
        <Text size={13} color={COLORS.textTertiary} style={styles.tirosAyuda}>
          Máximo {maxTiros} tiros por registro.
        </Text>
      ) : ultimoTiroVacio && tiros.length > 0 ? (
        <Text size={13} color={COLORS.textTertiary} style={styles.tirosAyuda}>
          Complete el tiro {tiros.length} para poder agregar otro.
        </Text>
      ) : null}
    </View>
  );
}
