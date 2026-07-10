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
 */

// ============================================================
// IMPORTS
// ============================================================
import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useColaboradorDetalle } from "../hooks/useColaboradorDetalle";
import TrabajadoresExternosList from "../components/TrabajadoresExternosList";
import Spinner from "../../../shared/components/Spinner";
import Card from "../../../shared/components/Card";
import Badge from "../../../shared/components/Badge";
import Input from "../../../shared/components/Input";
import CustomText from "../../../shared/components/Text";
import Button from "../../../shared/components/Button";
import Icon from "../../../shared/components/Icons";
import { styles } from "../styles/colaboradorDetalleStyles";
import { COLORS } from "../../../theme/colors";
import { ICONS } from "../../../theme/icons";

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function ColaboradorDetalleScreen({ colaboradorId, onClose, onSelectTrabajador }) {
  const {
    colaborador,
    trabajadores,
    trabajadoresFiltrados,
    externalOwner,
    estadisticas,
    loading,
    error,
    searchText,
    setSearchText,
  } = useColaboradorDetalle(colaboradorId);

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
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;
  if (!colaborador) return null;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={true}
      >
        <Card style={styles.card}>
          <View style={styles.header}>
            <CustomText style={styles.name}>{colaborador.nombre}</CustomText>
            <Badge label={rolLabels[colaborador.rol]} variant={rolVariant[colaborador.rol]} />
          </View>

          <View style={styles.infoRow}>
            <CustomText style={styles.label}>Cédula:</CustomText>
            <CustomText style={styles.value}>{colaborador.cedula}</CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText style={styles.label}>Teléfono:</CustomText>
            <CustomText style={styles.value}>{colaborador.telefono}</CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText style={styles.label}>Correo:</CustomText>
            <CustomText style={styles.value}>{colaborador.email}</CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText style={styles.label}>Finca ID:</CustomText>
            <CustomText style={styles.value}>{colaborador.fincaId}</CustomText>
          </View>

          {externalOwner && colaborador.rol === "external_worker" && (
            <TouchableOpacity onPress={() => onSelectTrabajador?.(externalOwner.id)}>
              <View style={styles.infoRow}>
                <CustomText style={styles.label}>Asociado:</CustomText>
                <CustomText style={[styles.value, styles.link]}>{externalOwner.nombre}</CustomText>
              </View>
            </TouchableOpacity>
          )}
        </Card>

        {estadisticas && (
          <View style={styles.statsCard}>
            <CustomText style={styles.statsTitle}>Actividad del colaborador</CustomText>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <CustomText style={styles.statValue}>{estadisticas.alimentaciones}</CustomText>
                <CustomText style={styles.statLabel}>Alimentaciones</CustomText>
              </View>
              <View style={styles.statItem}>
                <CustomText style={styles.statValue}>{estadisticas.estanquesCreados}</CustomText>
                <CustomText style={styles.statLabel}>Estanques creados</CustomText>
              </View>
              <View style={styles.statItem}>
                <CustomText style={styles.statValue}>{estadisticas.siembrasRegistradas}</CustomText>
                <CustomText style={styles.statLabel}>Siembras registradas</CustomText>
              </View>
            </View>
            {estadisticas.ultimaActividad && (
              <CustomText style={styles.lastActive}>Última actividad: {estadisticas.ultimaActividad}</CustomText>
            )}
          </View>
        )}

        {colaborador.rol === "external_owner" && (
          <View style={styles.trabajadoresSection}>
            {trabajadores.length > 0 && (
              <>
                <View style={styles.searchContainer}>
                  <Input
                    placeholder="Buscar trabajador por nombre, teléfono, email o cédula"
                    value={searchText}
                    onChangeText={setSearchText}
                    containerStyle={styles.searchInput}
                  />
                </View>
                <TrabajadoresExternosList
                  trabajadores={trabajadoresFiltrados}
                  onSelectTrabajador={onSelectTrabajador}
                />
              </>
            )}
            {trabajadores.length === 0 && (
              <TrabajadoresExternosList
                trabajadores={[]}
                onSelectTrabajador={onSelectTrabajador}
              />
            )}
          </View>
        )}
      </ScrollView>

      {onClose && (
        <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: COLORS.secondary, backgroundColor: COLORS.white }}>
          <Button
            variant="outline"
            onPress={onClose}
            style={{ borderColor: COLORS.primary }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
              <CustomText style={{ color: COLORS.primary, fontWeight: '600' }}>Cerrar</CustomText>
            </View>
          </Button>
        </View>
      )}
    </View>
  );
}