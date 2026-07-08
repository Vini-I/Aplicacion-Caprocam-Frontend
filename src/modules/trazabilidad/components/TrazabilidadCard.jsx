/**
 * Componente: TrazabilidadCard
 *
 * Tarjeta de resumen para mostrar un registro de Trazabilidad
 * (movimiento de un lote de pre-cría a engorde).
 *
 * Funcionalidades principales:
 * - Mostrar finca, fecha y colaborador responsable.
 * - Mostrar el movimiento Origen -> Destino en una sola línea.
 * - Mostrar PL, tamaño y días del registro.
 * - Permitir abrir el detalle del registro al presionarla (onPress).
 *
 * Componentes utilizados:
 * - Button: envuelve la tarjeta para manejar el onPress (sin Pressable directo).
 * - Card: contenedor visual de la información.
 */
import { View } from "react-native";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/TrazabilidadCardStyles";

export default function TrazabilidadCard({
  fincaNombre,
  fecha,
  colaboradorNombre,
  estanqueOrigenLabel,
  estanqueDestinoLabel,
  pl,
  tamaño,
  dias,
  onPress,
  style,
}) {
  return (
    <Button onPress={onPress} style={styles.touchable}>
      <Card style={[styles.card, style]}>
        <View style={styles.header}>
          <Text style={styles.fincaText}>{fincaNombre}</Text>

          <Text style={styles.fechaText}>{fecha}</Text>
        </View>

        <Text style={styles.colaboradorText}>
          Responsable: {colaboradorNombre}
        </Text>

        <View style={styles.movimiento}>
          <Text style={styles.estanqueText} numberOfLines={1}>
            {estanqueOrigenLabel}
          </Text>

          <Icon
            icon={ICONS.arrowLongRight}
            size={32}
            color={COLORS.primary}
            style={styles.flechaIcon}
          />

          <Text style={styles.estanqueText} numberOfLines={1}>
            {estanqueDestinoLabel}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dato}>
            <Text style={styles.datoLabel}>PL</Text>
            <Text style={styles.datoValor}>
              {Number(pl ?? 0).toLocaleString()}
            </Text>
          </View>

          <View style={styles.dato}>
            <Text style={styles.datoLabel}>Tamaño</Text>
            <Text style={styles.datoValor}>{tamaño}g</Text>
          </View>

          <View style={styles.dato}>
            <Text style={styles.datoLabel}>Días</Text>
            <Text style={styles.datoValor}>{dias}</Text>
          </View>
        </View>
      </Card>
    </Button>
  );
}
