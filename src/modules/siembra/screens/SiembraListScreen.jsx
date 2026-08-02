/**
 * =========================================================================
 * PANTALLA LISTADO DE SIEMBRAS
 * =========================================================================
 *
 * Pantalla encargada de mostrar el listado de siembras activas registradas
 * dentro del módulo de Siembra.
 *
 * FUNCIONALIDAD:
 *
 * 1. Obtiene y muestra las siembras registradas mediante el hook:
 *      - useSiembraList.
 *
 * 2. Renderiza cada siembra mediante la tarjeta informativa:
 *      - SiembraCard.
 *
 * 3. Permite navegar hacia:
 *      - Registro de una nueva siembra.
 *      - Detalle y edición de una siembra existente.
 *
 * 4. Muestra la cantidad total de siembras activas disponibles.
 *
 * 4.1 El hook useSiembraList oculta automáticamente del listado las
 *     siembras y pre-crías que ya completaron su ciclo, para que no se
 *     acumulen tarjetas de registros finalizados en esta pantalla. Esto
 *     solo las oculta de este listado: el registro no se borra.
 *
 * 5. Utiliza componentes visuales reutilizables para mantener la
 *    consistencia del diseño:
 *      - SiembraCard.
 *      - Botones, iconos.
 *
 * COMPONENTES UTILIZADOS:
 *
 * - SiembraCard: tarjeta de cada siembra/pre-cría.
 * - Button: acciones de navegación.
 * - Icon: representación visual de acciones.
 *
 * NAVEGACIÓN:
 * - /siembra/nueva
 *      Registro de una nueva siembra.
 *
 * - /siembra/detalle
 *      Visualización y edición de una siembra existente.
 *
 * IMPORTANTE:
 *
 * - No contiene lógica de negocio ni de navegación propia: todo
 *   proviene de useSiembraList.
 * - Mantiene únicamente la estructura visual de la pantalla.
 *
 * =========================================================================
 */
import { View, Text, ScrollView } from "react-native";
import { styles } from "../styles/SiembraListStyles";

import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import EmptyState from "../../../shared/components/EmptyState";
import SearchBar from "../../../shared/components/SearchBar";
import FilterButton from "../../../shared/components/FilterButton";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";

import SiembraCard from "../components/SiembraCard";
import useSiembraList from "../hooks/useSiembraList";

export default function SiembraListScreen() {
  const {
    busqueda,
    setBusqueda,

    filtros,
    setFiltros,

    tiposRegistro,

    siembrasFiltradas,

    handleNuevaSiembra,

    handleDetalleSiembra,
  } = useSiembraList();

  return (
    <View style={STYLE.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={STYLE.contentWrapper}>
          <View style={styles.contentHeader}>
            <View style={styles.cardTitleRow}>
              <Icon icon={ICONS.shrimp} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>
                Siembras y Pre-Crías ({siembrasFiltradas.length})
              </Text>
            </View>
          </View>

          <View style={styles.barraBusqueda}>
            <SearchBar
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder="Buscar finca, estanque, lote, proveedor..."
              containerStyle={styles.searchBarContainer}
            />
            <View style={styles.filterColumn}>
              <FilterButton
                categories={tiposRegistro}
                suppliers={[]}
                units={[]}
                activeFilters={filtros}
                onApply={setFiltros}
                showLowStock={false}
                showExpiryDate={false}
                buttonStyle={styles.filterButton}
              />
              <Button
                variant="outline"
                onPress={handleNuevaSiembra}
                style={[styles.newButton, styles.newButtonCompact]}
              >
                <View style={styles.newButtonContent}>
                  <Icon icon={ICONS.add} color={COLORS.primary} />
                  <Text style={styles.newButtonText} numberOfLines={1}>
                    Nueva Siembra
                  </Text>
                </View>
              </Button>
            </View>
          </View>

          <Text style={styles.contadorResultados}>
            {siembrasFiltradas.length}{" "}
            {siembrasFiltradas.length === 1
              ? "registro encontrado"
              : "registros encontrados"}
          </Text>

          {siembrasFiltradas.length === 0 ? (
            <EmptyState
              title="Sin registros"
              description="No se encontraron siembras o pre-crías con esta búsqueda o filtros."
            />
          ) : (
            siembrasFiltradas.map((registro) => (
              <SiembraCard
                key={`${registro.tipoRegistro}-${registro.id}`}
                registro={registro}
                fincaLabel={registro.fincaLabel}
                estanqueLabel={registro.estanqueLabel}
                onVerDetalle={() => handleDetalleSiembra(registro)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
