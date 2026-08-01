/**
 * ============================================================
 * PANTALLA DetalleTrazabilidadScreen
 * ============================================================
 *
 * Descripción:
 * Muestra la información completa de solo lectura de un registro de trazabilidad.
 *
 * @dependencies TrazabilidadServices, Card, Input, Badge, expo-router
 * @validations Registro histórico de solo lectura.
 * @navigation Carga parámetro `id` de la ruta `/trazabilidad/[id]`.
 */
import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import {useLocalSearchParams } from "expo-router";
import Text from "../../../shared/components/Text";
import { styles } from "../styles/DetalleTrazabilidadStyles";
import { STYLE } from "../../../theme/style";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Input from "../../../shared/components/Input";


import { getRegistroPorId } from "../services/TrazabilidadServices";

export default function DetalleTrazabilidadScreen() {
  const { id } = useLocalSearchParams();

  const [registro, setRegistro] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // TODO: confirmar con API el tipo real de id (hoy se manda tal cual llega de la ruta)
    getRegistroPorId(id)
      .then(setRegistro)
      .catch(() => setRegistro(null))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <View style={STYLE.container}>
        <Text style={styles.notFoundText}>Cargando...</Text>
      </View>
    );
  }

  if (!registro) {
    return (
      <View style={STYLE.container}>
        <Text style={styles.notFoundText}>No se encontró el registro solicitado.</Text>
      </View>
    );
  }

  return (
    <View style={STYLE.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={STYLE.contentWrapper}>
          <Badge
            label="Registro histórico · no editable"
            variant="info"
            style={styles.badgeHistorico}
          />

          <Card style={styles.movimientoCard}>
            <View style={styles.movimientoRow}>
              <View style={styles.estanqueBox}>
                <Text style={styles.estanqueLabel}>Origen</Text>
                <Text style={styles.estanqueValor}>
                  {registro.estanqueOrigenLabel}
                </Text>
              </View>

              <Text style={styles.flechaTexto}>→</Text>

              <View style={styles.estanqueBox}>
                <Text style={styles.estanqueLabel}>Destino</Text>
                <Text style={styles.estanqueValor}>
                  {registro.estanqueDestinoLabel}
                </Text>
              </View>
            </View>

            <Text style={styles.fincaTexto}>{registro.fincaNombre}</Text>
          </Card>

          <Card title="Información del movimiento" titleStyle={styles.cardTitle}>
            <Input
              label="Fecha del movimiento"
              value={registro.fecha}
              editable={false}
              style={styles.inputLectura}
              labelStyle={styles.labelLectura}
            />

            <Input
              label={registro.tipoResponsable ? `${registro.tipoResponsable} responsable` : "Responsable"}
              value={registro.colaboradorNombre || "N/A"}
              editable={false}
              style={styles.inputLectura}
              labelStyle={styles.labelLectura}
            />
          </Card>

          <Card title="Datos del traslado" titleStyle={styles.cardTitle}>
            <Input
              label="Tamaño (gramos)"
              value={`${registro.tamano}g`}
              editable={false}
              style={styles.inputLectura}
              labelStyle={styles.labelLectura}
            />

            <Input
              label="Días de siembra"
              value={String(registro.dias)}
              editable={false}
              style={styles.inputLectura}
              labelStyle={styles.labelLectura}
            />

            <Input
              label="PL"
              value={Number(registro.pl ?? 0).toLocaleString()}
              editable={false}
              style={styles.inputLectura}
              labelStyle={styles.labelLectura}
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}