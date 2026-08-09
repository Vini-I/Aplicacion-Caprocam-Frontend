/**
 * ============================================================
 * COMPONENTE FILTERBUTTON
 * ============================================================
 *
 * Boton de filtrado con modal para la lista de productos.
 * Disenado segun prototipo Figma del proyecto.
 *
 * Funcionalidad:
 * - Abre un modal desde la parte inferior de la pantalla.
 * - Filtra por clasificacion (categorias) con chips horizontales.
 * - Filtra por proveedor con chips horizontales.
 * - Filtra por unidad de medida con chips horizontales.
 * - Checkbox para solo mostrar productos con stock bajo.
 * - Filtro por fecha de caducidad con DateInput.
 * - Badge en el boton con cantidad de filtros activos.
 * - Los filtros se aplican solo al presionar Aplicar.
 * - Preparado para conectar al backend.
 *
 * IMPORTANTE (fix de animación, sin tocar shared/components/Modal):
 * - El componente Modal compartido anima el overlay (fondo gris) y el
 *   container como una sola unidad cuando animationType="slide", lo cual
 *   hacia que el fondo gris subiera junto con el panel.
 * - Aqui usamos animationType="none" en el Modal compartido (asi el
 *   overlay + su container aparecen de inmediato, sin efecto, tal como
 *   se pidio: "que nada mas aparezca la pantalla gris").
 * - El panel de filtros (fondo blanco) ahora es un Animated.View propio
 *   de este componente, que es el UNICO que se anima con translateY,
 *   deslizandose desde abajo hacia su posicion final.
 *
 * Props principales:
 * - categories: array de strings o array { label, value } - clasificaciones.
 * - suppliers: array de strings o array { label, value } - proveedores.
 * - units: array de strings o array { label, value } - unidades de medida.
 * - activeFilters: objeto con los filtros activos actuales.
 * - onApply: funcion que recibe el objeto de filtros al aplicar.
 *
 * Estructura del objeto que recibe onApply:
 * {
 *   categories: string[],
 *   suppliers: string[],
 *   units: string[],
 *   lowStock: boolean,
 *   expiryDate: string,   // fecha en formato dd/mm/aaaa, vacio si no aplica
 * }
 *
 * Ejemplo:
 * <FilterButton
 *   categories={categories}
 *   suppliers={suppliers}
 *   units={units}
 *   activeFilters={filters}
 *   onApply={(f) => setFilters(f)}
 * />
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

import Modal from "./Modal";
import Button from "./Button";
import Icon from "./Icons";
import Title from "./Title";
import CustomText from "./Text";
import Badge from "./Badge";
import DateInput from "./DateInput";

import { COLORS } from "../../theme/colors";
import { ICONS } from "../../theme/icons";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const PANEL_ANIM_MS = 260;

/**
 * Acepta tanto array de strings ["Alimento", "Insumos"]
 * como array de objetos [{ label: "Alimento", value: "alimento" }].
 * Siempre devuelve [{ label, value }].
 */
function normalize(arr) {
  return arr.map((item) =>
    typeof item === "string" ? { label: item, value: item } : item
  );
}

export default function FilterButton({
  categories = [],
  suppliers = [],
  units = [],
  activeFilters = {
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
  },
  onApply,
  showLowStock = true,    // ← nuevo prop, default true para inventarioScreen
  showExpiryDate = true,
  // Backwards-compatible: `style` applies to the inner Button.
  style,
  // New explicit props:
  buttonStyle,
  containerStyle,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const [pendingCategories, setPendingCategories] = useState([]);
  const [pendingSuppliers, setPendingSuppliers] = useState([]);
  const [pendingUnits, setPendingUnits] = useState([]);
  const [pendingLowStock, setPendingLowStock] = useState(false);
  const [pendingExpiryDate, setPendingExpiryDate] = useState("");

  // Animacion propia del panel (el unico elemento que sube/baja).
  // El fondo gris (overlay) NO usa este valor, por eso queda fijo.
  const panelTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (modalVisible) {
      // Aseguramos que arranque desde abajo cada vez que se abre.
      panelTranslateY.setValue(SCREEN_HEIGHT);
      Animated.timing(panelTranslateY, {
        toValue: 0,
        duration: PANEL_ANIM_MS,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const activeCount =
    (activeFilters.categories?.length || 0) +
    (activeFilters.suppliers?.length || 0) +
    (activeFilters.units?.length || 0) +
    (activeFilters.lowStock ? 1 : 0) +
    (activeFilters.expiryDate ? 1 : 0);

  function openModal() {
    setPendingCategories([...(activeFilters.categories || [])]);
    setPendingSuppliers([...(activeFilters.suppliers || [])]);
    setPendingUnits([...(activeFilters.units || [])]);
    setPendingLowStock(activeFilters.lowStock || false);
    setPendingExpiryDate(activeFilters.expiryDate || "");
    setModalVisible(true);
  }

  function closeModal() {
    // Bajamos el panel antes de cerrar el modal para que la salida
    // tambien se sienta natural (el gris no se mueve, solo el panel).
    Animated.timing(panelTranslateY, {
      toValue: SCREEN_HEIGHT,
      duration: PANEL_ANIM_MS,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  }

  function toggleItem(list, setList, value) {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function handleClear() {
    setPendingCategories([]);
    setPendingSuppliers([]);
    setPendingUnits([]);
    setPendingLowStock(false);
    setPendingExpiryDate("");
  }

  function handleApply() {
    if (onApply) {
      onApply({
        categories: pendingCategories,
        suppliers: pendingSuppliers,
        units: pendingUnits,
        lowStock: pendingLowStock,
        expiryDate: pendingExpiryDate,
      });
    }
    closeModal();
  }

  return (
    <>
      {/* ── Boton principal ── */}
      <View style={containerStyle}>
        <Button
          variant="outline"
          onPress={openModal}
          style={[
            styles.filterBtn,
            activeCount > 0 && styles.filterBtnActive,
            // prefer explicit `buttonStyle`, fall back to `style` for compat
            buttonStyle || style,
          ]}
        >
          <Icon
            icon={ICONS.filter}
            size={16}
            color={activeCount > 0 ? COLORS.primary : COLORS.textSecondary}
          />
          <CustomText
            size={14}
            weight="500"
            color={activeCount > 0 ? COLORS.primary : COLORS.textSecondary}
            style={styles.filterBtnText}
          >
            Filtrar
          </CustomText>
          {activeCount > 0 && (
            <Badge
              label={String(activeCount)}
              style={styles.badge}
              textStyle={styles.badgeText}
            />
          )}
        </Button>
      </View>

      {/* ── Modal ──
          animationType="none": el Modal compartido NO anima nada (ni el
          overlay ni su container interno). El overlay gris asi aparece
          de inmediato y se queda fijo. containerStyle es transparente:
          la unica pieza visible que se anima es el Animated.View de abajo. */}
      <Modal
        visible={modalVisible}
        onClose={closeModal}
        showCloseButton={false}
        animationType="none"
        overlayStyle={styles.overlay}
        containerStyle={styles.modalContainerTransparent}
      >
        {/* Panel real de filtros: unico elemento que se desliza. */}
        <Animated.View
          style={[
            styles.animatedPanel,
            { transform: [{ translateY: panelTranslateY }] },
          ]}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <Title level={4}>Filtros</Title>
            <Button variant="outline" onPress={closeModal} style={styles.closeBtn}>
              <Icon icon={ICONS.exit} size={18} color={COLORS.black} />
            </Button>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Seccion: Clasificacion — solo si llegan categorías */}
            {categories.length > 0 && (
              <FilterSection label="Clasificación">
                {normalize(categories).map((cat) => (
                  <Chip
                    key={cat.value}
                    label={cat.label}
                    selected={pendingCategories.includes(cat.value)}
                    onPress={() =>
                      toggleItem(pendingCategories, setPendingCategories, cat.value)
                    }
                  />
                ))}
              </FilterSection>
            )}

            {/* Seccion: Proveedor — solo si llegan suppliers */}
            {suppliers.length > 0 && (
              <FilterSection label="Proveedor">
                {normalize(suppliers).map((sup) => (
                  <Chip
                    key={sup.value}
                    label={sup.label}
                    selected={pendingSuppliers.includes(sup.value)}
                    onPress={() =>
                      toggleItem(pendingSuppliers, setPendingSuppliers, sup.value)
                    }
                  />
                ))}
              </FilterSection>
            )}

            {/* Seccion: Unidad de medida — solo si llegan units */}
            {units.length > 0 && (
              <FilterSection label="Unidad de medida">
                {normalize(units).map((unit) => (
                  <Chip
                    key={unit.value}
                    label={unit.label}
                    selected={pendingUnits.includes(unit.value)}
                    onPress={() =>
                      toggleItem(pendingUnits, setPendingUnits, unit.value)
                    }
                  />
                ))}
              </FilterSection>
            )}

            {/* Seccion: Fecha de caducidad — solo si se habilita explícitamente */}
            {showExpiryDate && (
              <FilterSection label="Fecha de caducidad">
                <DateInput
                  value={pendingExpiryDate}
                  onChangeText={setPendingExpiryDate}
                  allowFutureDates={true}
                  containerStyle={styles.dateInput}
                />
              </FilterSection>
            )}

            {/* Checkbox: Stock bajo — solo si se habilita explícitamente */}
            {showLowStock && (
              <Button
                variant="outline"
                onPress={() => setPendingLowStock((prev) => !prev)}
                style={styles.checkboxRow}
              >
                <CustomText size={14} color={COLORS.textPrimary} style={styles.checkboxLabel}>
                  Solo productos con stock bajo
                </CustomText>
                <View style={[styles.checkbox, pendingLowStock && styles.checkboxActive]}>
                  {pendingLowStock && (
                    <Icon icon={ICONS.check} size={14} color={COLORS.white} />
                  )}
                </View>
              </Button>
            )}

          </ScrollView>

          {/* Acciones */}
          <View style={styles.actions}>
            <Button variant="outline" onPress={handleClear} style={styles.btnClear}>
              Limpiar filtros
            </Button>
            <Button onPress={handleApply} style={styles.btnApply}>
              Aplicar
            </Button>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

// ── Subcomponente: seccion con label y fila de chips ──────────
function FilterSection({ label, children }) {
  return (
    <View style={sectionStyles.container}>
      <CustomText
        size={13}
        weight="600"
        color={COLORS.textSecondary}
        style={sectionStyles.label}
      >
        {label}
      </CustomText>
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

// ── Subcomponente: chip seleccionable ─────────────────────────
function Chip({ label, selected, onPress }) {
  return (
    <Button
      variant="outline"
      onPress={onPress}
      style={[chipStyles.chip, selected && chipStyles.chipSelected]}
    >
      <CustomText
        size={13}
        color={selected ? COLORS.primary : COLORS.textSecondary}
        weight={selected ? "600" : "400"}
      >
        {label}
      </CustomText>
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

// ── Estilos principales ───────────────────────────────────────
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
  // El container que le pasamos al Modal compartido ahora es transparente
  // y sin bordes: solo sirve para posicionar. El panel visible real es
  // `animatedPanel` (Animated.View) de aca abajo.
  modalContainerTransparent: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    padding: 0,
  },
  animatedPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    maxHeight: "90%",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.textTertiary,
    backgroundColor: COLORS.white,
    marginBottom: 8,
  },
  checkboxLabel: {
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.textTertiary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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