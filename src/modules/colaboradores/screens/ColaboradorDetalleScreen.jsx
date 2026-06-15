/**
 * ============================================================
 * COMPONENTE: ColaboradorDetalleScreen
 * ============================================================
 *
 * Pantalla que muestra el detalle completo de un colaborador,
 * incluyendo su información personal, estadísticas de actividad,
 * y (si es dueño externo) la lista de trabajadores a su cargo
 * con opción de búsqueda.
 *
 * Props:
 * - colaboradorId: string - ID del colaborador a mostrar
 * - onClose: función - se ejecuta al cerrar la pantalla
 * - onSelectTrabajador: función - se ejecuta al seleccionar un trabajador externo, recibe su ID
 *
 * Ejemplo:
 * <ColaboradorDetalleScreen
 *   colaboradorId="3"
 *   onClose={() => setModalVisible(false)}
 *   onSelectTrabajador={(id) => navegarADetalle(id)}
 * />
 */

// ============================================================
// IMPORTS
// ============================================================
import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colaboradoresService } from "../services/colaboradoresService";
import TrabajadoresExternosList from "../components/TrabajadoresExternosList";
import Spinner from "../../../shared/components/Spinner";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Input from "../../../shared/components/Input";

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ColaboradorDetalleScreen({ colaboradorId, onClose, onSelectTrabajador }) {
  // --------------------------------------------------------
  // ESTADOS
  // --------------------------------------------------------
  const [colaborador, setColaborador] = useState(null);
  const [trabajadores, setTrabajadores] = useState([]);
  const [trabajadoresFiltrados, setTrabajadoresFiltrados] = useState([]);
  const [externalOwner, setExternalOwner] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  // --------------------------------------------------------
  // EFECTOS LATERALES
  // --------------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [colab, stats] = await Promise.all([
          colaboradoresService.getColaboradorById(colaboradorId),
          colaboradoresService.getEstadisticasColaborador(colaboradorId),
        ]);
        setColaborador(colab);
        setEstadisticas(stats);

        if (colab.rol === "external_owner") {
          const trabajadoresData = await colaboradoresService.getTrabajadoresByOwner(colaboradorId);
          setTrabajadores(trabajadoresData);
          setTrabajadoresFiltrados(trabajadoresData);
        }

        // Solo mostrar dueño asociado para trabajadores externos
        if (colab.rol === "external_worker" && colab.externalOwnerId) {
          const owner = await colaboradoresService.getColaboradorById(colab.externalOwnerId);
          setExternalOwner(owner);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (colaboradorId) {
      loadData();
    }
  }, [colaboradorId]);

  // Filtrar trabajadores por búsqueda
  useEffect(() => {
    if (!searchText) {
      setTrabajadoresFiltrados(trabajadores);
    } else {
      const searchLower = searchText.toLowerCase();
      const filtrados = trabajadores.filter((colab) =>
        colab.nombre.toLowerCase().includes(searchLower) ||
        colab.telefono.includes(searchText) ||
        colab.email.toLowerCase().includes(searchLower) ||
        colab.cedula.includes(searchText)
      );
      setTrabajadoresFiltrados(filtrados);
    }
  }, [searchText, trabajadores]);

  // --------------------------------------------------------
  // CONSTANTES AUXILIARES
  // --------------------------------------------------------
  const rolLabels = {
    camprocam_worker: "Trabajador Camprocam",
    external_owner: "Dueño Externo",
    external_worker: "Trabajador Externo",
  };

  const rolVariant = {
    camprocam_worker: "info",
    external_owner: "warning",
    external_worker: "success",
  };

  // --------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // --------------------------------------------------------
  if (loading) return <Spinner text="Cargando detalle..." />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (!colaborador) return null;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
    <ScrollView style={styles.container}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕ Cerrar</Text>
        </TouchableOpacity>
      )}

      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{colaborador.nombre}</Text>
          <Badge label={rolLabels[colaborador.rol]} variant={rolVariant[colaborador.rol]} />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Cédula:</Text>
          <Text style={styles.value}>{colaborador.cedula}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{colaborador.telefono}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{colaborador.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Finca ID:</Text>
          <Text style={styles.value}>{colaborador.fincaId}</Text>
        </View>

        {/* Solo mostrar dueño asociado para trabajadores externos */}
        {externalOwner && colaborador.rol === "external_worker" && (
          <TouchableOpacity onPress={() => onSelectTrabajador?.(externalOwner.id)}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Asociado:</Text>
              <Text style={[styles.value, styles.link]}>{externalOwner.nombre}</Text>
            </View>
          </TouchableOpacity>
        )}
      </Card>

      {/* Estadísticas simples */}
      {estadisticas && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Actividad del colaborador</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{estadisticas.alimentaciones}</Text>
              <Text style={styles.statLabel}>Alimentaciones</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{estadisticas.estanquesCreados}</Text>
              <Text style={styles.statLabel}>Estanques creados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{estadisticas.siembrasRegistradas}</Text>
              <Text style={styles.statLabel}>Siembras registradas</Text>
            </View>
          </View>
          {estadisticas.ultimaActividad && (
            <Text style={styles.lastActive}>Última actividad: {estadisticas.ultimaActividad}</Text>
          )}
        </View>
      )}

      {/* Trabajadores a cargo con barra de búsqueda */}
      {colaborador.rol === "external_owner" && trabajadores.length > 0 && (
        <View style={styles.trabajadoresSection}>
          <View style={styles.searchContainer}>
            <Input
              placeholder="🔍 Buscar trabajador por nombre, teléfono, email o cédula"
              value={searchText}
              onChangeText={setSearchText}
              containerStyle={styles.searchInput}
            />
          </View>
          <TrabajadoresExternosList 
            trabajadores={trabajadoresFiltrados} 
            onSelectTrabajador={onSelectTrabajador}
          />
        </View>
      )}

      {/* Si no hay trabajadores, mostrar mensaje */}
      {colaborador.rol === "external_owner" && trabajadores.length === 0 && (
        <TrabajadoresExternosList 
          trabajadores={[]} 
          onSelectTrabajador={onSelectTrabajador}
        />
      )}
    </ScrollView>
  );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7FA" },
  closeButton: { padding: 16, alignItems: "flex-end" },
  closeButtonText: { color: "#009EF5", fontSize: 16, fontWeight: "600" },
  card: { margin: 16, marginBottom: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  name: { fontSize: 20, fontWeight: "700", color: "#1E3A5F", flex: 1, marginRight: 12 },
  infoRow: { flexDirection: "row", marginBottom: 8, flexWrap: "wrap" },
  label: { fontWeight: "bold", width: 110, color: "#1E3A5F" },
  value: { flex: 1, color: "#4E6482" },
  link: { color: "#009EF5", textDecorationLine: "underline" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  statsCard: { backgroundColor: "#ffffff", borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  statsTitle: { fontSize: 16, fontWeight: "700", color: "#1E3A5F", marginBottom: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  statItem: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#009EF5" },
  statLabel: { fontSize: 12, color: "#4E6482", marginTop: 4 },
  lastActive: { fontSize: 12, color: "#6c757d", textAlign: "center", marginTop: 8 },
  trabajadoresSection: { marginTop: 8 },
  searchContainer: { paddingHorizontal: 16, marginBottom: 8 },
  searchInput: { marginBottom: 0, backgroundColor: "#FFF", borderRadius: 8 },
});