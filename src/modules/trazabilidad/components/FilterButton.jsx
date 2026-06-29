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

import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import Modal from "../../../shared/components/Modal";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import Title from "../../../shared/components/Title";
import Text from "../../../shared/components/Text";
import Badge from "../../../shared/components/Badge";
import DateInput from "../../../shared/components/DateInput";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

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
  const [modalVisible, setModalVisible] = useState(false);

  const [pendingFincas, setPendingFincas] = useState([]);
  const [pendingColaboradores, setPendingColaboradores] = useState([]);
  const [pendingFecha, setPendingFecha] = useState("");

  const activeCount =
    (activeFilters.fincas?.length || 0) +
    (activeFilters.colaboradores?.length || 0) +
    (activeFilters.fecha ? 1 : 0);

  function abrirModal() {
    setPendingFincas([...(activeFilters.fincas || [])]);
    setPendingColaboradores([...(activeFilters.colaboradores || [])]);
    setPendingFecha(activeFilters.fecha || "");
    setModalVisible(true);
  }

  function cerrarModal() {
    setModalVisible(false);
  }

  function toggleItem(list, setList, value) {
    setList((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  }

  function limpiarFiltros() {
    setPendingFincas([]);
    setPendingColaboradores([]);
    setPendingFecha("");
  }

  function aplicarFiltros() {
    if (onApply) {
      onApply({
        fincas: pendingFincas,
        colaboradores: pendingColaboradores,
        fecha: pendingFecha,
      });
    }

    cerrarModal();
  }

  return (
    <>
      <View style={containerStyle}>
        <Button
          variant="outline"
          onPress={abrirModal}
          style={[
            styles.filterBtn,
            activeCount > 0 && styles.filterBtnActive,
            style,
          ]}
        >
          <Icon
            icon={ICONS.filter}
            size={16}
            color={activeCount > 0 ? COLORS.primary : COLORS.textSecondary}
          />
          <Text
            size={14}
            weight="500"
            color={activeCount > 0 ? COLORS.primary : COLORS.textSecondary}
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
                  onPress={() =>
                    toggleItem(pendingFincas, setPendingFincas, finca.value)
                  }
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
                  onPress={() =>
                    toggleItem(
                      pendingColaboradores,
                      setPendingColaboradores,
                      colaborador.value,
                    )
                  }
                />
              ))}
            </FilterSection>
          )}

          <FilterSection label="Fecha del movimiento">
            <DateInput
              value={pendingFecha}
              onChangeText={setPendingFecha}
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

const sectionStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

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

const chipStyles = StyleSheet.create({
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: COLORS.textTertiary,
    backgroundColor: COLORS.white,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
});

const styles = StyleSheet.create({
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textTertiary,
    backgroundColor: COLORS.white,
  },
  filterBtnActive: {
    borderColor: COLORS.primary,
  },
  filterBtnText: {
    marginTop: 0,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 99,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: 0,
  },
  modalContainer: {
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    maxHeight: "90%",
    paddingBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: COLORS.textTertiary,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  dateInput: {
    flex: 1,
    marginBottom: 0,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  btnClear: {
    flex: 1,
    marginTop: 0,
  },
  btnApply: {
    flex: 1,
    marginTop: 0,
  },
});
