/**
 * ============================================================
 * SCREEN: PARASITOLOGIA
 * ============================================================
 *
 * Modulo para registrar parasitos por finca y estanque.
 * La logica vive en useParasitologiaScreen.
 */

import React from "react";

import {
  ScrollView,
  View,
} from "react-native";

import Alert from
  "../../../shared/components/Alert";

import Button from
  "../../../shared/components/Button";

import Card from
  "../../../shared/components/Card";

import DateInput from
  "../../../shared/components/DateInput";

import Icon from
  "../../../shared/components/Icons";

import Input from
  "../../../shared/components/Input";

import NumberInput from
  "../../../shared/components/NumberInput";

import Select from
  "../../../shared/components/Select";

import CustomText from
  "../../../shared/components/Text";

import Title from
  "../../../shared/components/Title";

import NavbarRegistro from
  "../../../shared/components/NavbarRegistro";

import useParasitologiaScreen from
  "../hooks/useParasitologiaScreen";

import { styles } from
  "../styles/ParasitologiaStyle";

import { COLORS } from
  "../../../theme/colors";

import { ICONS } from
  "../../../theme/icons";

import { TYPOGRAPHY } from
  "../../../theme/typography";

import { STYLE } from
  "../../../theme/style";

export default function ParasitologiaScreen({
  onBack,
  navigation,
}) {
  const pantalla =
    useParasitologiaScreen(
      onBack,
      navigation,
    );

  return (
    <>
      <NavbarRegistro
        Titulo="Parasitologia"
        Subtitulo="Registro por grados de infeccion"
        Icono="parasite"
      />

      <ScrollView
        style={STYLE.container}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={pantalla.contentStyle}
        >
          {pantalla.loading === true && (
            <Alert
              variant="info"
              message="Cargando datos de parasitologia..."
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

          {pantalla.error !== "" && (
            <Alert
              variant="danger"
              message={pantalla.error}
              style={styles.alert}
              textStyle={styles.alertText}
            />
          )}

          <Card>
            <SectionTitle
              title="Ubicacion del muestreo"
              icon={ICONS.document}
            />

            <View
              style={pantalla.gridStyle}
            >
              <View
                style={pantalla.itemStyle}
              >
                <Select
                  label="Finca"
                  required={true}
                  submitted={
                    pantalla.submitted
                  }
                  error={
                    pantalla
                      .erroresFormulario
                      .finca
                  }
                  options={
                    pantalla.opcionesFincas
                  }
                  value={
                    pantalla.finca
                  }
                  onChange={
                    pantalla.cambiarFinca
                  }
                  placeholder={
                    pantalla
                      .placeholderFinca
                  }
                  labelStyle={
                    styles.label
                  }
                />
              </View>

              <View
                style={pantalla.itemStyle}
              >
                <Select
                  label="Estanque"
                  required={true}
                  submitted={
                    pantalla.submitted
                  }
                  error={
                    pantalla
                      .erroresFormulario
                      .estanque
                  }
                  options={
                    pantalla
                      .opcionesEstanques
                  }
                  value={
                    pantalla.estanque
                  }
                  onChange={
                    pantalla.setEstanque
                  }
                  placeholder={
                    pantalla
                      .placeholderEstanque
                  }
                  disabled={
                    pantalla.finca === ""
                  }
                  labelStyle={
                    styles.label
                  }
                />
              </View>

              <View
                style={pantalla.itemStyle}
              >
                <DateInput
                  label="Fecha del reporte"
                  required={true}
                  submitted={
                    pantalla.submitted
                  }
                  error={
                    pantalla
                      .erroresFormulario
                      .fechaReporte
                  }
                  value={
                    pantalla.fechaReporte
                  }
                  onChangeText={
                    pantalla
                      .setFechaReporte
                  }
                  labelStyle={
                    styles.label
                  }
                />
              </View>

              <View
                style={pantalla.itemStyle}
                pointerEvents="none"
              >
                <Input
                  label="Responsable"
                  value={
                    pantalla.responsable
                  }
                  placeholder="Asignado por el backend"
                  editable={false}
                  readOnly={true}
                  selectTextOnFocus={false}
                  labelStyle={
                    styles.label
                  }
                />
              </View>
            </View>
          </Card>

          <Card>
            <SectionTitle
              title="Conteo parasitologico"
              icon={ICONS.microscope}
            />

            <View
              style={pantalla.gridStyle}
            >
              <View
                style={pantalla.itemStyle}
              >
                <Select
                  label="Parasito"
                  required={true}
                  submitted={
                    pantalla.submitted
                  }
                  error={
                    pantalla
                      .erroresFormulario
                      .parasito
                  }
                  options={
                    pantalla
                      .opcionesParasitos
                  }
                  value={
                    pantalla.parasito
                  }
                  onChange={
                    pantalla.setParasito
                  }
                  placeholder={
                    pantalla
                      .placeholderParasito
                  }
                  labelStyle={
                    styles.label
                  }
                />
              </View>

              <View
                style={pantalla.itemStyle}
              >
                <NumberInput
                  label="Camarones muestreados"
                  required={true}
                  submitted={
                    pantalla.submitted
                  }
                  error={
                    pantalla
                      .erroresFormulario
                      .camaronesMuestreados
                  }
                  value={
                    pantalla
                      .camaronesMuestreados
                  }
                  onChangeText={
                    pantalla
                      .setCamaronesMuestreados
                  }
                  min={0}
                  max={999999}
                  step={1}
                  labelStyle={
                    styles.label
                  }
                />
              </View>

              <View
                style={pantalla.itemStyle}
              >
                <NumberInput
                  label="Camarones infectados"
                  required={true}
                  submitted={
                    pantalla.submitted
                  }
                  error={
                    pantalla
                      .erroresFormulario
                      .camaronesInfectados
                  }
                  value={
                    pantalla
                      .camaronesInfectados
                  }
                  onChangeText={
                    pantalla
                      .setCamaronesInfectados
                  }
                  min={0}
                  max={999999}
                  step={1}
                  labelStyle={
                    styles.label
                  }
                />
              </View>

              <View
                style={
                  pantalla.itemFullStyle
                }
              >
                <View
                  style={styles.previewCard}
                >
                  <View
                    style={
                      styles.previewHeader
                    }
                  >
                    <Icon
                      icon={ICONS.report}
                      size={20}
                      color={COLORS.primary}
                    />

                    <CustomText
                      size={15}
                      color={
                        COLORS.textPrimary
                      }
                      style={
                        styles.previewTitle
                      }
                    >
                      Resultado calculado
                    </CustomText>
                  </View>

                  <View
                    style={
                      styles.previewGrid
                    }
                  >
                    <View
                      style={
                        styles.previewBox
                      }
                    >
                      <CustomText
                        size={12}
                        color={
                          COLORS.textTertiary
                        }
                        style={
                          styles.previewLabel
                        }
                      >
                        Muestreados
                      </CustomText>

                      <CustomText
                        size={20}
                        color={
                          COLORS.textSecondary
                        }
                        style={
                          styles.previewValue
                        }
                      >
                        {
                          pantalla
                            .camaronesMuestreados
                        }
                      </CustomText>
                    </View>

                    <View
                      style={
                        styles.previewBox
                      }
                    >
                      <CustomText
                        size={12}
                        color={
                          COLORS.textTertiary
                        }
                        style={
                          styles.previewLabel
                        }
                      >
                        Infectados
                      </CustomText>

                      <CustomText
                        size={20}
                        color={
                          COLORS.textSecondary
                        }
                        style={
                          styles.previewValue
                        }
                      >
                        {
                          pantalla
                            .camaronesInfectados
                        }
                      </CustomText>
                    </View>

                    <View
                      style={
                        styles.previewBox
                      }
                    >
                      <CustomText
                        size={12}
                        color={
                          COLORS.textTertiary
                        }
                        style={
                          styles.previewLabel
                        }
                      >
                        Porcentaje
                      </CustomText>

                      <CustomText
                        size={20}
                        color={
                          COLORS.textSecondary
                        }
                        style={
                          styles.previewValue
                        }
                      >
                        {
                          pantalla
                            .gradoCalculado
                            .porcentaje
                        }
                        %
                      </CustomText>
                    </View>
                  </View>

                  <View
                    style={styles.gradeBox}
                  >
                    <View
                      style={
                        styles.gradeHeader
                      }
                    >
                      <CustomText
                        size={14}
                        color={
                          COLORS.textSecondary
                        }
                      >
                        Grado de infeccion
                      </CustomText>

                      <View
                        style={
                          styles.gradeBadge
                        }
                      >
                        <CustomText
                          size={13}
                          color={
                            pantalla
                              .colorGrado
                          }
                          weight="800"
                        >
                          {
                            pantalla
                              .gradoCalculado
                              .nombre
                          }
                        </CustomText>
                      </View>
                    </View>

                    <CustomText
                      size={13}
                      color={
                        COLORS.textTertiary
                      }
                      style={
                        styles
                          .gradeDescription
                      }
                    >
                      {
                        pantalla
                          .gradoCalculado
                          .descripcion
                      }
                    </CustomText>
                  </View>
                </View>
              </View>

              <View
                style={
                  pantalla.itemFullStyle
                }
              >
                <Input
                  label="Observaciones"
                  value={
                    pantalla.observaciones
                  }
                  onChangeText={
                    pantalla
                      .setObservaciones
                  }
                  placeholder="Describa observaciones del muestreo"
                  multiline={true}
                  labelStyle={
                    styles.label
                  }
                  style={
                    styles.textArea
                  }
                />
              </View>
            </View>
          </Card>

          {pantalla.mensaje !== "" && (
            <Alert
              variant={
                pantalla.tipoMensaje
              }
              message={
                pantalla.mensaje
              }
              style={styles.alert}
              textStyle={
                styles.alertText
              }
            />
          )}

          <Button
            variant="outline"
            onPress={
              pantalla
                .registrarParasitologia
            }
            style={
              styles.outlinePrimaryButton
            }
            disabled={
              pantalla.loading
            }
          >
            <View
              style={
                styles
                  .inlineButtonContentCentered
              }
            >
              <Icon
                icon={ICONS.save}
                size={18}
                color={COLORS.primary}
              />

              <CustomText
                size={16}
                color={COLORS.primary}
                style={styles.saveText}
              >
                Registrar parasitologia
              </CustomText>
            </View>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

function SectionTitle({
  title,
  icon,
}) {
  return (
    <View
      style={styles.sectionTitleRow}
    >
      <Icon
        icon={icon}
        size={18}
        color={COLORS.primary}
      />

      <Title
        level={5}
        color={COLORS.textSecondary}
        fuente={
          TYPOGRAPHY.fontFamily.bold
        }
        style={styles.sectionTitle}
      >
        {title}
      </Title>
    </View>
  );
}