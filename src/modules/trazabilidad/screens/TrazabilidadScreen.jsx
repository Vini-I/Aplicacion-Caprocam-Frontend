/**
 * ============================================================
 * TrazabilidadScreen
 * ============================================================
 *
 * Listado de movimientos de trazabilidad.
 *
 * Reglas importantes / restricciones:
 * - No introducir headers locales en pantallas que usan el header global.
 * - El botón fijo de acción debe colocarse fuera del ScrollView.
 *
 * Navegación / dependencias relevantes:
 * - Usa `useTrazabilidadList` para obtener datos y acciones.
 */
import { View, ScrollView } from "react-native";

import { styles } from "../styles/TrazabilidadStyles";
import { STYLE } from "../../../theme/style";

import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import EmptyState from "../../../shared/components/EmptyState";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import Footer from "../../../shared/components/Footer";

import SearchBar from "../../inventarios/components/SearchBar";
import FilterButton from "../components/FilterButton";
import { useTrazabilidadList } from "../hooks/useTrazabilidadList";

export default function TrazabilidadScreen() {
  const {
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
    registrosFiltrados,
    fincas,
    colaboradores,
    hayFiltrosActivos,
    limpiarBusqueda,
    nuevoRegistro,
    abrirDetalle,
    
  } = useTrazabilidadList();

  function renderRegistro(registro) {
    return (
      <Button onPress={() => abrirDetalle(registro.id)} style={styles.touchable} key={registro.id}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.fincaText}>{registro.fincaNombre}</Text>
            <Text style={styles.fechaText}>{registro.fecha}</Text>
          </View>

          <Text style={styles.colaboradorText}>
            Responsable: {registro.colaboradorNombre}
          </Text>

          <View style={styles.movimiento}>
            <Text style={styles.estanqueText} numberOfLines={1}>
              {registro.estanqueOrigenLabel}
            </Text>

            <Icon
              icon={ICONS.arrowLongRight}
              size={32}
              color={COLORS.primary}
              style={styles.flechaIcon}
            />

            <Text style={styles.estanqueText} numberOfLines={1}>
              {registro.estanqueDestinoLabel}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.dato}>
              <Text style={styles.datoLabel}>PL</Text>
              <Text style={styles.datoValor}>
                {Number(registro.pl ?? 0).toLocaleString()}
              </Text>
            </View>

            <View style={styles.dato}>
              <Text style={styles.datoLabel}>Tamaño</Text>
              <Text style={styles.datoValor}>{registro.tamaño}g</Text>
            </View>

            <View style={styles.dato}>
              <Text style={styles.datoLabel}>Días</Text>
              <Text style={styles.datoValor}>{registro.dias}</Text>
            </View>
          </View>
        </Card>
      </Button>
    );
  }

  return (
    <View style={STYLE.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={STYLE.contentWrapper}>
          <View style={styles.busquedaRow}>
            <SearchBar
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder="Buscar por finca, estanque o responsable..."
              containerStyle={styles.searchBarContainer}
            />

            <FilterButton
              fincas={fincas}
              colaboradores={colaboradores}
              activeFilters={filtros}
              onApply={setFiltros}
              style={styles.filterButton}
            />
          </View>

          <Text style={styles.contadorResultados}>
            {registrosFiltrados.length} registro
            {registrosFiltrados.length === 1 ? "" : "s"} encontrado
            {registrosFiltrados.length === 1 ? "" : "s"}
          </Text>

          <View style={styles.lista}>
            {registrosFiltrados.length === 0 ? (
              <EmptyState
                title={
                  hayFiltrosActivos
                    ? "Sin resultados"
                    : "Aún no hay registros"
                }
                description={
                  hayFiltrosActivos
                    ? "No se encontraron registros con los criterios seleccionados."
                    : "Cuando registres un movimiento de pre-cría a engorde, aparecerá aquí."
                }
                action={
                  hayFiltrosActivos ? (
                    <Button variant="outline" onPress={limpiarBusqueda}>
                      Limpiar búsqueda
                    </Button>
                  ) : (
                    <Button variant="outline" onPress={nuevoRegistro}>
                      Agregar trazabilidad
                    </Button>
                  )
                }
                style={styles.vacioContainer}
                titleStyle={styles.vacioTitulo}
                descriptionStyle={styles.vacioTexto}
              >
                <Icon
                  icon={ICONS.transfer}
                  size={48}
                  style={styles.vacioIcono}
                />
              </EmptyState>
            ) : (
              registrosFiltrados.map(renderRegistro)
            )}
          </View>
        </View>
      </ScrollView>

      <Footer
        fixedBottom
        children={
          <View style={[STYLE.contentWrapper, styles.footerContent]}>
            <View style={styles.footerActions}>
              <Button variant="outline" onPress={nuevoRegistro} style={styles.fullButton}>
                + Agregar movimiento
              </Button>
            </View>
          </View>
        }
      />

    </View>
  );
}
