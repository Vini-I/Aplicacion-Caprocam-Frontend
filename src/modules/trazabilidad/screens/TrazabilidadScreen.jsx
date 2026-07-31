/**
 * TrazabilidadScreen
 * Muestra el listado historico de movimientos de trazabilidad entre estanques con filtros y busqueda.
 * @dependencies - useTrazabilidadList, Card, Button, Alert, SearchBar, FilterButton
 * @validations - Filtra por finca, colaborador y texto de busqueda.
 * @navigation - Permite ir a /trazabilidad/agregar mediante el boton flotante + Registrar movimiento.
 */
import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { styles } from "../styles/TrazabilidadStyles";
import { STYLE } from "../../../theme/style";

import Alert from "../../../shared/components/Alert";
import Button from "../../../shared/components/Button";
import Card from "../../../shared/components/Card";
import EmptyState from "../../../shared/components/EmptyState";
import Icon from "../../../shared/components/Icons";
import Text from "../../../shared/components/Text";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";

import SearchBar from "../../../shared/components/SearchBar";
import FilterButton from "../components/FilterButton";
import { useTrazabilidadList, formatRegistroForView } from "../hooks/useTrazabilidadList";

export default function TrazabilidadScreen() {
  const params = useLocalSearchParams();
  const [visibleSuccessMessage, setVisibleSuccessMessage] = useState(
    typeof params.successMessage === "string" ? params.successMessage : ""
  );

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
    errorCarga,
    sesionExpirada,
    cerrarErrorCarga,
    irALogin,

  } = useTrazabilidadList();

  useEffect(() => {
    const successMessage =
      typeof params.successMessage === "string" ? params.successMessage : "";

    if (!successMessage) {
      setVisibleSuccessMessage("");
      return;
    }

    setVisibleSuccessMessage(successMessage);
    const timer = setTimeout(() => setVisibleSuccessMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [params.successMessage]);

  function renderRegistro(registro) {
    const r = formatRegistroForView(registro);
    return (
      <Button onPress={() => abrirDetalle(r.id)} style={styles.touchable} key={r.id}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.fincaText}>{r.fincaNombre}</Text>
            <Text style={styles.fechaText}>{r.fecha}</Text>
          </View>

          <Text style={styles.colaboradorText}>
            {r.responsableTexto || `Responsable: ${r.colaboradorNombre}`}
          </Text>

          <View style={styles.movimiento}>
            <Text style={styles.estanqueText} numberOfLines={1}>
              {r.estanqueOrigenLabel}
            </Text>

            <Icon
              icon={ICONS.arrowLongRight}
              size={32}
              color={COLORS.primary}
              style={styles.flechaIcon}
            />

            <Text style={styles.estanqueText} numberOfLines={1}>
              {r.estanqueDestinoLabel}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.dato}>
              <Text style={styles.datoLabel}>PL</Text>
              <Text style={styles.datoValor}>
                {r.plFormatted}
              </Text>
            </View>

            <View style={styles.dato}>
              <Text style={styles.datoLabel}>Tamaño</Text>
              <Text style={styles.datoValor}>{r.tamanoFormatted}</Text>
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
          {visibleSuccessMessage ? (
            <Alert
              variant="success"
              message={visibleSuccessMessage}
              style={styles.successAlert}
            />
          ) : null}

          {errorCarga !== "" && (
            <>
              <Alert
                variant="danger"
                message={errorCarga}
                style={styles.successAlert}
              />
              {sesionExpirada ? (
                <Button variant="outline" onPress={irALogin} style={styles.errorAlertButton}>
                  Ir a iniciar sesión
                </Button>
              ) : (
                <Button variant="outline" onPress={cerrarErrorCarga} style={styles.errorAlertButton}>
                  Cerrar
                </Button>
              )}
            </>
          )}


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
                  ) : undefined
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
      <View style={styles.floatingButtonContainer}>
        <Button variant="outline" onPress={nuevoRegistro} style={styles.fullButton}>
          + Registrar movimiento
        </Button>
      </View>
    </View>
  );
}
