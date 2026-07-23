/**
 * ============================================================
 * PANTALLA DE REPORTERIA
 * ============================================================
 *
 * Muestra registros de enfermedades, estanques y parasitologia.
 */

import { ScrollView, View } from "react-native";

import Card from "../../../shared/components/Card.jsx";
import Icon from "../../../shared/components/Icons.jsx";
import Select from "../../../shared/components/Select.jsx";
import Text from "../../../shared/components/Text.jsx";
import NavbarRegistro from "../../../shared/components/NavbarRegistro.jsx";

import { useReporteria } from "../hooks/useReporteria.js";
import { TIPOS_REGISTRO } from "../constants/tipoReporte.js";

import { COLORS } from "../../../theme/colors.js";
import { ICONS } from "../../../theme/icons.js";

import { STYLE } from "../../../theme/style.js";
import { styles } from "../styles/ReporteriaStyle.js";

export default function Reporteria() {
  const {
    registroTipo,
    finca,
    estanque,
    registros,
    loading,
    filtrosCompletos,
    opcionesFincas,
    opcionesEstanques,
    setRegistroTipo,
    setFinca,
    setEstanque,
  } = useReporteria();

  return (
    <View style={STYLE.container}>
      <NavbarRegistro
        Titulo="Reporteria"
        Subtitulo="Historico de registros"
        Icono="document"
      />

      <ScrollView showsVerticalScrollIndicator={false} style={STYLE.container}>
        <View style={STYLE.contentWrapper}>
          <Card>
            <View style={styles.headerRow}>
              <Text style={styles.cardTitle}>Detalle de Registro</Text>
            </View>

            <View>
              <Text size={16} style={styles.filterTitle}>
                <Icon
                  style={styles.icon}
                  icon={ICONS.filter}
                  color={COLORS.primary}
                  size={18}
                />
                Filtrar Detalle
              </Text>

              <Text style={styles.filterDescription} size={15}>
                Seleccione la informacion solicitada
              </Text>
            </View>

            <View style={styles.filtersSection}>
              <View style={styles.inputItemFull}>
                <Select
                  label="Seleccione Registro"
                  placeholder="Todos los Registros"
                  options={TIPOS_REGISTRO}
                  value={registroTipo}
                  onChange={setRegistroTipo}
                />
              </View>

              <View style={styles.inputs}>
                <View style={styles.inputItem}>
                  <Select
                    label="Seleccione Finca"
                    placeholder="Todas las fincas"
                    options={opcionesFincas}
                    value={finca}
                    onChange={setFinca}
                  />
                </View>

                <View style={styles.inputItem}>
                  <Select
                    label="Seleccione Estanque"
                    placeholder="Todos los estanques"
                    options={opcionesEstanques}
                    value={estanque}
                    onChange={setEstanque}
                  />
                </View>
              </View>
            </View>

            {loading === true && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Cargando registros...</Text>
              </View>
            )}

            {loading === false && filtrosCompletos === false && (
              <View style={styles.emptyState}>
                <Icon
                  icon={ICONS.filter}
                  size={48}
                  color={COLORS.textQuaternary}
                />

                <Text style={styles.emptyTitle}>Seleccione los filtros</Text>

                <Text style={styles.emptyDescription}>
                  Seleccione un tipo de registro para consultar reporteria.
                </Text>
              </View>
            )}

            {loading === false && filtrosCompletos === true && registros.length === 0 && (
              <View style={styles.emptyState}>
                <Icon
                  icon={ICONS.document}
                  size={48}
                  color={COLORS.textQuaternary}
                />

                <Text style={styles.emptyTitle}>No hay registros disponibles</Text>

                <Text style={styles.emptyDescription}>
                  No se encontraron registros con los filtros seleccionados.
                </Text>
              </View>
            )}

            {loading === false && registros.length > 0 && (
              <View style={styles.lista}>
                {registros.map(function (registro) {
                  return <RegistroItem key={registro.id} registro={registro} />;
                })}
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function RegistroItem({ registro }) {
  return (
    <View style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View style={styles.recordIconBox}>
          <Icon icon={ICONS.document} size={18} color={COLORS.primary} />
        </View>

        <View style={styles.recordHeaderText}>
          <Text style={styles.recordType}>{registro.tipo}</Text>
          <Text style={styles.recordTitle}>{registro.titulo}</Text>
        </View>
      </View>

      <View style={styles.recordInfoRow}>
        <Text style={styles.recordLabel}>Finca</Text>
        <Text style={styles.recordValue}>{registro.finca}</Text>
      </View>

      <View style={styles.recordInfoRow}>
        <Text style={styles.recordLabel}>Estanque</Text>
        <Text style={styles.recordValue}>{registro.estanque}</Text>
      </View>

      <View style={styles.recordInfoRow}>
        <Text style={styles.recordLabel}>Fecha</Text>
        <Text style={styles.recordValue}>{registro.fecha}</Text>
      </View>

      <Text style={styles.recordDetail}>{registro.detalle}</Text>
    </View>
  );
}
