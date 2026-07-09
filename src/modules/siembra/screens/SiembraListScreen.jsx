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
 * 1. Obtiene y muestra las siembras registradas mediante el servicio:
 *      - obtenerSiembras.
 *
 * 2. Renderiza cada siembra mediante una tarjeta informativa con:
 *      - Estanque asociado.
 *      - Finca correspondiente.
 *      - Estado actual.
 *      - Identificador de siembra.
 *      - Fecha de siembra.
 *      - Día actual del cultivo.
 *      - Cantidad sembrada.
 *      - Código de lote.
 *      - PL de larva.
 *
 * 3. Permite navegar hacia:
 *      - Registro de una nueva siembra.
 *      - Detalle y edición de una siembra existente.
 *
 * 4. Muestra la cantidad total de siembras activas disponibles.
 *
 * 5. Utiliza componentes visuales reutilizables para mantener la
 *    consistencia del diseño:
 *      - Cards.
 *      - Badges.
 *      - Botones.
 *      - Iconos.
 *
 * COMPONENTES UTILIZADOS:
 *
 * - Card: contenedor visual de cada siembra.
 * - Badge: indicador del estado de la siembra.
 * - Button: acciones de navegación.
 * - Icon: representación visual de acciones.
 *
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
 * - No modifica los datos de una siembra directamente.
 * - No contiene lógica de cálculo del ciclo productivo.
 * - Mantiene la responsabilidad de presentación y navegación.
 *
 * =========================================================================
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "../styles/SiembraListStyles";

import Button from "../../../shared/components/Button";
import Badge from "../../../shared/components/Badge";
import Card from "../../../shared/components/Card";
import Icon from "../../../shared/components/Icons";
import EmptyState from "../../../shared/components/EmptyState";
import SearchBar from "../../inventarios/components/SearchBar";
import FilterButton from "../../inventarios/components/FilterButton";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { STYLE } from "../../../theme/style";
import {
  obtenerFincas,
  obtenerProveedoresLarva,
  obtenerSiembras,
  subscribeToSiembras,
} from "../services/SiembraService";
import { useFocusEffect, useRouter } from "expo-router";

export default function SiembraListScreen() {
  const [siembras, setSiembras] = useState(() => obtenerSiembras());
  const [fincaLabels, setFincaLabels] = useState({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToSiembras(setSiembras);

    setSiembras(obtenerSiembras());
    const fincas = obtenerFincas();
    setFincaLabels(
      fincas.reduce((acc, finca) => {
        acc[finca.value] = finca.label;
        return acc;
      }, {}),
    );

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSiembras(obtenerSiembras());
    }, []),
  );

  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    categories: [],
    suppliers: [],
    units: [],
    lowStock: false,
    expiryDate: "",
  });

  const tiposRegistro = useMemo(
    () => [
      { label: "Siembra", value: "siembra" },
      { label: "Pre-Cría", value: "precria" },
    ],
    [],
  );

  const estadosRegistro = useMemo(
    () => [...new Set(siembras.map((registro) => registro.estado || ""))].filter(Boolean),
    [siembras],
  );

  const proveedoresRegistro = useMemo(() => {
    return obtenerProveedoresLarva();
  }, []);

  const siembrasFiltradas = useMemo(() => {
    return siembras.filter((registro) => {
      const texto = busqueda.toLowerCase();
      const coincideTexto =
        registro.finca.toLowerCase().includes(texto) ||
        registro.estanque.toLowerCase().includes(texto) ||
        registro.codigoLoteLarva.toLowerCase().includes(texto) ||
        (registro.proveedorLarva || "").toLowerCase().includes(texto);

      const registroTipo = registro.tipoRegistro || "siembra";
      const coincideTipo =
        filtros.categories.length === 0 ||
        filtros.categories.includes(registroTipo);

      const coincideProveedor =
        filtros.suppliers.length === 0 ||
        filtros.suppliers.includes(registro.proveedorLarva || "");

      return coincideTexto && coincideTipo && coincideProveedor;
    });
  }, [busqueda, filtros, siembras]);

  const handleNuevaSiembra = () => {
    router.push("/siembra/nueva");
  };

  const handleDetalleSiembra = (siembraId) => {
    router.push({
      pathname: "/siembra/detalle",
      params: { id: siembraId },
    });
  };

  function renderSiembra(registro) {
    const esPreCria = registro.tipoRegistro === "precria";

    return (
      <Card key={registro.siembraId} style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View style={styles.cardTitleRow}>
              <Icon icon={ICONS.water} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Estanque {registro.estanque}</Text>
            </View>
            <View style={styles.cardSubtitleRow}>
              <Text style={styles.cardSubtitle}>{fincaLabels[registro.finca] || registro.finca}</Text>
            </View>
          </View>

          <View style={styles.cardBadges}>
            <Badge
              label={esPreCria ? "Pre-Cría" : "Siembra"}
              variant={esPreCria ? "warning" : undefined}
              style={styles.statusBadge}
              textStyle={styles.statusText}
            />
            <Badge
              label={registro.estado}
              variant="success"
              style={styles.statusBadge}
              textStyle={styles.statusText}
            />
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <View style={styles.infoRowLabel}>
              <Text style={styles.infoLabel}>
                {esPreCria ? "Pre-Cría:" : "Siembra:"}
              </Text>
            </View>
            <Text style={styles.infoValue}>#{registro.siembraId}</Text>
          </View>

          {esPreCria ? (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoRowLabel}>
                  <Text style={styles.infoLabel}>Fecha de inicio:</Text>
                </View>
                <Text style={styles.infoValue}>{registro.fechaInicio}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoRowLabel}>
                  <Text style={styles.infoLabel}>Día de ciclo:</Text>
                </View>
                <Text style={styles.infoValue}>
                  {registro.diasCultivo} de {registro.duracionDias}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoRowLabel}>
                  <Text style={styles.infoLabel}>Cantidad inicial:</Text>
                </View>
                <Text style={styles.infoValue}>
                  {Number(registro.cantidadInicial ?? 0).toLocaleString()} camarones
                </Text>
              </View>

              {registro.estado === "Finalizada" && (
                <View style={styles.infoRow}>
                  <View style={styles.infoRowLabel}>
                    <Text style={styles.infoLabel}>Cantidad final:</Text>
                  </View>
                  <Text style={styles.infoValue}>
                    {Number(registro.cantidadFinal ?? 0).toLocaleString()} camarones
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoRowLabel}>
                  <Text style={styles.infoLabel}>Fecha:</Text>
                </View>
                <Text style={styles.infoValue}>{registro.fechaSiembra}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoRowLabel}>
                  <Text style={styles.infoLabel}>Día de cultivo:</Text>
                </View>
                <Text style={styles.infoValue}>
                  {registro.diasCultivo} de {registro.diasMaduracion}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoRowLabel}>
                  <Text style={styles.infoLabel}>Cantidad sembrada:</Text>
                </View>
                <Text style={styles.infoValue}>
                  {Number(registro.cantidadSembrada ?? 0).toLocaleString()} camarones
                </Text>
              </View>
            </>
          )}

          <View style={styles.infoRow}>
            <View style={styles.infoRowLabel}>
              <Text style={styles.infoLabel}>Lote:</Text>
            </View>
            <Text style={styles.infoValue}>{registro.codigoLoteLarva}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoRowLabel}>
              <Text style={styles.infoLabel}>PL:</Text>
            </View>
            <Text style={styles.infoValue}>
              {esPreCria
                ? registro.plFinal || registro.plInicial
                : registro.plSiembra || registro.plLarva}
            </Text>
          </View>
        </View>

        <Button
          variant="outline"
          onPress={() => handleDetalleSiembra(registro.siembraId)}
          style={styles.detailButton}
          textStyle={styles.detailButtonText}
        >
          <View style={styles.detailButtonContent}>
            <Icon icon={ICONS.edit} color={COLORS.primary} />
            <Text style={styles.detailButtonText}>Ver detalles / Editar</Text>
          </View>
        </Button>
      </Card>
    );
  }

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
                suppliers={proveedoresRegistro}
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
            {siembrasFiltradas.length} {siembrasFiltradas.length === 1 ? "registro encontrado" : "registros encontrados"}
          </Text>

          {siembrasFiltradas.length === 0 ? (
            <EmptyState
              title="Sin registros"
              description="No se encontraron siembras o pre-crías con esta búsqueda o filtros."
            />
          ) : (
            siembrasFiltradas.map(renderSiembra)
          )}
        </View>
      </ScrollView>
    </View>
  );
}
