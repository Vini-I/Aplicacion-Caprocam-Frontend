/**
 * ============================================================
 * COMPONENTE INVENTARIOFILTROS
 * ============================================================
 *
 * Responsabilidad:
 * Wrapper para el panel de filtros de inventario. Maneja estado
 * temporal de filtros antes de aplicar y usa componentes compartidos
 * para la UI (FilterPanel, FilterChip, DateInput, FilterActions).
 *
 * Props:
 * categories: Lista de categorías disponibles
 * suppliers: Lista de proveedores disponibles
 * units: Lista de unidades disponibles
 * activeFilters: Filtros actualmente activos
 * onApply: Función para aplicar filtros
 * showLowStock: Muestra filtro de stock bajo
 * showExpiryDate: Muestra filtro de fecha de caducidad
 * buttonStyle: Estilos adicionales para el botón
 * 
 * Estado:
 *  visible: Controla apertura/cierre del modal
 *  pendientes: Filtros temporales antes de aplicar
 * 
 * Dependencias:
 *  shared/components: Button, Modal, FilterPanel, FilterChip, DateInput, Text, Icons
 *  theme: colors, icons
 *  styles: InventarioFiltrosStyles
 */

import { useEffect, useState, useMemo } from "react";
import { View, ScrollView } from "react-native";

import Button from "../../../shared/components/Button";
import Modal from "../../../shared/components/Modal";
import FilterPanel, {
  FilterActions,
} from "../../../shared/components/FilterPanel";
import FilterChip from "../../../shared/components/FilterChip";
import DateInput from "../../../shared/components/DateInput";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";

import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

import { styles } from "../styles/InventarioFiltrosStyles";

const FILTROS_VACIOS = {
  categories: [],
  suppliers: [],
  units: [],
  lowStock: false,
  expiryDate: "",
};

function contarFiltrosActivos(filtros) {
  if (!filtros) return 0;

  let total = 0;
  total += filtros.categories?.length || 0;
  total += filtros.suppliers?.length || 0;
  total += filtros.units?.length || 0;
  if (filtros.lowStock === true) total += 1;
  if (filtros.expiryDate && filtros.expiryDate !== "") total += 1;
  return total;
}

function alternarValor(lista, valor) {
  return lista.includes(valor)
    ? lista.filter((item) => item !== valor)
    : [...lista, valor];
}

export default function InventarioFiltros({
  categories = [],
  suppliers = [],
  units = [],
  activeFilters = FILTROS_VACIOS,
  onApply,
  showLowStock = false,
  showExpiryDate = false,
  buttonStyle,
}) {
  const [visible, setVisible] = useState(false);
  const [pendientes, setPendientes] = useState(activeFilters);

  const totalActivos = useMemo(() => {
    return contarFiltrosActivos(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    if (visible) {
      setPendientes(activeFilters);
    }
  }, [visible, activeFilters]);

  function abrirPanel() {
    setVisible(true);
  }

  function cerrarPanel() {
    setVisible(false);
  }

  function limpiarFiltros() {
    onApply(FILTROS_VACIOS);
    setPendientes(FILTROS_VACIOS);
    cerrarPanel();
  }

  function aplicarFiltros() {
    onApply(pendientes);
    cerrarPanel();
  }

  return (
    <View>
      <Button
        variant="outline"
        onPress={abrirPanel}
        style={[styles.botonFiltro, buttonStyle]}
      >
        <View style={styles.contenidoBoton}>
          <Icon icon={ICONS.filter} color={COLORS.primary} />
          <CustomText size={13} weight="600" color={COLORS.primary}>
            Filtros{totalActivos > 0 ? ` (${totalActivos})` : ""}
          </CustomText>
        </View>
      </Button>

      <Modal
        visible={visible}
        onClose={cerrarPanel}
        showCloseButton={false}
        containerStyle={styles.modalContainer}
      >
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <FilterPanel title="Filtros de inventario">
            {categories.length > 0 && (
              <View style={styles.seccion}>
                <CustomText
                  size={13}
                  weight="600"
                  color={COLORS.textSecondary}
                  style={styles.tituloSeccion}
                >
                  Categoría
                </CustomText>
                <View style={styles.filaChips}>
                  {categories.map((categoria) => (
                    <FilterChip
                      key={categoria}
                      label={categoria}
                      active={pendientes.categories.includes(categoria)}
                      onPress={() =>
                        setPendientes((prev) => ({
                          ...prev,
                          categories: alternarValor(prev.categories, categoria),
                        }))
                      }
                    />
                  ))}
                </View>
              </View>
            )}

            {suppliers.length > 0 && (
              <View style={styles.seccion}>
                <CustomText
                  size={13}
                  weight="600"
                  color={COLORS.textSecondary}
                  style={styles.tituloSeccion}
                >
                  Proveedor
                </CustomText>
                <View style={styles.filaChips}>
                  {suppliers.map((proveedor) => (
                    <FilterChip
                      key={proveedor}
                      label={proveedor}
                      active={pendientes.suppliers.includes(proveedor)}
                      onPress={() =>
                        setPendientes((prev) => ({
                          ...prev,
                          suppliers: alternarValor(prev.suppliers, proveedor),
                        }))
                      }
                    />
                  ))}
                </View>
              </View>
            )}

            {units.length > 0 && (
              <View style={styles.seccion}>
                <CustomText
                  size={13}
                  weight="600"
                  color={COLORS.textSecondary}
                  style={styles.tituloSeccion}
                >
                  Unidad
                </CustomText>
                <View style={styles.filaChips}>
                  {units.map((unidad) => (
                    <FilterChip
                      key={unidad}
                      label={unidad}
                      active={pendientes.units.includes(unidad)}
                      onPress={() =>
                        setPendientes((prev) => ({
                          ...prev,
                          units: alternarValor(prev.units, unidad),
                        }))
                      }
                    />
                  ))}
                </View>
              </View>
            )}

            {showLowStock && (
              <View style={styles.seccion}>
                <CustomText
                  size={13}
                  weight="600"
                  color={COLORS.textSecondary}
                  style={styles.tituloSeccion}
                >
                  Existencias
                </CustomText>
                <View style={styles.filaChips}>
                  <FilterChip
                    label="Solo stock bajo"
                    active={pendientes.lowStock}
                    onPress={() =>
                      setPendientes((prev) => ({
                        ...prev,
                        lowStock: !prev.lowStock,
                      }))
                    }
                  />
                </View>
              </View>
            )}

            {showExpiryDate && (
              <View style={styles.seccion}>
                <DateInput
                  label="Caduca en o antes de"
                  value={pendientes.expiryDate}
                  onChangeText={(fecha) =>
                    setPendientes((prev) => ({
                      ...prev,
                      expiryDate: fecha,
                    }))
                  }
                  placeholder="Seleccione una fecha"
                />
              </View>
            )}

            <FilterActions onClear={limpiarFiltros} onApply={aplicarFiltros} />
          </FilterPanel>
        </ScrollView>
      </Modal>
    </View>
  );
}
