/**
 * Pantalla: TrazabilidadScreen
 *
 * Muestra el listado de registros de Trazabilidad (movimientos de
 * pre-cría a engorde) registrados en el sistema.
 *
 * Funcionalidades principales:
 * - Buscar registros por finca, estanque o responsable.
 * - Filtrar registros por finca, colaborador o fecha del movimiento.
 * - Mostrar cada registro mediante una tarjeta resumen.
 * - Abrir el detalle completo de un registro al presionar su tarjeta.
 * - Acceder al formulario para agregar un nuevo registro.
 *
 * Componentes utilizados:
 * - Navbar: encabezado principal de la pantalla.
 * - Button: acción para agregar un nuevo registro.
 * - SearchBar: búsqueda por finca, estanque o responsable.
 * - FilterButton: filtros por finca, colaborador y fecha.
 * - TrazabilidadCard: tarjeta reutilizable para mostrar cada registro.
 * - EmptyState: mensaje cuando no hay registros o no hay resultados.
 */
import { View, ScrollView } from "react-native";

import { styles } from "../styles/TrazabilidadStyles";

import Navbar from "../../../shared/components/Navbar";
import Button from "../../../shared/components/Button";
import EmptyState from "../../../shared/components/EmptyState";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import Title from "../../../shared/components/Title";
import { ICONS } from "../../../theme/icons";

import TrazabilidadCard from "../components/TrazabilidadCard";
import SearchBar from "../components/SearchBar";
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
    volver,
  } = useTrazabilidadList();

  function renderRegistro(registro) {
    return (
      <TrazabilidadCard
        key={registro.id}
        fincaNombre={registro.fincaNombre}
        fecha={registro.fecha}
        colaboradorNombre={registro.colaboradorNombre}
        estanqueOrigenLabel={registro.estanqueOrigenLabel}
        estanqueDestinoLabel={registro.estanqueDestinoLabel}
        pl={registro.pl}
        tamaño={registro.tamaño}
        dias={registro.dias}
        onPress={() => abrirDetalle(registro.id)}
        style={styles.tarjeta}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
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
                    <Button onPress={nuevoRegistro}>
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
    </View>
  );
}
