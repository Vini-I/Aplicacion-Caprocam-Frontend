/**
 * ============================================================
 * COMPONENTE FILTERBUTTON (módulo Trazabilidad)
 * ============================================================
 *
 * Botón de filtrado con modal para el listado de Trazabilidad.
 * Mismo patrón visual que el FilterButton del módulo inventarios,
 * adaptado a los filtros relevantes de este módulo.
 *
 * Funcionalidad:
 * - Abre un modal desde la parte inferior de la pantalla.
 * - Filtra por finca con chips horizontales.
 * - Filtra por colaborador responsable con chips horizontales.
 * - Filtro por fecha del movimiento con DateInput.
 * - Badge en el botón con cantidad de filtros activos.
 * - Los filtros se aplican solo al presionar Aplicar.
 *
 * Props principales:
 * - fincas: array { label, value } - fincas disponibles.
 * - colaboradores: array { label, value } - colaboradores disponibles.
 * - activeFilters: objeto con los filtros activos actuales.
 * - onApply: función que recibe el objeto de filtros al aplicar.
 *
 * Estructura del objeto que recibe onApply:
 * {
 *   fincas: string[],
 *   colaboradores: string[],
 *   fecha: string,   // fecha en formato dd/mm/aaaa, vacío si no aplica
 * }
 *
 * Ejemplo:
 * <FilterButton
 *   fincas={fincas}
 *   colaboradores={colaboradores}
 *   activeFilters={filters}
 *   onApply={(f) => setFilters(f)}
 * />
 */
import { View, ScrollView } from "react-native";

import Modal from "../../../shared/components/Modal";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Title from "../../../shared/components/Title";
import Text from "../../../shared/components/Text";
import Badge from "../../../shared/components/Badge";
import Input from "../../../shared/components/Input";
import { useFilterButton } from "../hooks/useFilterButton";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";
import { styles, sectionStyles, chipStyles } from "../styles/FilterButtonStyles";

export default function FilterButton({
  fincas = [],
  colaboradores = [],
  activeFilters = {
    fincas: [],
    colaboradores: [],
    fecha: "",
  },
  onApply,
  style,
  containerStyle,
}) {
  const {
    modalVisible,
    pendingFincas,
    pendingEstanques,
    pendingColaboradores,
    pendingFecha,
    estanquesDisponibles,
    activeCount,
    setPendingFecha,
    abrirModal,
    cerrarModal,
    toggleFinca,
    toggleEstanque,
    toggleColaborador,
    limpiarFiltros,
    aplicarFiltros,
  } = useFilterButton({ activeFilters, onApply });

  const buttonVariant = activeCount > 0 ? "primary" : "outline";
  const buttonIconColor = activeCount > 0 ? COLORS.white : COLORS.textSecondary;
  const buttonTextColor = activeCount > 0 ? COLORS.white : COLORS.textSecondary;

  return (
    <>
      <View style={containerStyle}>
        <Button
          variant={buttonVariant}
          onPress={abrirModal}
          style={[
            styles.filterBtn,
            activeCount > 0 && styles.filterBtnActive,
            activeCount === 0 && styles.filterBtnInactive,
            style,
          ]}
        >
          <Icon
            icon={ICONS.filter}
            size={16}
            color={buttonIconColor}
          />
          <Text
            size={14}
            weight="500"
            color={buttonTextColor}
            style={styles.filterBtnText}
          >
            Filtrar
          </Text>
          {activeCount > 0 && (
            <Badge
              label={String(activeCount)}
              style={styles.badge}
              textStyle={styles.badgeText}
            />
          )}
        </Button>
      </View>

      <Modal
        visible={modalVisible}
        onClose={cerrarModal}
        showCloseButton={false}
        animationType="slide"
        overlayStyle={styles.overlay}
        containerStyle={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <Title level={4}>Filtros</Title>
          <Button variant="outline" onPress={cerrarModal} style={styles.closeBtn}>
            <Icon icon={ICONS.exit} size={18} color={COLORS.black} />
          </Button>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {fincas.length > 0 && (
            <FilterSection label="Finca">
              {fincas.map((finca) => (
                <Chip
                  key={finca.value}
                  label={finca.label}
                  selected={pendingFincas.includes(finca.value)}
                  onPress={() => toggleFinca(finca.value)}
                />
              ))}
            </FilterSection>
          )}

          {estanquesDisponibles.length > 0 && (
            <FilterSection label="Estanque">
              {estanquesDisponibles.map((estanque) => (
                <Chip
                  key={estanque.value}
                  label={estanque.label}
                  selected={pendingEstanques.includes(estanque.value)}
                  onPress={() => toggleEstanque(estanque.value)}
                />
              ))}
            </FilterSection>
          )}

          {colaboradores.length > 0 && (
            <FilterSection label="Responsable">
              {colaboradores.map((colaborador) => (
                <Chip
                  key={colaborador.value}
                  label={colaborador.label}
                  selected={pendingColaboradores.includes(colaborador.value)}
                  onPress={() => toggleColaborador(colaborador.value)}
                />
              ))}
            </FilterSection>
          )}

          <FilterSection label="Fecha del movimiento">
            <Input
              value={pendingFecha}
              onChangeText={setPendingFecha}
              placeholder="dd/mm/aaaa"
              keyboardType="numbers-and-punctuation"
              containerStyle={styles.dateInput}
            />
          </FilterSection>
        </ScrollView>

        <View style={styles.actions}>
          <Button variant="outline" onPress={limpiarFiltros} style={styles.btnClear}>
            Limpiar filtros
          </Button>
          <Button onPress={aplicarFiltros} style={styles.btnApply}>
            Aplicar
          </Button>
        </View>
      </Modal>
    </>
  );
}

function FilterSection({ label, children }) {
  return (
    <View style={sectionStyles.container}>
      <Text
        size={13}
        weight="600"
        color={COLORS.textSecondary}
        style={sectionStyles.label}
      >
        {label}
      </Text>
      <View style={sectionStyles.chipsRow}>{children}</View>
    </View>
  );
}

function Chip({ label, selected, onPress }) {
  return (
    <Button
      variant="outline"
      onPress={onPress}
      style={[chipStyles.chip, selected && chipStyles.chipSelected]}
    >
      <Text
        size={13}
        color={selected ? COLORS.primary : COLORS.textSecondary}
        weight={selected ? "600" : "400"}
      >
        {label}
      </Text>
    </Button>
  );
}


