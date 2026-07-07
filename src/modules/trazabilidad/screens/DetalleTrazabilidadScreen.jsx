/**
 * Pantalla: DetalleTrazabilidadScreen
 *
 * Muestra toda la información de un registro de Trazabilidad ya
 * guardado (movimiento de pre-cría a engorde).
 *
 * Este registro es un hecho histórico: la pantalla es de solo
 * lectura, sin botón de editar ni de eliminar, tal como lo
 * establece la especificación del módulo.
 *
 * Funcionalidades principales:
 * - Recibir el id del registro mediante la ruta (/trazabilidad/[id]).
 * - Mostrar el movimiento Origen -> Destino en un bloque destacado.
 * - Mostrar el resto de los datos del registro en modo solo lectura.
 *
 * Componentes utilizados:
 * - Navbar: encabezado de la pantalla.
 * - Badge: etiqueta de "Registro histórico".
 * - Card: agrupación visual de las secciones del detalle.
 * - Input, Select, DateInput: campos en modo solo lectura.
 * - Button: acción para volver al listado (sin Pressable directo).
 */
import { View, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Text from "../../../shared/components/Text";
import { styles } from "../styles/DetalleTrazabilidadStyles";
import Button from "../../../shared/components/Button";
import { STYLE } from "../../../theme/style";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Icon from "../../../shared/components/Icons";
import { ICONS } from "../../../theme/icons";

import { obtenerRegistroTrazabilidadPorId } from "../services/TrazabilidadServices";

export default function DetalleTrazabilidadScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const registro = obtenerRegistroTrazabilidadPorId(Number(id));

  function volver() {
    router.back();
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

            <Select
              label="Colaborador responsable"
              options={[
                { label: registro.colaboradorNombre, value: registro.colaboradorId },
              ]}
              value={registro.colaboradorId}
              disabled={true}
              selectStyle={styles.inputLectura}
              labelStyle={styles.labelLectura}
            />
          </Card>

          <Card title="Datos del traslado" titleStyle={styles.cardTitle}>
            <Input
              label="Tamaño (gramos)"
              value={`${registro.tamaño}g`}
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
