/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardUltimosRegistros.jsx
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Renderiza los registros mas recientes de los diferentes
modulos utilizados por el Dashboard.
//////////////////////////////////////////////////////////
*/

import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

import { obtenerTextoSeguro } from "../utils/DashboardUtils";
import { styles } from "../styles/DashboardStyle";

function EmptyMessage({ text }) {
  return (
    <View style={styles.emptyBox}>
      <CustomText size={12} color={COLORS.textTertiary} align="center">
        {text}
      </CustomText>
    </View>
  );
}

export default function DashboardUltimosRegistros({ registros }) {
  const registrosSeguros = Array.isArray(registros) ? registros : [];

  return (
    <Card style={styles.detailCard}>
      <CustomText size={13} color={COLORS.textTertiary} style={styles.panelSubtitle}>
        ULTIMOS REGISTROS
      </CustomText>

      {registrosSeguros.length === 0 ? (
        <EmptyMessage text="No hay registros recientes para mostrar." />
      ) : (
        registrosSeguros.map(function (item, index) {
          const modulo = obtenerTextoSeguro(item.modulo, "Registro");
          const detalle = obtenerTextoSeguro(item.detalle, "Sin detalle");
          const fechaVisible = obtenerTextoSeguro(item.fechaVisible, "Sin fecha");

          return (
            <View key={item.id ?? `ultimo-registro-${index}`} style={styles.recordRow}>
              <View style={styles.recordIconBox}>
                <Icon icon={ICONS.clipboard} size={20} color={COLORS.textTertiary} />
              </View>

              <View style={styles.rowContent}>
                <CustomText size={15} weight="700" color={COLORS.textSecondary} numberOfLines={1}>
                  {modulo}
                </CustomText>

                <CustomText size={12} color={COLORS.textTertiary} style={styles.rowDescription} numberOfLines={1}>
                  {detalle}
                </CustomText>
              </View>

              <CustomText size={12} color={COLORS.textTertiary}>
                {fechaVisible}
              </CustomText>
            </View>
          );
        })
      )}
    </Card>
  );
}