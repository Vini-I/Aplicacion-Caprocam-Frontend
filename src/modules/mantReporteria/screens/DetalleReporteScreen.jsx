/**
 * ============================================================
 * PANTALLA DE DETALLE DE REGISTROS DEL MÓDULO DE REGISTROS
 * ============================================================
 *
 * Muestra el historial de registros filtrado por tipo_registro finca, estanque y fecha,
 * permitiendo revisar los registros de forma organizada.
 */


import { ScrollView, View } from "react-native";

import Card from "../../../shared/components/Card.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";
import Alert from "../../../shared/components/Alert.jsx";

import CardCrecimiento from "../components/CardCrecimiento.jsx";
import CardParasitologia from "../components/CardParasitologia.jsx";
import CardEnfermedades from "../components/CardEnfermedades.jsx";
import CardRaleo from "../components/CardRaleo.jsx";
import CardAlimentacion from "../components/CardAlimentacion.jsx";
import CardDensidadPoblacional from "../components/CardDensidadPoblacional.jsx";

import { useDetalleReporte } from "../hooks/useDetalleReporte.js";
import { TIPOS_REGISTRO, TIPOS_AUTOGESTIONADOS } from "../constants/tipoReporte.js";

import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";

import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/DetalleReporteStyle.js";

export default function DetalleReporteScreen() {

  const {
    registroTipo,
    finca,
    estanque,

    fincas,
    estanquesFiltrados,

    registros,
    loading,
    filtrosCompletos,

    setRegistroTipo,
    setFinca,
    setEstanque,

    alert,
    setAlert,
  } = useDetalleReporte();

  return (
    <View style={styles.background}>
      <NavbarRegistro
        Titulo="Detalle Registro"
        Subtitulo="Historico Registros"
        Icono="document"
      />
      <ScrollView>
        <View style={STYLE.container}>
          <View style={STYLE.contentWrapper}>
            {alert === "deleted" && (
              <Alert style={styles.alertIncorrect}>
                Registro eliminado correctamente
              </Alert>
            )}
            {alert === "edited" && (
              <Alert style={styles.alertCorrect}>
                Registro editado correctamente
              </Alert>
            )}
            <Card>
              <View>
                <Text size={16} style={styles.filterTitle}>
                  <Icon style={styles.icon} icon={ICONS.filter} color={COLORS.primary} size={18} />
                  Filtrar Detalle
                </Text>

                <Text style={styles.filterDescription} size={15}>
                  Seleccione la información solicitada
                </Text>
              </View>

              <View style={styles.filtersSection}>
                <View>
                  <View style={styles.inputItem}>
                    <Select
                      label="Seleccione Registro"
                      placeholder="Todos los Registros"
                      options={TIPOS_REGISTRO}
                      value={registroTipo}
                      onChange={setRegistroTipo}
                    />
                  </View>
                </View>


                <View style={styles.inputs}>
                  <View style={styles.inputItem}>
                    <Select
                      label="Seleccione Finca"
                      placeholder="Todas las fincas"
                      options={fincas}
                      value={finca}
                      onChange={setFinca}
                    />
                  </View>

                  <View style={styles.inputItem}>
                    <Select
                      label="Seleccione Estanque"
                      placeholder="Todos los estanques"
                      options={estanquesFiltrados}
                      value={estanque}
                      onChange={setEstanque}
                    />
                  </View>
                </View>
              </View>

              {
                loading ? (

                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>
                      Cargando registros...
                    </Text>
                  </View>


                ) : !filtrosCompletos ? (

                  <View style={styles.emptyState}>

                    <Icon
                      icon={ICONS.filter}
                      size={48}
                      color={COLORS.textQuaternary}
                    />

                    <Text style={styles.emptyTitle}>
                      Seleccione los filtros
                    </Text>

                    <Text style={styles.emptyDescription}>
                      Seleccione un registro, finca y estanque para consultar.
                    </Text>

                  </View>


                ) : !TIPOS_AUTOGESTIONADOS.includes(registroTipo) && registros.length === 0 ? (

                  <View style={styles.emptyState}>

                    <Icon
                      icon={ICONS.document}
                      size={48}
                      color={COLORS.textQuaternary}
                    />

                    <Text style={styles.emptyTitle}>
                      No hay registros disponibles
                    </Text>

                    <Text style={styles.emptyDescription}>
                      No se encontraron registros con los filtros seleccionados.
                    </Text>

                  </View>


                ) : (

                  <View style={styles.lista}>

                    {
                      registroTipo === "crecimiento" && (
                        <CardCrecimiento
                          data={registros}
                        />
                      )
                    }

                    {
                      registroTipo === "parasitologia" && (
                        <CardParasitologia
                          data={registros}
                        />
                      )
                    }

                    {
                      registroTipo === "enfermedades" && (
                        <CardEnfermedades
                          data={registros}
                        />
                      )
                    }

                    {
                      registroTipo === "raleo" && (
                        <CardRaleo
                          data={registros}
                        />
                      )
                    }

                    {registroTipo === "alimentacion" && (
                      <CardAlimentacion
                        fincaId={finca}
                        estanqueId={estanque}
                        onAlertChange={setAlert}
                      />
                    )}

                    {
                      registroTipo === "densidad_poblacional" && (
                        <CardDensidadPoblacional
                          data={registros}
                        />
                      )
                    }

                  </View>
                )
              }
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}