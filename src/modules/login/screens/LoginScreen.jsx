/**
 * ============================================================
 * PANTALLA: LOGIN
 * ============================================================
 *
 * Selecciona un trabajador y valida su PIN para continuar.
 */

import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          workers={loginFlow.workers}
          loading={loginFlow.loading}
          error={loginFlow.error}
          selectedWorker={loginFlow.selectedWorker}
          onSelectWorker={loginFlow.setSelectedWorker}
        />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.safeActionArea}>
        <ActionSection
          isFormValid={loginFlow.isFormValid}
          validationMessage={loginFlow.validationMessage}
          onContinue={loginFlow.openPinModal}
        />
      </SafeAreaView>

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
function WorkerSection({ workers, loading, error, selectedWorker, onSelectWorker }) {
  return (
    <Card style={styles.sectionCard}>
      <Title level={4} color={COLORS.textPrimary} align="center">
        {LOGIN_MESSAGES.WORKER_TITLE}
      </Title>
      <Text size={13} color={COLORS.textTertiary} align="center" style={styles.sectionSubtitle}>
        {LOGIN_MESSAGES.WORKER_SUBTITLE}
      </Text>
      {loading && <SectionStatus message={LOGIN_MESSAGES.LOADING} />}
      {error && <SectionStatus message={`${LOGIN_MESSAGES.ERROR_PREFIX}${error}`} error />}
      {!loading && !error && (
        <View style={styles.workersList}>
          {workers.map((worker) => (
            <WorkerItem
              key={worker.id}
              worker={worker}
              isSelected={selectedWorker === worker.id}
              onPress={() => onSelectWorker(worker.id)}
            />
          ))}
        </View>
      )}
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
 * ActionSection
 *
 * Footer fijo con el botón de continuar.
 */
function ActionSection({ isFormValid, validationMessage, onContinue }) {
  return (
    <View style={styles.footerContent}>
      <Button onPress={onContinue} variant={isFormValid ? 'primary' : 'secondary'} disabled={!isFormValid}>
        {LOGIN_MESSAGES.BUTTON_TEXT}
      </Button>
      <View style={styles.validationContainer}>
        <Text size={12} color={COLORS.textTertiary} align="center">
          {validationMessage}
        </Text>
      </View>
    </View>
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
      <Button onPress={onSubmit} disabled={pinCode.length !== 4 || isAuthenticating}>
        Ingresar
      </Button>
    </Modal>
  );
}
