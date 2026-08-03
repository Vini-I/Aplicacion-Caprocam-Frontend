/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardEstanquesPanel.jsx
Autor: Gerald Andres Alfaro Solorzano
Fecha: 01/08/2026
Modulo: Dashboard
Descripcion:
Renderiza el resumen de estanques, la grafica de estados,
la alimentacion semanal y el detalle de cada estanque.
Los dias de cultivo provienen del modulo de siembra.
//////////////////////////////////////////////////////////
*/

import { Platform, View } from "react-native";

import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { TYPOGRAPHY } from "../../../theme/typography";

import {
  obtenerEstanquesActivos,
  obtenerEstanquesCosechados,
  obtenerMayorKgSemanal,
  obtenerPorcentaje,
  obtenerTextoSeguro,
} from "../utils/DashboardUtils";

import { styles } from "../styles/DashboardStyle";

function GraficaPastelEstanques({ activos, cosechados }) {
  const total = activos + cosechados;
  const porcentajeActivos = total > 0 ? Math.round((activos / total) * 100) : 0;

  if (Platform.OS === "web") {
    const estiloGrafica = {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundImage: `conic-gradient(${COLORS.primary} 0% ${porcentajeActivos}%, ${COLORS.textQuaternary} ${porcentajeActivos}% 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    };

    const estiloCentro = {
      width: 82,
      height: 82,
      borderRadius: 41,
      backgroundColor: COLORS.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    };

    return (
      <div style={estiloGrafica}>
        <div style={estiloCentro}>
          <span
            style={{
              color: COLORS.textSecondary,
              fontSize: 26,
              fontWeight: 900,
              fontFamily: TYPOGRAPHY.fontFamily.regular,
              lineHeight: "28px",
            }}
          >
            {total}
          </span>

          <span
            style={{
              color: COLORS.textTertiary,
              fontSize: 11,
              fontFamily: TYPOGRAPHY.fontFamily.regular,
              lineHeight: "14px",
            }}
          >
            total
          </span>
        </div>
      </div>
    );
  }

  return (
    <View style={styles.donutWrapper}>
      <View style={styles.donutChart}>
        <View style={[styles.donutActiveSegment, { width: `${porcentajeActivos}%` }]} />
        <View style={[styles.donutHarvestSegment, { width: `${100 - porcentajeActivos}%` }]} />

        <View style={styles.donutInner}>
          <CustomText size={26} weight="900" color={COLORS.textSecondary} style={styles.donutTotalNumber}>
            {total}
          </CustomText>

          <CustomText size={11} color={COLORS.textTertiary}>
            total
          </CustomText>
        </View>
      </View>
    </View>
  );
}

function GraficaAlimentacionSemanal({ alimentacionSemanal }) {
  const registros = Array.isArray(alimentacionSemanal) ? alimentacionSemanal : [];
  const mayorKg = obtenerMayorKgSemanal(registros);

  return (
    <View style={styles.lineChart}>
      <View style={styles.chartGridLines}>
        <View style={styles.gridLine} />
        <View style={styles.gridLine} />
        <View style={styles.gridLine} />
        <View style={styles.gridLine} />
      </View>

      <View style={styles.lineBars}>
        {registros.map(function (item, index) {
          const porcentaje = obtenerPorcentaje(item.kg, mayorKg);

          return (
            <View key={item.id ?? `alimentacion-${index}`} style={styles.lineItem}>
              <View style={[styles.lineBar, { height: `${porcentaje}%` }]} />

              <CustomText size={10} color={COLORS.textTertiary} align="center">
                {item.dia}
              </CustomText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function DashboardEstanquesPanel({ estanques, alimentacionSemanal }) {
  const estanquesSeguros = Array.isArray(estanques) ? estanques : [];
  const alimentacionSegura = Array.isArray(alimentacionSemanal) ? alimentacionSemanal : [];
  const activos = obtenerEstanquesActivos(estanquesSeguros);
  const cosechados = obtenerEstanquesCosechados(estanquesSeguros);

  return (
    <Card style={styles.detailCard}>
      <View style={styles.sectionHeader}>
        <Icon icon={ICONS.waterFlow} size={18} color={COLORS.primary} />

        <Title level={6} style={styles.sectionTitle}>
          Estanques registrados
        </Title>
      </View>

      <View style={styles.divider} />

      <View style={styles.twoColumns}>
        <View style={styles.chartColumn}>
          <CustomText size={13} color={COLORS.textTertiary} align="center" style={styles.panelSubtitle}>
            ACTIVOS Y COSECHADOS
          </CustomText>

          <View style={styles.pastelChartContainer}>
            <View style={styles.pastelChartBox}>
              <GraficaPastelEstanques activos={activos} cosechados={cosechados} />

              <View style={styles.pastelStatsBox}>
                <View style={styles.pastelStatItem}>
                  <View style={styles.legendBlue} />

                  <CustomText size={12} color={COLORS.textTertiary}>
                    Activos: {activos}
                  </CustomText>
                </View>

                <View style={styles.pastelStatItem}>
                  <View style={styles.legendGray} />

                  <CustomText size={12} color={COLORS.textTertiary}>
                    Cosechados: {cosechados}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.chartColumn}>
          <CustomText size={13} color={COLORS.textTertiary} align="center" style={styles.panelSubtitle}>
            ALIMENTACION SEMANAL KG
          </CustomText>

          <GraficaAlimentacionSemanal alimentacionSemanal={alimentacionSegura} />
        </View>
      </View>

      {estanquesSeguros.length === 0 ? (
        <View style={styles.emptyBox}>
          <CustomText size={12} color={COLORS.textTertiary} align="center">
            No hay estanques registrados.
          </CustomText>
        </View>
      ) : (
        estanquesSeguros.map(function (estanque, index) {
          const codigo = obtenerTextoSeguro(estanque.codigo, "Estanque sin codigo");
          const finca = obtenerTextoSeguro(estanque.fincaNombre, obtenerTextoSeguro(estanque.finca, "Sin finca"));
          const estado = obtenerTextoSeguro(estanque.estado, "Sin estado");
          const area = Number(estanque.area) > 0 ? `${estanque.area} ha` : "Area no registrada";
          const diasCultivo = estanque.tieneSiembra ? `${Number(estanque.diasCultivo) || 0}d` : "Sin siembra";
          const estadoNormalizado = estado.toLowerCase();
          const colorEstado = estadoNormalizado === "activo"
            ? COLORS.primary
            : estadoNormalizado === "cosechado"
              ? COLORS.textTertiary
              : estadoNormalizado.includes("prepar")
                ? COLORS.warning
                : COLORS.textSecondary;

          return (
            <View key={estanque.id ?? `estanque-${index}`} style={styles.infoRowIndigo}>
              <View style={styles.rowIconBoxIndigo}>
                <Icon icon={ICONS.waterFlow} size={20} color={COLORS.primary} />
              </View>

              <View style={styles.rowContent}>
                <CustomText size={15} weight="700" color={COLORS.textSecondary} numberOfLines={1}>
                  {codigo}
                </CustomText>

                <CustomText size={12} color={COLORS.textTertiary} style={styles.rowDescription} numberOfLines={1}>
                  {finca} · {area}
                </CustomText>
              </View>

              <View style={styles.rowRight}>
                <View style={styles.estadoBadge}>
                  <CustomText size={11} color={colorEstado} weight="700">
                    {estado}
                  </CustomText>
                </View>

                <CustomText size={11} color={COLORS.textTertiary}>
                  {diasCultivo}
                </CustomText>
              </View>
            </View>
          );
        })
      )}
    </Card>
  );
}