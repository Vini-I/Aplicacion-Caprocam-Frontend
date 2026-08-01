/*
//////////////////////////////////////////////////////////
CABEZA DE ARCHIVO
//////////////////////////////////////////////////////////
Archivo: DashboardAlertas.jsx
Autor: Gerald Andres Alfaro Solorzano
Fecha: 30/07/2026
Modulo: Dashboard
Descripcion:
Renderiza las alertas operativas agrupadas por tipo
y categoria dentro del Dashboard.
//////////////////////////////////////////////////////////
*/

import { View } from "react-native";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import CustomText from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { obtenerCategoriasAlertas, obtenerResumenAlertas } from "../utils/DashboardUtils";
import { styles } from "../styles/DashboardStyle";

function obtenerColorTipo(tipo) {
  return tipo === "critica" ? COLORS.error : tipo === "advertencia" ? COLORS.warning : COLORS.primary;
}

function obtenerIconoTipo(tipo) {
  return tipo === "critica" ? ICONS.shieldAlert : tipo === "advertencia" ? ICONS.alertTriangle : ICONS.info;
}

export default function DashboardAlertas({ alertas, abiertos, onToggle, onDismiss, onViewAll }) {
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
        const categorias = obtenerCategoriasAlertas(grupo.alertas);
        const nombresCategorias = Object.keys(categorias);
        const color = obtenerColorTipo(grupo.tipo);
        const icono = obtenerIconoTipo(grupo.tipo);
        const iconoDropdown = abiertos[grupo.tipo] ? ICONS.chevronUp : ICONS.chevronDown;

        return (
          <View key={grupo.tipo} style={styles.alertDropdownGroup}>
            <Button variant="outline" style={styles.alertDropdownHeader} onPress={() => onToggle(grupo.tipo)}>
              <View style={styles.alertDropdownLeft}>
                <Icon icon={icono} size={18} color={color} />

                <CustomText size={14} color={COLORS.textSecondary} style={styles.alertDropdownTitle}>
                  {grupo.titulo}
                </CustomText>
              </View>

              <View style={styles.alertDropdownRight}>
                <CustomText size={12} color={color} weight="800">
                  {grupo.alertas.length}
                </CustomText>

                <Icon icon={iconoDropdown} size={20} color={COLORS.textTertiary} />
              </View>
            </Button>

            {abiertos[grupo.tipo] && (
              <View style={styles.alertDropdownBody}>
                {grupo.alertas.length === 0 && (
                  <View style={styles.emptyAlertBoxSmall}>
                    <CustomText size={12} color={COLORS.textTertiary} align="center">
                      No hay alertas en este tipo.
                    </CustomText>
                  </View>
                )}

                {nombresCategorias.map(function (categoria) {
                  return (
                    <View key={categoria}>
                      <CustomText size={11} color={COLORS.textTertiary} style={styles.alertCategoryTitle}>
                        {categoria}
                      </CustomText>

                      {categorias[categoria].map(function (alerta, index) {
                        const alertaStyle = [
                          styles.alertItem,
                          alerta.tipo === "critica"
                            ? styles.alertCritical
                            : alerta.tipo === "advertencia"
                              ? styles.alertWarning
                              : styles.alertInfo,
                        ];

                        return (
                          <View key={alerta.id ?? `${grupo.tipo}-${categoria}-${index}`} style={alertaStyle}>
                            <View style={styles.alertIconContainer}>
                              <Icon icon={alerta.icono} size={18} color={alerta.color} />
                            </View>

                            <View style={styles.alertContent}>
                              <View style={styles.alertTitleRow}>
                                <CustomText size={14} weight="800" color={COLORS.textSecondary} numberOfLines={1}>
                                  {alerta.titulo}
                                </CustomText>

                                <Button variant="outline" style={styles.alertDismissButton} onPress={() => onDismiss(alerta.id)}>
                                  <Icon icon={ICONS.close} size={16} color={COLORS.textTertiary} />
                                </Button>
                              </View>

                              <CustomText size={12} color={COLORS.textTertiary} style={styles.alertMessage}>
                                {alerta.mensaje}
                              </CustomText>

                              {alerta.detalle !== "" && (
                                <CustomText size={12} color={COLORS.textSecondary} style={styles.alertDetail}>
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

      <Button variant="outline" style={styles.viewAllAlertsButton} onPress={onViewAll}>
        <View style={styles.inlineButtonContentCentered}>
          <Icon icon={ICONS.notification} size={18} color={COLORS.primary} />

          <CustomText size={14} color={COLORS.primary} style={styles.viewAllAlertsText}>
            Ver todas las alertas
          </CustomText>
        </View>
      </Button>
    </Card>
  );
}