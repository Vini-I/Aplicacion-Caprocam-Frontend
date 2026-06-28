/**
 * PANTALLA: Web Register
 *
 * Registro web para administradores. Los colaboradores se
 * gestionan desde su módulo propio una vez iniciada la sesión.
 *
 * FLUJO DE ÉXITO: al registrarse correctamente aparece un
 * Modal de confirmación; al cerrarlo, navega a loginWeb.
 */

import { View, ScrollView } from 'react-native';

import Card     from '../../../shared/components/Card';
import CustomText from '../../../shared/components/Text';
import Spinner  from '../../../shared/components/Spinner';
import Button   from '../../../shared/components/Button';
import Modal    from '../../../shared/components/Modal';
import Header   from '../../../shared/components/Header';
import Separator from '../../../shared/components/Separator';
import FormField from '../../../shared/components/FormField';

import { useRegister } from '../hooks/useRegister';
import { AUTH_MESSAGES as MSG } from '../constants/authMessages';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/webRegisterStyles';

export default function WebRegisterScreen({
  onRegisterSuccess = () => {},
  onBackToLogin     = () => {},
}) {
  const {
    nombre, setNombre, apellidos, setApellidos,
    email, setEmail, username, setUsername, password, setPassword,
    errors, loading,
    handleRegister, showSuccessModal, handleModalClose,
  } = useRegister({ onRegisterSuccess });

  const fields = [
    { key: 'nombre',    label: MSG.LABEL_NOMBRE,    value: nombre,    onChangeText: setNombre,    placeholder: MSG.PLACEHOLDER_NOMBRE,    error: errors.nombre },
    { key: 'apellidos', label: MSG.LABEL_APELLIDOS,  value: apellidos, onChangeText: setApellidos, placeholder: MSG.PLACEHOLDER_APELLIDOS,  error: errors.apellidos },
    { key: 'email',     label: MSG.LABEL_EMAIL,      value: email,     onChangeText: setEmail,     placeholder: MSG.PLACEHOLDER_EMAIL,     error: errors.email,    autoCapitalize: 'none', autoCorrect: false, keyboardType: 'email-address' },
    { key: 'username',  label: MSG.LABEL_USERNAME,   value: username,  onChangeText: setUsername,  placeholder: MSG.PLACEHOLDER_USERNAME,  error: errors.username, autoCapitalize: 'none', autoCorrect: false },
    { key: 'password',  label: MSG.LABEL_PASSWORD,   value: password,  onChangeText: setPassword,  placeholder: MSG.PLACEHOLDER_PASSWORD,  error: errors.password, secureTextEntry: true },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <Modal
        visible={showSuccessModal}
        onClose={handleModalClose}
        closeText={MSG.MODAL_SUCCESS_BUTTON}
        showCloseButton
      >
        <CustomText weight="700" size={18} align="center" style={styles.modalTitle}>
          {MSG.MODAL_SUCCESS_TITLE}
        </CustomText>
        <CustomText size={14} color={COLORS.textTertiary} align="center" style={styles.modalBody}>
          {MSG.MODAL_SUCCESS_BODY}
        </CustomText>
      </Modal>

      <Header
        title={MSG.REGISTER_TITLE}
        subtitle={MSG.REGISTER_SUBTITLE}
        logo={require('../../../assets/shrimp-solid.png')}
      />

      <View style={styles.formSection}>
        <Card>

          {fields.map(({ key, error, ...fieldProps }) => (
            <FormField key={key} editable={!loading} error={error} {...fieldProps} />
          ))}

          {loading && <Spinner text={MSG.LOADING_REGISTER} />}

          <Button disabled={loading} onPress={handleRegister}>
            {MSG.BUTTON_SUBMIT_REGISTER}
          </Button>

          <Separator text={MSG.SEPARATOR_TEXT_REGISTER} />

          <Button variant="outline" disabled={loading} onPress={onBackToLogin}>
            {MSG.BUTTON_BACK_TO_LOGIN}
          </Button>

        </Card>
      </View>

    </ScrollView>
  );
}