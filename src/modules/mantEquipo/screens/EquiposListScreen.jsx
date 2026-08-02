/**
 * ============================================================
 * COMPONENTE: EquiposListScreen
 * ============================================================
 * Módulo: Mantenimiento de Equipos
 *
 * Pantalla principal del módulo de equipos. Lista, busca, crea,
 * edita y elimina equipos. Ofrece acceso al módulo de mantenimiento.
 * Usa EmptyState diferenciado según si hay filtros activos o no hay datos.
 *
 * @dependencies - useEquiposListScreen (hooks)
 *               - SearchBar, Button, Alert, EmptyState, Spinner, FilterPanel, FilterChip (shared)
 *               - EquipoCard, EquipoDetalleScreen (mantEquipo)
 *               - STYLE (theme/style), COLORS, ICONS, equiposListStyles
 * @validations  - Confirmación de eliminación requiere coincidencia de código de equipo.
 *               - El filtro usa FilterPanel + FilterChip de shared/components.
 *               - El hook interno usa categories/suppliers; solo la presentación usa
 *                 nombres del dominio (tipo/estado).
 * @navigation   - navigateToMantEquipo → pantalla principal de mantenimiento.
 * ============================================================
 */

import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useEquiposListScreen } from "../hooks/useEquiposListScreen";
import EquipoCard from "../components/EquipoCard";
import EquipoForm from "../components/EquipoForm";
import EquipoDetalleScreen from "./EquipoDetalleScreen";
import Modal from "../../../shared/components/Modal";
import Spinner from "../../../shared/components/Spinner";
import Button from "../../../shared/components/Button";
import Title from "../../../shared/components/Title";
import Input from "../../../shared/components/Input";
import CustomText from "../../../shared/components/Text";
import Icon from "../../../shared/components/Icons";
import Alert from "../../../shared/components/Alert";
import EmptyState from "../../../shared/components/EmptyState";
import SearchBar from "../../../shared/components/SearchBar";
import FilterPanel, { FilterActions } from "../../../shared/components/FilterPanel";
import FilterChip from "../../../shared/components/FilterChip";
import { ICONS } from "../../../theme/icons";
import { COLORS } from "../../../theme/colors";
import { styles } from "../styles/equiposListStyles";
import { equiposService } from "../services/equiposService";

export default function EquiposListScreen() {
  const {
    equipos,
    loading,
    error,
    modalVisible,
    setModalVisible,
    setValidationError,
    editingEquipo,
    selectedEquipoId,
    setSelectedEquipoId,
    searchText,
    setSearchText,
    codigoConfirmacion,
    setCodigoConfirmacion,
    codigoError,
    setCodigoError,
    deleteTarget,
    setDeleteTarget,
    showConfirmModal,
    setShowConfirmModal,
    estanquesDisponibles,
    filtros,
    setFiltros,
    alert,
    formRef,
    equiposFinales,
    opcionesTipo,
    opcionesEstado,
    hayFiltrosActivos,
    handleAdd,
    handleDeletePress,
    confirmDelete,
    handleSubmit,
    handleToggle,
    openDetail,
    navigateToMantEquipo,
  } = useEquiposListScreen();

  // Controla visibilidad del panel de filtros
  const [filtroVisible, setFiltroVisible] = useState(false);

  // --------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // --------------------------------------------------------
  if (loading && equipos.length === 0) return <Spinner text="Cargando equipos..." />;
  if (error) return <CustomText style={styles.error}>Error: {error}</CustomText>;

  // --------------------------------------------------------
  // RENDER PRINCIPAL
  // --------------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.mainFlex}>
        <View style={styles.searchRow}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por nombre, código o descripción"
            containerStyle={styles.searchInput}
          />
          <Button
              variant={hayFiltrosActivos ? "primary" : "outline"}
              onPress={() => setFiltroVisible((v) => !v)}
              style={styles.filterButtonStyle}
            >
              <Icon icon={ICONS.filter} size={15} color={hayFiltrosActivos ? COLORS.white : COLORS.primary} />
              <CustomText style={{ color: hayFiltrosActivos ? COLORS.white : COLORS.primary }}>
                {hayFiltrosActivos ? "Filtros activos" : "Filtrar"}
              </CustomText>
            </Button>
          <Button
            variant="outline"
            onPress={navigateToMantEquipo}
            style={styles.btnAction}
          >
            <Icon icon={ICONS.clipboard} size={16} color={COLORS.primary} />
            <CustomText style={styles.btnActionText}>Ver Mantenimiento</CustomText>
          </Button>
        </View>

        {filtroVisible && (
          <FilterPanel title="Filtros">
            <CustomText style={styles.filterGroupLabel}>Tipo de equipo</CustomText>
            <View style={styles.filterChipsRow}>
              {opcionesTipo.map((op) => {
                const opNorm = typeof op === "string" ? { label: op, value: op } : op;
                return (
                  <FilterChip
                    key={opNorm.value}
                    label={opNorm.label}
                    active={(filtros.categories || []).includes(opNorm.value)}
                    onPress={() => setFiltros((prev) => {
                      const arr = prev.categories || [];
                      const exists = arr.includes(opNorm.value);
                      return { ...prev, categories: exists ? arr.filter((v) => v !== opNorm.value) : [...arr, opNorm.value] };
                    })}
                  />
                );
              })}
            </View>

            <CustomText style={styles.filterGroupLabel}>Estado del equipo</CustomText>
            <View style={styles.filterChipsRow}>
              {opcionesEstado.map((op) => {
                const opNorm = typeof op === "string" ? { label: op, value: op } : op;
                return (
                  <FilterChip
                    key={opNorm.value}
                    label={opNorm.label}
                    active={(filtros.suppliers || []).includes(opNorm.value)}
                    onPress={() => setFiltros((prev) => {
                      const arr = prev.suppliers || [];
                      const exists = arr.includes(opNorm.value);
                      return { ...prev, suppliers: exists ? arr.filter((v) => v !== opNorm.value) : [...arr, opNorm.value] };
                    })}
                  />
                );
              })}
            </View>

            <FilterActions
              onClear={() => setFiltros({ categories: [], suppliers: [], units: [], lowStock: false, expiryDate: "" })}
              onApply={() => setFiltroVisible(false)}
            />
          </FilterPanel>
        )}

        {alert && (
          <View style={styles.alertWrapper}>
            <Alert variant={alert.type} message={alert.message} />
          </View>
        )}

        {/* Lista o EmptyState */}
        {equiposFinales.length === 0 ? (
          <EmptyState
            title={hayFiltrosActivos ? "Sin resultados" : "No hay equipos registrados"}
            description={
              hayFiltrosActivos
                ? "No se encontraron equipos con los criterios de búsqueda seleccionados."
                : "Comienza agregando tu primer equipo."
            }
          />
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.list}>
            {equiposFinales.map((equipo) => (
              <EquipoCard
                key={equipo.id}
                equipo={equipo}
                onPress={openDetail}
                onToggle={handleToggle}
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.floatingButtonContainer}>
          <Button variant="outline" onPress={handleAdd} style={styles.floatingButton}>
            <Icon icon={ICONS.add} size={16} color={COLORS.primary} />
            <CustomText style={styles.floatingButtonText}>Agregar equipo</CustomText>
          </Button>
        </View>

        {/* Modal para crear/editar */}
        <Modal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setValidationError("");
          }}
          showCloseButton={false}
          containerStyle={styles.modalContainer}
        >
          <View style={styles.modalContentContainer}>
            <Title level={4} style={styles.modalTitleHeader}>
              {editingEquipo ? "Editar equipo" : "Nuevo equipo"}
            </Title>

            <ScrollView
              style={styles.modalScrollForm}
              contentContainerStyle={styles.modalScrollFormContent}
            >
              <EquipoForm
                ref={formRef}
                initialData={editingEquipo || {}}
                onSubmit={handleSubmit}
                isEditing={!!editingEquipo}
                hideSubmitButton={true}
                tiposEquipo={equiposService.getTiposEquipo()}
                estanquesDisponibles={estanquesDisponibles}
                onValidationError={(msg) => setValidationError(msg)}
              />
            </ScrollView>

            <View style={styles.modalFooterButtons}>
              <Button
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={styles.modalFooterButton}
              >
                <Icon icon={ICONS.exit} size={18} color={COLORS.primary} />
                <CustomText style={styles.modalFooterButtonText}>Cancelar</CustomText>
              </Button>

              <Button
                variant="outline"
                onPress={() => formRef.current?.submit()}
                style={styles.modalFooterButton}
              >
                <Icon icon={ICONS.save} size={18} color={COLORS.primary} />
                <CustomText style={styles.modalFooterButtonText}>
                  {editingEquipo ? "Actualizar" : "Registrar"}
                </CustomText>
              </Button>
            </View>
          </View>
        </Modal>

        {/* Modal de confirmación con validación de código */}
        <Modal
          visible={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setCodigoConfirmacion("");
            setDeleteTarget(null);
            setCodigoError("");
          }}
          showCloseButton={false}
          containerStyle={styles.modalConfirmContainer}
        >
          <CustomText style={styles.modalTitle}>Confirmar eliminación</CustomText>
          {deleteTarget && (
            <>
              <CustomText style={styles.modalText}>
                ¿Está seguro que desea eliminar el equipo:
              </CustomText>
              <CustomText style={styles.modalName}>{deleteTarget.nombre}</CustomText>
              <CustomText style={styles.modalSubText}>
                Para confirmar, ingrese el código del equipo:
              </CustomText>
              <CustomText style={styles.modalCodigo}>{deleteTarget.codigo}</CustomText>
            </>
          )}
          <Input
            placeholder="Ingrese el código para confirmar"
            value={codigoConfirmacion}
            onChangeText={setCodigoConfirmacion}
            autoCapitalize="characters"
            containerStyle={styles.modalInput}
          />
          {codigoError !== "" && (
            <Alert
              variant="danger"
              message={codigoError}
              style={styles.modalErrorAlert}
            />
          )}
          <View style={styles.modalButtons}>
            <Button
              onPress={() => {
                setShowConfirmModal(false);
                setCodigoConfirmacion("");
                setDeleteTarget(null);
                setCodigoError("");
              }}
              variant="outline"
              style={styles.modalCancelBtn}
            >
              <Icon icon={ICONS.exit} size={16} color={COLORS.primary} />
              <CustomText style={styles.modalCancelBtnText}>Cancelar</CustomText>
            </Button>
            <Button
              onPress={confirmDelete}
              variant="outline"
              style={styles.modalDeleteBtn}
            >
              <Icon icon={ICONS.delete} size={16} color={COLORS.error} />
              <CustomText style={styles.modalDeleteBtnText}>Eliminar</CustomText>
            </Button>
          </View>
        </Modal>

        {/* Modal para ver detalles */}
        <Modal
          visible={!!selectedEquipoId}
          onClose={() => setSelectedEquipoId(null)}
          showCloseButton={false}
          containerStyle={styles.modalDetalleContainer}
          overlayStyle={styles.modalDetalleOverlay}
        >
          <EquipoDetalleScreen
            equipoId={selectedEquipoId}
            onClose={() => setSelectedEquipoId(null)}
            onEdit={(equipo) => {
              setSelectedEquipoId(null);
              setEditingEquipo(equipo);
              setModalVisible(true);
            }}
            onDelete={(id) => {
              setSelectedEquipoId(null);
              handleDeletePress(id);
            }}
            onToggle={handleToggle}
          />
        </Modal>
      </View>
    </View>
  );
}