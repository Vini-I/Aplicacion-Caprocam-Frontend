/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardFincasPanel.jsx
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Renderiza el detalle de fincas registradas y la grafica
de cantidad de estanques por finca.
//////////////////////////////////////////////////////////
*/

import { View } from "react-native";

import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import {
  obtenerMayorEstanquesFinca,
  obtenerPorcentaje,
  obtenerTotalEstanquesFinca,
} from "../utils/DashboardUtils";
import { styles } from "../styles/DashboardStyle";

export default function DashboardFincasPanel({ fincas, estanques }) {
  const fincasSeguras = Array.isArray(fincas) ? fincas : [];
  const estanquesSeguros = Array.isArray(estanques) ? estanques : [];
  const mayorEstanques = obtenerMayorEstanquesFinca(fincasSeguras, estanquesSeguros);

  return (
    <Card style={styles.detailCard}>
      <View style={styles.sectionHeader}>
        <Icon icon={ICONS.home} size={18} color={COLORS.primary} />

        <Title level={6} style={styles.sectionTitle}>
          Fincas registradas
        </Title>
      </View>

      <View style={styles.divider} />

      {fincasSeguras.length === 0 ? (
        <View style={styles.emptyBox}>
          <CustomText size={12} color={COLORS.textTertiary} align="center">
            No hay fincas registradas.
          </CustomText>
        </View>
      ) : (
        <>
          <View style={styles.barChart}>
            <View style={styles.chartGridLines}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            <View style={styles.barChartContent}>
              {fincasSeguras.map(function (finca, index) {
                const totalEstanques = obtenerTotalEstanquesFinca(finca, estanquesSeguros);
                const porcentaje = obtenerPorcentaje(totalEstanques, mayorEstanques);

                return (
                  <View key={finca.id ?? `finca-grafica-${index}`} style={styles.barItem}>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: `${porcentaje}%` }]} />
                    </View>

                    <CustomText
                      size={10}
                      color={COLORS.textTertiary}
                      align="center"
                      numberOfLines={1}
                      style={styles.barLabel}
                    >
                      {finca.nombre}
                    </CustomText>
                  </View>
                );
              })}
            </View>
          </View>

          {fincasSeguras.map(function (finca, index) {
            const totalEstanques = obtenerTotalEstanquesFinca(finca, estanquesSeguros);
            const ubicacion = finca.ubicacion && finca.ubicacion !== "" ? finca.ubicacion : "Sin ubicacion";
            const area = Number(finca.area) > 0 ? `${finca.area} ha` : "Area no registrada";

            return (
              <View key={finca.id ?? `finca-detalle-${index}`} style={styles.infoRowBlue}>
                <View style={styles.rowIconBoxBlue}>
                  <Icon icon={ICONS.location} size={20} color={COLORS.primary} />
                </View>

                <View style={styles.rowContent}>
                  <CustomText size={15} weight="700" color={COLORS.textSecondary} numberOfLines={1}>
                    {finca.nombre}
                  </CustomText>

                  <CustomText
                    size={12}
                    color={COLORS.textTertiary}
                    style={styles.rowDescription}
                    numberOfLines={1}
                  >
                    {ubicacion} · {area}
                  </CustomText>
                </View>

                <View style={styles.rowRight}>
                  <CustomText size={18} weight="800" color={COLORS.primary}>
                    {totalEstanques}
                  </CustomText>

                  <CustomText size={11} color={COLORS.textTertiary}>
                    {totalEstanques === 1 ? "estanque" : "estanques"}
                  </CustomText>
                </View>
              </View>
            );
          })}
        </>
      )}
    </Card>
  );
}