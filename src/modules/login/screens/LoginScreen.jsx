/**
 * ============================================================
 * PANTALLA: LOGIN
 * ============================================================
 *
 * Selecciona un colaborador y valida su PIN para continuar.
 * @dependencies - Alert, Avatar, Button, Card, Icon, Modal, Text, Title, Input, SearchBar, useLoginFlow
 * @validations - El PIN debe contener 4 dígitos obligatoriamente.
 * @navigation - Navega a la pantalla principal si el login es exitoso.
 */

import { useState } from 'react';
import { View, ScrollView } from 'react-native';

import Alert from '../../../shared/components/Alert';
import Avatar from '../../../shared/components/Avatar';
import Button from '../../../shared/components/Button';
import Card from '../../../shared/components/Card';
import Icon from '../../../shared/components/Icons';
import Modal from '../../../shared/components/Modal';
import Text from '../../../shared/components/Text';
import Title from '../../../shared/components/Title';
import Input from '../../../shared/components/Input';

import { COLORS } from '../../../theme/colors';
import { ICONS } from '../../../theme/icons';
import { LOGIN_MESSAGES } from '../constants/authMessages';
import { useLoginFlow } from '../hooks/useLoginFlow';
import SearchBar from '../../../shared/components/SearchBar';
import styles from '../styles/loginStyles';
import { STYLE } from '../../../theme/style';

/**
 * LoginScreen
 *
 * Composición principal de la pantalla.
 */
export default function LoginScreen({ onLoginSuccess = () => {} }) {
  const loginFlow = useLoginFlow({ onLoginSuccess });

  return (
    <View style={STYLE.container}>
      <ScrollView contentContainerStyle={STYLE.contentWrapper} showsVerticalScrollIndicator={false}>
        <LoginHeader formattedDate={loginFlow.formattedDate} />
        <WorkerSection
          workers={loginFlow.filteredWorkers}
          loading={loginFlow.loading}
          error={loginFlow.error}
          selectedWorker={loginFlow.selectedWorker}
          onSelectWorker={loginFlow.setSelectedWorker}
          onSyncData={loginFlow.handleSyncData}
          isSyncDisabled={loginFlow.hasSyncedData}
          searchText={loginFlow.workerSearchText}
          onSearchTextChange={loginFlow.setWorkerSearchText}
          isFormValid={loginFlow.isFormValid}
          onContinue={loginFlow.openPinModal}
        />
      </ScrollView>

      <PinModal
        visible={loginFlow.isPinModalVisible}
        pinCode={loginFlow.pinCode}
        pinError={loginFlow.pinError}
        isAuthenticating={loginFlow.isAuthenticating}
        onClose={loginFlow.closePinModal}
        onPinChange={loginFlow.handlePinChange}
        onSubmit={loginFlow.submitPin}
      />
    </View>
  );
}

/**
 * LoginHeader
 *
 * Tarjeta superior con identidad de la app y fecha.
 */
function LoginHeader({ formattedDate }) {
  return (
    <Card style={styles.heroCard}>
      <View style={styles.logoContainer}>
        <Icon icon={ICONS.shrimp} size={32} color={COLORS.primary} />
      </View>
      <Title level={1} color={COLORS.textPrimary} align="center" style={styles.companyName}>
        {LOGIN_MESSAGES.COMPANY_NAME}
      </Title>
      <Text size={13} color={COLORS.textTertiary} align="center" style={styles.dateText}>
        {formattedDate}
      </Text>
    </Card>
  );
}

/**
 * WorkerSection
 *
 * Lista a los colaboradores disponibles.
 */
function WorkerSection({
  workers,
  loading,
  error,
  selectedWorker,
  onSelectWorker,
  onSyncData,
  isSyncDisabled,
  searchText,
  onSearchTextChange,
  isFormValid,
  onContinue,
}) {
  // Estado demostrativo de sincronización — reemplazar con lógica real
  const [syncStatus, setSyncStatus] = useState(null); // null | 'success' | 'danger'

  const handleSync = () => {
    // TODO: reemplazar con la lógica real de sincronización
    // Por ahora alterna entre éxito y error para demostración
    const result = Math.random() > 0.5 ? 'success' : 'danger';
    setSyncStatus(result);
    setTimeout(() => setSyncStatus(null), result === 'success' ? 3000 : 6000);
    if (onSyncData) onSyncData();
  };

  return (
    <Card style={styles.sectionCard}>
      {syncStatus === 'success' && (
        <Alert
          variant="success"
          message="Sincronización completada correctamente."
          style={styles.syncAlert}
        />
      )}
      {syncStatus === 'danger' && (
        <Alert
          variant="danger"
          message="Error de sincronización. Verifica tu conexión."
          style={styles.syncAlert}
        />
      )}
      <Title level={4} color={COLORS.textPrimary} align="center">
        {LOGIN_MESSAGES.WORKER_TITLE}
      </Title>
      <Button onPress={handleSync} variant="outline" disabled={isSyncDisabled} style={styles.syncButton}>
        <View style={styles.buttonContent}>
          <Icon icon={ICONS.refresh || ICONS.update} size={18} color={COLORS.primary} />
          <Text style={styles.buttonText}>{LOGIN_MESSAGES.SYNC_BUTTON_TEXT}</Text>
        </View>
      </Button>
      <SearchBar
        value={searchText}
        onChangeText={onSearchTextChange}
        placeholder={LOGIN_MESSAGES.SEARCH_PLACEHOLDER}
        containerStyle={styles.searchContainer}
      />
      {loading && <SectionStatus message={LOGIN_MESSAGES.LOADING} />}
      {error && (
        <Alert
          variant="danger"
          message="No se encontraron colaboradores."
          style={styles.syncAlert}
          textStyle={styles.errorText}
        />
      )}
      {!loading && !error && (
        <View style={styles.workersList}>
          {workers.length === 0 ? (
            <View style={[styles.workersScroll, syncStatus && styles.workersScrollCompressed, styles.centerContent]}>
              <SectionStatus message={LOGIN_MESSAGES.NO_WORKERS_FOUND} />
            </View>
          ) : (
            <ScrollView
              style={[styles.workersScroll, syncStatus && styles.workersScrollCompressed]}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {workers.map((worker) => (
                <WorkerItem
                  key={worker.id}
                  worker={worker}
                  isSelected={selectedWorker === worker.id}
                  onPress={() => onSelectWorker(worker.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
      <View style={styles.actionSection}>
        <Button onPress={onContinue} variant="outline" disabled={!isFormValid} style={styles.continueButton}>
          <View style={styles.buttonContent}>
            <Icon icon={ICONS.enter} size={18} color={isFormValid ? COLORS.primary : COLORS.textTertiary} />
            <Text style={[styles.buttonText, !isFormValid && { color: COLORS.textTertiary }]}>{LOGIN_MESSAGES.BUTTON_TEXT}</Text>
          </View>
        </Button>
      </View>
    </Card>
  );
}

/**
 * WorkerItem
 *
 * Botón tocable para seleccionar un colaborador.
 */
function WorkerItem({ worker, isSelected, onPress }) {
  return (
    <Button onPress={onPress} variant="outline" style={styles.workerButton}>
      <Card style={[styles.workerCard, isSelected && styles.workerCardSelected]}>
        <Avatar
          name={worker.name}
          size={48}
          backgroundColor={isSelected ? COLORS.primary : COLORS.secondary}
          textColor={isSelected ? COLORS.white : COLORS.textPrimary}
        />
        <View style={styles.workerInfo}>
          <Text size={15} weight="700" color={COLORS.textPrimary}>
            {worker.name}
          </Text>
          <Text size={13} color={COLORS.textTertiary}>
            {worker.role}
          </Text>
        </View>
        {isSelected && (
          <View style={styles.selectionBadge}>
            <Text size={14} weight="700" color={COLORS.white}>
              ✓
            </Text>
          </View>
        )}
      </Card>
    </Button>
  );
}

/**
 * SectionStatus
 *
 * Mensaje centrado para carga o error.
 */
function SectionStatus({ message, error = false }) {
  return (
    <Text size={14} color={error ? COLORS.error : COLORS.textTertiary} align="center" style={styles.statusText}>
      {message}
    </Text>
  );
}

/**
 * PinModal
 *
 * Modal para ingresar el PIN de 4 dígitos.
 */
function PinModal({ visible, pinCode, pinError, isAuthenticating, onClose, onPinChange, onSubmit }) {
    return (
        <Modal
            visible={visible}
            onClose={onClose}
            showCloseButton
            closeText="Cancelar"
            containerStyle={styles.modalContainer}
            overlayStyle={styles.modalOverlay}
            buttonStyle={styles.cancelButtonOutline}
            buttonTextStyle={styles.cancelButtonTextOutline}
        >
            <Title level={5} color={COLORS.textPrimary} align="center" style={styles.modalTitle}>
                Digite su PIN
            </Title>
            <Input
                value={pinCode}
                onChangeText={onPinChange}
                placeholder="0000"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                autoFocus={visible}
                editable={!isAuthenticating}
                containerStyle={styles.pinInputContainer}
                style={styles.pinInput}
            />
            {pinError !== '' && (
                <Alert variant="danger" message={pinError} style={styles.pinErrorAlert} />
            )}
            <Button onPress={onSubmit} variant="outline" disabled={pinCode.length !== 4 || isAuthenticating}>
                Ingresar
            </Button>
        </Modal>
    );
}
