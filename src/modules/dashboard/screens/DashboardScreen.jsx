/**
 * ============================================================
 * PANTALLA DASHBOARD GENERAL
 * ============================================================
 *
 * Responsabilidad:
 * - Muestra resumen operativo del proyecto Caprocam.
 * - Usa dateUtils para manejo de fechas.
 * - Muestra acceso outline al modulo de Mareas.
 * - Muestra cards desplegables para fincas, estanques, casos sanitarios y mortalidad.
 * - Muestra alertas con tokens suaves del theme.
 *
 * Reglas aplicadas:
 * - No modifica login.
 * - No modifica rutas existentes.
 * - No usa helpers locales de fecha.
 * - Los accesos a modulos usan boton outline si no son icon cards.
 */

import React, { useEffect, useState } from "react";
import { ScrollView, View, useWindowDimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { STYLE } from "../../../theme/style";

import { fincas as fincasModulo } from "../../finca/screens/FincaData";
import { estanques as estanquesModulo } from "../../mantCrecimiento/services/EstanqueData";
import { obtenerSiembras } from "../../siembra/services/SiembraService";
import useAlimentacion from "../../alimentacion/hooks/useAlimentacion";
import { getProductosInventario } from "../../inventarios/services/InventarioService";
import { EQUIPOS_MOCK } from "../../mantEquipo/services/mantEquipoService";

import enfermedadesService from "../../enfermedades/services/EnfermedadesService";

import parasitologiaService from "../../parasitologia/services/ParasitologiaService";

import {
  obtenerTextoSeguro,
  obtenerNumeroSeguro,
  formatearNumero,
  convertirFecha,
  formatearFechaCorta,
  obtenerDiaSemana,
  esMismaFecha,
  obtenerMinutosHora,
  obtenerHoraNumero,
  obtenerResumenEnfermedadesVacio,
  obtenerResumenParasitologiaVacio,
  agregarAlerta,
  construirFincasDashboard,
  contarEstanquesPorFinca,
  obtenerTotalEstanquesFinca,
  obtenerMayorEstanquesFinca,
  obtenerPorcentaje,
  obtenerEstanquesActivos,
  obtenerEstanquesCosechados,
  obtenerAlimentacionSemanal,
  obtenerMayorKgSemanal,
  obtenerTotalCasosSanitarios,
  obtenerMortalidadTotal,
  obtenerColorEstado,
  obtenerEstiloSeveridad,
  obtenerColorSeveridad,
  obtenerPrimerNombreEnfermedad,
  obtenerCasosSanitarios,
  obtenerRegistrosMortalidad,
  obtenerAlertasInventario,
  obtenerAlertasCosecha,
  obtenerAlertasEstanques,
  existeAlimentacionRegistrada,
  obtenerAlertasAlimentacion,
  obtenerEquiposPorTipo,
  obtenerNombresEquipos,
  obtenerHorarioBombeoActivo,
  obtenerSiguienteHorarioBombeo,
  obtenerAlertasBombeo,
  calcularHorasUsoAireador,
  obtenerHorasRestantesMantenimiento,
  obtenerAlertasAireadores,
  obtenerAlertasSanitarias,
  obtenerAlertasDashboard,
  obtenerEstiloAlerta,
  obtenerTextoTipoAlerta,
  obtenerFechaSiembraSegura,
  obtenerUltimosRegistros,
  obtenerResumenAlertas,
  obtenerCategoriasAlertas,
} from "../services/DashboardService";

import { styles } from "../styles/DashboardStyle";

import {
  construirAlertasOperativas,
  descartarAlerta,
  filtrarAlertasDescartadas,
  obtenerAlertasDescartadas,
} from "../../alertas/services/AlertasServices.js";

function SectionHeader({ icon, title, color }) {
  return (
    <View style={styles.sectionHeader}>
      <Icon icon={icon} size={18} color={color} />

      <Title level={6} style={styles.sectionTitle}>
        {title}
      </Title>
    </View>
  );
}

function EmptyMessage({ text }) {
  return (
    <View style={styles.emptyBox}>
      <CustomText size={12} color={COLORS.textTertiary} align="center">
        {text}
      </CustomText>
    </View>
  );
}

function MareasAccessCard({ onPress }) {
  return (
    <Button variant="outline" style={styles.mareasAccessCard} onPress={onPress}>
      <View style={styles.mareasAccessIcon}>
        <Icon icon={ICONS.waterFlow} size={24} color={COLORS.primary} />
      </View>

      <View style={styles.mareasAccessText}>
        <CustomText size={16} weight="800" color={COLORS.primary}>
          Mareas del Pacífico
        </CustomText>

        <CustomText size={12} color={COLORS.textTertiary} numberOfLines={1}>
          Consulta pleamares, bajamares, llenado y drenaje
        </CustomText>
      </View>

      <Icon icon={ICONS.enter} size={20} color={COLORS.primary} />
    </Button>
  );
}

function AlertasPanel({ alertas, abiertos, onToggle, onDismiss, onViewAll }) {
  const grupos = obtenerResumenAlertas(alertas);

  return (
    <Card style={styles.alertsCard}>
      <View style={styles.alertsHeader}>
        <View style={styles.alertsTitleBox}>
          <View style={styles.alertsIconBox}>
            <Icon icon={ICONS.notification} size={20} color={COLORS.warning} />
          </View>

          <View style={styles.alertsTextBox}>
            <Title level={6} style={styles.alertsTitle}>
              Alertas operativas
            </Title>

            <CustomText size={12} color={COLORS.textTertiary} numberOfLines={1}>
              Prioridad por contaminacion, sanidad, cosecha e inventario
            </CustomText>
          </View>
        </View>

        <View style={styles.alertsCounter}>
          <CustomText size={13} weight="800" color={COLORS.warning}>
            {alertas.length}
          </CustomText>
        </View>
      </View>

      {alertas.length === 0 && (
        <View style={styles.emptyAlertBox}>
          <CustomText size={12} color={COLORS.textTertiary} align="center">
            No hay alertas importantes por el momento.
          </CustomText>
        </View>
      )}

      {grupos.map(function (grupo) {
        let iconoDropdown = ICONS.chevronDown;
        const categorias = obtenerCategoriasAlertas(grupo.alertas);
        const nombresCategorias = Object.keys(categorias);

        if (abiertos[grupo.tipo] === true) {
          iconoDropdown = ICONS.chevronUp;
        }

        return (
          <View key={grupo.tipo} style={styles.alertDropdownGroup}>
            <Button
              variant="outline"
              style={styles.alertDropdownHeader}
              onPress={function () {
                onToggle(grupo.tipo);
              }}
            >
              <View style={styles.alertDropdownLeft}>
                <Icon icon={grupo.icono} size={18} color={grupo.color} />

                <CustomText
                  size={14}
                  color={COLORS.textSecondary}
                  style={styles.alertDropdownTitle}
                >
                  {grupo.titulo}
                </CustomText>
              </View>

              <View style={styles.alertDropdownRight}>
                <CustomText size={12} color={grupo.color} weight="800">
                  {grupo.alertas.length}
                </CustomText>

                <Icon
                  icon={iconoDropdown}
                  size={20}
                  color={COLORS.textTertiary}
                />
              </View>
            </Button>

            {abiertos[grupo.tipo] === true && (
              <View style={styles.alertDropdownBody}>
                {grupo.alertas.length === 0 && (
                  <View style={styles.emptyAlertBoxSmall}>
                    <CustomText
                      size={12}
                      color={COLORS.textTertiary}
                      align="center"
                    >
                      No hay alertas en este tipo.
                    </CustomText>
                  </View>
                )}

                {nombresCategorias.map(function (categoria) {
                  return (
                    <View key={categoria}>
                      <CustomText
                        size={11}
                        color={COLORS.textTertiary}
                        style={styles.alertCategoryTitle}
                      >
                        {categoria}
                      </CustomText>

                      {categorias[categoria].map(function (alerta) {
                        return (
                          <View
                            key={alerta.id}
                            style={obtenerEstiloAlerta(alerta.tipo)}
                          >
                            <View style={styles.alertIconContainer}>
                              <Icon
                                icon={alerta.icono}
                                size={18}
                                color={alerta.color}
                              />
                            </View>

                            <View style={styles.alertContent}>
                              <View style={styles.alertTitleRow}>
                                <CustomText
                                  size={14}
                                  weight="800"
                                  color={COLORS.textSecondary}
                                  numberOfLines={1}
                                >
                                  {alerta.titulo}
                                </CustomText>

                                <Button
                                  variant="outline"
                                  style={styles.alertDismissButton}
                                  onPress={function () {
                                    onDismiss(alerta.id);
                                  }}
                                >
                                  <Icon
                                    icon={ICONS.close}
                                    size={15}
                                    color={COLORS.textTertiary}
                                  />
                                </Button>
                              </View>

                              <CustomText
                                size={12}
                                color={COLORS.textTertiary}
                                style={styles.alertMessage}
                              >
                                {alerta.mensaje}
                              </CustomText>

                              {alerta.detalle !== "" && (
                                <CustomText
                                  size={12}
                                  color={COLORS.textSecondary}
                                  style={styles.alertDetail}
                                >
                                  {alerta.detalle}
                                </CustomText>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}

      <Button
        variant="outline"
        style={styles.viewAllAlertsButton}
        onPress={onViewAll}
      >
        <View style={styles.inlineButtonContentCentered}>
          <Icon icon={ICONS.notification} size={17} color={COLORS.primary} />

          <CustomText
            size={14}
            color={COLORS.primary}
            style={styles.viewAllAlertsText}
          >
            Ver todas las alertas
          </CustomText>
        </View>
      </Button>
    </Card>
  );
}

function StatCard({
  id,
  selectedId,
  onPress,
  icon,
  value,
  label,
  cardStyle,
  iconStyle,
  iconColor,
  danger,
  isTablet,
}) {
  const cardStyles = [styles.statCard, cardStyle];

  if (isTablet === true) {
    cardStyles.push(styles.statCardTablet);
  }

  if (selectedId === id) {
    cardStyles.push(styles.statCardActive);
  }

  const iconBoxStyles = [styles.statIconBox, iconStyle];
  const valueStyles = [styles.statValue];

  if (danger === true) {
    valueStyles.push(styles.statValueDanger);
  }

  let chevronIcon = ICONS.chevronDown;

  if (selectedId === id) {
    chevronIcon = ICONS.chevronUp;
  }

  return (
    <Button style={cardStyles} onPress={onPress}>
      <View style={styles.statTopRow}>
        <View style={iconBoxStyles}>
          <Icon icon={icon} size={22} color={iconColor} />
        </View>

        <Icon icon={chevronIcon} size={20} color={COLORS.textQuaternary} />
      </View>

      <View style={styles.statBottom}>
        <CustomText style={valueStyles} numberOfLines={1}>
          {value}
        </CustomText>

        <CustomText
          size={13}
          color={COLORS.textTertiary}
          style={styles.statLabel}
          numberOfLines={1}
        >
          {label}
        </CustomText>
      </View>
    </Button>
  );
}

function FincasPanel({ fincas, estanques }) {
  const mayorEstanques = obtenerMayorEstanquesFinca(fincas, estanques);

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.home}
        title="Fincas registradas"
        color={COLORS.primary}
      />

      <View style={styles.divider} />

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitle}
      >
        ESTANQUES POR FINCA
      </CustomText>

      <View style={styles.barChart}>
        <View style={styles.chartGridLines}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>

        <View style={styles.barChartContent}>
          {fincas.map(function (finca) {
            const totalEstanques = obtenerTotalEstanquesFinca(finca, estanques);
            const porcentaje = obtenerPorcentaje(
              totalEstanques,
              mayorEstanques,
            );

            return (
              <View key={finca.id} style={styles.barItem}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${porcentaje}%`,
                      },
                    ]}
                  />
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

      {fincas.map(function (finca) {
        const totalEstanques = obtenerTotalEstanquesFinca(finca, estanques);

        return (
          <View key={finca.id} style={styles.infoRowBlue}>
            <View style={styles.rowIconBoxBlue}>
              <Icon icon={ICONS.home} size={20} color={COLORS.primary} />
            </View>

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {finca.nombre}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                numberOfLines={1}
                style={styles.rowDescription}
              >
                {finca.ubicacion} · {finca.area} ha
              </CustomText>
            </View>

            <View style={styles.rowRight}>
              <CustomText size={18} weight="800" color={COLORS.primary}>
                {totalEstanques}
              </CustomText>

              <CustomText size={11} color={COLORS.textTertiary}>
                estanques
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function EstanquesPanel({ estanques, alimentacionSemanal }) {
  const activos = obtenerEstanquesActivos(estanques);
  const cosechados = obtenerEstanquesCosechados(estanques);
  const totalGraficado = activos + cosechados;
  const mayorKg = obtenerMayorKgSemanal(alimentacionSemanal);

  let porcentajeActivos = 0;

  if (totalGraficado > 0) {
    porcentajeActivos = Math.round((activos / totalGraficado) * 100);
  }

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.waterFlow}
        title="Estanques registrados"
        color={COLORS.primary}
      />

      <View style={styles.divider} />

      <View style={styles.twoColumns}>
        <View style={styles.chartColumn}>
          <CustomText
            size={13}
            color={COLORS.textTertiary}
            align="center"
            style={styles.panelSubtitle}
          >
            ACTIVOS Y COSECHADOS
          </CustomText>

          <View style={styles.pastelChartContainer}>
            <View style={styles.pastelChartBox}>
              <GraficaPastelEstanques
                activos={activos}
                cosechados={cosechados}
                porcentajeActivos={porcentajeActivos}
              />

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
          <CustomText
            size={13}
            color={COLORS.textTertiary}
            align="center"
            style={styles.panelSubtitle}
          >
            ALIMENTACION SEMANAL KG
          </CustomText>

          <View style={styles.lineChart}>
            <View style={styles.chartGridLines}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            <View style={styles.lineBars}>
              {alimentacionSemanal.map(function (item) {
                const porcentaje = obtenerPorcentaje(item.kg, mayorKg);

                return (
                  <View key={item.id} style={styles.lineItem}>
                    <View
                      style={[
                        styles.lineBar,
                        {
                          height: `${porcentaje}%`,
                        },
                      ]}
                    />

                    <CustomText
                      size={10}
                      color={COLORS.textTertiary}
                      align="center"
                    >
                      {item.dia}
                    </CustomText>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {estanques.map(function (estanque) {
        return (
          <View key={estanque.id} style={styles.infoRowIndigo}>
            <View style={styles.rowIconBoxIndigo}>
              <Icon icon={ICONS.waterFlow} size={20} color={COLORS.primary} />
            </View>

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {estanque.codigo}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {estanque.fincaNombre} · {estanque.area} ha
              </CustomText>
            </View>

            <View style={styles.rowRight}>
              <View style={styles.estadoBadge}>
                <CustomText
                  size={11}
                  color={obtenerColorEstado(estanque.estado)}
                  weight="700"
                >
                  {estanque.estado}
                </CustomText>
              </View>

              <CustomText size={11} color={COLORS.textTertiary}>
                {estanque.diasCultivo}d
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function GraficaPastelEstanques({ activos, cosechados, porcentajeActivos }) {
  const total = activos + cosechados;
  let porcentajeFinal = porcentajeActivos;

  if (total === 0) {
    porcentajeFinal = 0;
  }

  if (Platform.OS === "web") {
    const estiloWeb = {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundImage: `conic-gradient(${COLORS.primary} 0% ${porcentajeFinal}%, ${COLORS.textQuaternary} ${porcentajeFinal}% 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    };

    const centroWeb = {
      width: 78,
      height: 78,
      borderRadius: 39,
      backgroundColor: COLORS.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    };

    const totalWeb = {
      fontSize: 22,
      fontWeight: "800",
      color: COLORS.primary,
      lineHeight: "24px",
    };

    const labelWeb = {
      fontSize: 11,
      color: COLORS.textTertiary,
    };

    return (
      <div style={estiloWeb}>
        <div style={centroWeb}>
          <span style={totalWeb}>{total}</span>
          <span style={labelWeb}>total</span>
        </div>
      </div>
    );
  }

  return (
    <View style={styles.donutChart}>
      <View
        style={[
          styles.donutActiveSegment,
          {
            width: `${porcentajeFinal}%`,
          },
        ]}
      />

      <View
        style={[
          styles.donutHarvestSegment,
          {
            width: `${100 - porcentajeFinal}%`,
          },
        ]}
      />

      <View style={styles.donutInner}>
        <CustomText size={18} weight="800" color={COLORS.primary}>
          {total}
        </CustomText>

        <CustomText size={10} color={COLORS.textTertiary}>
          total
        </CustomText>
      </View>
    </View>
  );
}

function CasosPanel({
  resumenEnfermedades,
  resumenParasitologia,
  registrosEnfermedades,
  registrosParasitologia,
}) {
  const casos = obtenerCasosSanitarios(
    registrosEnfermedades,
    registrosParasitologia,
  );

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.shieldAlert}
        title="Casos sanitarios"
        color={COLORS.warning}
      />

      <View style={styles.divider} />

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitle}
      >
        CASOS MÁS FRECUENTES
      </CustomText>

      {resumenEnfermedades.enfermedadesFrecuentes.length === 0 &&
        resumenParasitologia.parasitosFrecuentes.length === 0 && (
          <EmptyMessage text="No hay casos sanitarios registrados." />
        )}

      {resumenEnfermedades.enfermedadesFrecuentes.map(function (item) {
        return (
          <View key={item.enfermedad} style={styles.diseaseRow}>
            <View style={styles.diseaseDotRed} />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {item.nombre}
              </CustomText>
            </View>

            <CustomText size={15} weight="800" color={COLORS.textSecondary}>
              {item.casos}
            </CustomText>

            <CustomText
              size={12}
              color={COLORS.textTertiary}
              style={styles.caseText}
            >
              casos
            </CustomText>
          </View>
        );
      })}

      {resumenParasitologia.parasitosFrecuentes.map(function (item) {
        return (
          <View key={item.parasito} style={styles.diseaseRow}>
            <View style={styles.diseaseDotViolet} />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {item.nombre}
              </CustomText>
            </View>

            <CustomText size={15} weight="800" color={COLORS.textSecondary}>
              {item.casos}
            </CustomText>

            <CustomText
              size={12}
              color={COLORS.textTertiary}
              style={styles.caseText}
            >
              casos
            </CustomText>
          </View>
        );
      })}

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitleSecondary}
      >
        ÚLTIMOS CASOS
      </CustomText>

      {casos.length === 0 && (
        <EmptyMessage text="Aún no hay registros de enfermedades o parasitología." />
      )}

      {casos.map(function (caso) {
        return (
          <View key={caso.id} style={styles.caseRow}>
            <Icon icon={ICONS.alertTriangle} size={20} color={COLORS.warning} />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {caso.nombre}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {caso.estanque} · {caso.finca}
              </CustomText>

              <CustomText size={12} color={COLORS.textQuaternary}>
                {formatearFechaCorta(caso.fecha)}
              </CustomText>
            </View>

            <View style={obtenerEstiloSeveridad(caso.severidad)}>
              <CustomText
                size={12}
                weight="700"
                color={obtenerColorSeveridad(caso.severidad)}
              >
                {caso.severidadNombre}
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function MortalidadPanel({ resumenEnfermedades, registrosEnfermedades }) {
  const registrosMortalidad = obtenerRegistrosMortalidad(registrosEnfermedades);
  const totalMortalidad = obtenerMortalidadTotal(resumenEnfermedades);

  return (
    <Card style={styles.detailCard}>
      <SectionHeader
        icon={ICONS.mortality}
        title="Mortalidad registrada"
        color={COLORS.error}
      />

      <View style={styles.divider} />

      <View style={styles.mortalityTotalBox}>
        <Icon icon={ICONS.report} size={34} color={COLORS.error} />

        <View style={styles.totalBoxText}>
          <CustomText size={32} weight="900" color={COLORS.error}>
            {formatearNumero(totalMortalidad)}
          </CustomText>

          <CustomText size={13} color={COLORS.error}>
            individuos totales registrados
          </CustomText>
        </View>
      </View>

      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitleSecondary}
      >
        POR ESTANQUE
      </CustomText>

      {registrosMortalidad.length === 0 && (
        <EmptyMessage text="No hay mortalidad registrada en enfermedades." />
      )}

      {registrosMortalidad.map(function (item) {
        return (
          <View key={item.id} style={styles.mortalityRow}>
            <Icon icon={ICONS.shrimp} size={18} color={COLORS.error} />

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {item.estanque} · {item.finca}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {item.nombre} · {formatearFechaCorta(item.fecha)}
              </CustomText>
            </View>

            <View style={styles.rowRight}>
              <CustomText size={17} weight="900" color={COLORS.error}>
                {formatearNumero(item.mortalidad)}
              </CustomText>

              <CustomText size={11} color={COLORS.textTertiary}>
                ind.
              </CustomText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

function UltimosRegistros({ registros }) {
  return (
    <Card style={styles.detailCard}>
      <CustomText
        size={13}
        color={COLORS.textTertiary}
        style={styles.panelSubtitle}
      >
        ÚLTIMOS REGISTROS
      </CustomText>

      {registros.length === 0 && (
        <EmptyMessage text="No hay registros recientes para mostrar." />
      )}

      {registros.map(function (item) {
        return (
          <View key={item.id} style={styles.recordRow}>
            <View style={styles.recordIconBox}>
              <Icon
                icon={ICONS.clipboard}
                size={20}
                color={COLORS.textTertiary}
              />
            </View>

            <View style={styles.rowContent}>
              <CustomText
                size={15}
                weight="700"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {item.modulo}
              </CustomText>

              <CustomText
                size={12}
                color={COLORS.textTertiary}
                style={styles.rowDescription}
                numberOfLines={1}
              >
                {item.detalle}
              </CustomText>
            </View>

            <CustomText size={12} color={COLORS.textTertiary}>
              {item.fechaVisible}
            </CustomText>
          </View>
        );
      })}
    </Card>
  );
}

export default function DashboardScreen() {
  const router = useRouter();

  const [selectedCard, setSelectedCard] = useState(null);
  const [alertasDescartadas, setAlertasDescartadas] = useState([]);
  const [alertasAbiertas, setAlertasAbiertas] = useState({
    critica: true,
    advertencia: true,
    info: false,
  });
  const [fincasData, setFincasData] = useState([]);
  const [estanquesData, setEstanquesData] = useState([]);
  const [siembrasData, setSiembrasData] = useState([]);
  const [productosInventario, setProductosInventario] = useState([]);
  const [equiposData, setEquiposData] = useState([]);
  const [registrosEnfermedades, setRegistrosEnfermedades] = useState([]);
  const [registrosParasitologia, setRegistrosParasitologia] = useState([]);
  const [resumenEnfermedades, setResumenEnfermedades] = useState(
    obtenerResumenEnfermedadesVacio(),
  );
  const [resumenParasitologia, setResumenParasitologia] = useState(
    obtenerResumenParasitologiaVacio(),
  );

  const { alimentaciones, recargar } = useAlimentacion();
  const dimensiones = useWindowDimensions();

  const fincasDashboard = construirFincasDashboard(fincasData, estanquesData);
  const alimentacionSemanal = obtenerAlimentacionSemanal(alimentaciones);

  const totalCasosSanitarios = obtenerTotalCasosSanitarios(
    resumenEnfermedades,
    resumenParasitologia,
  );

  const totalMortalidad = obtenerMortalidadTotal(resumenEnfermedades);

  const alertasBase = construirAlertasOperativas({
    productosInventario: productosInventario,
    siembras: siembrasData,
    alimentaciones: alimentaciones,
    estanques: estanquesData,
    equipos: equiposData,
    registrosEnfermedades: registrosEnfermedades,
    registrosParasitologia: registrosParasitologia,
  });

  const alertasDashboard = filtrarAlertasDescartadas(
    alertasBase,
    alertasDescartadas,
  ).slice(0, 10);

  const ultimosRegistros = obtenerUltimosRegistros(
    alimentaciones,
    siembrasData,
    registrosEnfermedades,
    registrosParasitologia,
  );

  let isTablet = false;

  if (dimensiones.width >= 720) {
    isTablet = true;
  }

  const gridStyles = [styles.statsGrid];

  if (isTablet === true) {
    gridStyles.push(styles.statsGridTablet);
  }

  function manejarSeleccionCard(cardId) {
    if (selectedCard === cardId) {
      setSelectedCard(null);
    }

    if (selectedCard !== cardId) {
      setSelectedCard(cardId);
    }
  }

  function irAMareas() {
    router.push("/mareas/");
  }

  function irAAlertas() {
    router.push("/alertas");
  }

  function alternarAlertas(tipo) {
    setAlertasAbiertas(function (actual) {
      return {
        ...actual,
        [tipo]: !actual[tipo],
      };
    });
  }

  async function descartarAlertaDashboard(id) {
    const ids = await descartarAlerta(id);
    setAlertasDescartadas(ids);
  }

  useEffect(function () {
    let activo = true;
    let intervalo = null;

    async function cargarDatos() {
      const enfermedades = await enfermedadesService.getAll();
      const resumenEnfermedad = await enfermedadesService.getResumenDashboard();

      const parasitos = await parasitologiaService.getAll();
      const resumenParasitos = await parasitologiaService.getResumenDashboard();

      if (activo === true) {
        setFincasData([...fincasModulo]);
        setEstanquesData([...estanquesModulo]);
        setSiembrasData(obtenerSiembras());
        setProductosInventario(getProductosInventario());
        setEquiposData([...EQUIPOS_MOCK]);
        setRegistrosEnfermedades(enfermedades);
        setResumenEnfermedades(resumenEnfermedad);
        setRegistrosParasitologia(parasitos);
        setResumenParasitologia(resumenParasitos);
      }
    }

    async function cargarDescartadas() {
      const ids = await obtenerAlertasDescartadas();

      if (activo === true) {
        setAlertasDescartadas(ids);
      }
    }

    recargar();
    cargarDatos();
    cargarDescartadas();

    intervalo = setInterval(function () {
      recargar();
      cargarDatos();
    }, 5000);

    return function () {
      activo = false;

      if (intervalo !== null) {
        clearInterval(intervalo);
      }
    };
  }, []);

  return (
    <SafeAreaView style={STYLE.container}>
      <ScrollView
        contentContainerStyle={[STYLE.contentWrapper, styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerIconBox}>
            <Icon icon={ICONS.dashboard} size={24} color={COLORS.primary} />
          </View>

          <View style={styles.headerTextBox}>
            <Title level={5} style={styles.headerTitle}>
              Dashboard general
            </Title>

            <CustomText
              size={12}
              color={COLORS.white}
              style={styles.headerSubtitle}
              numberOfLines={1}
            >
              Resumen operativo, sanitario y alertas
            </CustomText>
          </View>
        </View>

        <MareasAccessCard onPress={irAMareas} />

        <AlertasPanel
          alertas={alertasDashboard}
          abiertos={alertasAbiertas}
          onToggle={alternarAlertas}
          onDismiss={descartarAlertaDashboard}
          onViewAll={irAAlertas}
        />

        <View style={gridStyles}>
          <StatCard
            id="fincas"
            selectedId={selectedCard}
            onPress={function () {
              manejarSeleccionCard("fincas");
            }}
            icon={ICONS.home}
            value={fincasDashboard.length}
            label="Fincas registradas"
            cardStyle={styles.cardBlue}
            iconStyle={styles.iconBlue}
            iconColor={COLORS.primary}
            isTablet={isTablet}
          />

          <StatCard
            id="estanques"
            selectedId={selectedCard}
            onPress={function () {
              manejarSeleccionCard("estanques");
            }}
            icon={ICONS.waterFlow}
            value={estanquesData.length}
            label="Estanques registrados"
            cardStyle={styles.cardIndigo}
            iconStyle={styles.iconIndigo}
            iconColor={COLORS.primary}
            isTablet={isTablet}
          />

          <StatCard
            id="casos"
            selectedId={selectedCard}
            onPress={function () {
              manejarSeleccionCard("casos");
            }}
            icon={ICONS.shieldAlert}
            value={totalCasosSanitarios}
            label="Casos sanitarios"
            cardStyle={styles.cardYellow}
            iconStyle={styles.iconYellow}
            iconColor={COLORS.warning}
            isTablet={isTablet}
          />

          <StatCard
            id="mortalidad"
            selectedId={selectedCard}
            onPress={function () {
              manejarSeleccionCard("mortalidad");
            }}
            icon={ICONS.mortality}
            value={formatearNumero(totalMortalidad)}
            label="Mortalidad total"
            cardStyle={styles.cardRed}
            iconStyle={styles.iconRed}
            iconColor={COLORS.error}
            danger={true}
            isTablet={isTablet}
          />
        </View>

        {selectedCard === "fincas" && (
          <FincasPanel fincas={fincasDashboard} estanques={estanquesData} />
        )}

        {selectedCard === "estanques" && (
          <EstanquesPanel
            estanques={estanquesData}
            alimentacionSemanal={alimentacionSemanal}
          />
        )}

        {selectedCard === "casos" && (
          <CasosPanel
            resumenEnfermedades={resumenEnfermedades}
            resumenParasitologia={resumenParasitologia}
            registrosEnfermedades={registrosEnfermedades}
            registrosParasitologia={registrosParasitologia}
          />
        )}

        {selectedCard === "mortalidad" && (
          <MortalidadPanel
            resumenEnfermedades={resumenEnfermedades}
            registrosEnfermedades={registrosEnfermedades}
          />
        )}

        <UltimosRegistros registros={ultimosRegistros} />
      </ScrollView>
    </SafeAreaView>
  );
}
