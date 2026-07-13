/**
 * ============================================================
 * PANTALLA: LOGIN
 * ============================================================
 *
 * Selecciona un trabajador y valida su PIN para continuar.
 */

import { View, ScrollView } from 'react-native';

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
import { LOGIN_MESSAGES } from '../constants/messages';
import { useLoginFlow } from '../hooks/useLoginFlow';
import WorkerSearchBar from '../components/WorkerSearchBar';
import styles from '../styles/loginStyles';

/**
 * LoginScreen
 *
 * Composición principal de la pantalla.
 */
export default function LoginScreen({ onLoginSuccess = () => {} }) {
  const loginFlow = useLoginFlow({ onLoginSuccess });

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
 * Lista a los trabajadores disponibles.
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
  return (
    <Card style={styles.sectionCard}>
      <Title level={4} color={COLORS.textPrimary} align="center">
        {LOGIN_MESSAGES.WORKER_TITLE}
      </Title>
      <Button onPress={onSyncData} variant="outline" disabled={isSyncDisabled} style={styles.syncButton}>
        {LOGIN_MESSAGES.SYNC_BUTTON_TEXT}
      </Button>
      <WorkerSearchBar
        value={searchText}
        onChangeText={onSearchTextChange}
        placeholder={LOGIN_MESSAGES.SEARCH_PLACEHOLDER}
      />
      {loading && <SectionStatus message={LOGIN_MESSAGES.LOADING} />}
      {error && <SectionStatus message={`${LOGIN_MESSAGES.ERROR_PREFIX}${error}`} error />}
      {!loading && !error && (
        <View style={styles.workersList}>
          {workers.length === 0 ? (
            <SectionStatus message={LOGIN_MESSAGES.NO_WORKERS_FOUND} />
          ) : (
            workers.map((worker) => (
              <WorkerItem
                key={worker.id}
                worker={worker}
                isSelected={selectedWorker === worker.id}
                onPress={() => onSelectWorker(worker.id)}
              />
            ))
          )}
        </View>
      )}
      <View style={styles.actionSection}>
        <Button onPress={onContinue} variant="outline" disabled={!isFormValid} style={styles.continueButton}>
          {LOGIN_MESSAGES.BUTTON_TEXT}
        </Button>
      </View>
    </Card>
  );
}

/**
 * WorkerItem
 *
 * Botón tocable para seleccionar un trabajador.
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
                <Text size={12} color={COLORS.error} align="center" style={styles.pinErrorText}>
                    {pinError}
                </Text>
            )}
            <Button onPress={onSubmit} variant="outline" disabled={pinCode.length !== 4 || isAuthenticating}>
                Ingresar
            </Button>
        </Modal>
    );
}
