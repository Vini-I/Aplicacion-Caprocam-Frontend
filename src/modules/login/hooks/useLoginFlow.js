import { useState } from 'react';

import { useWorkers } from './useWorkers';
import { formatDateInSpanish } from '../utils/dateFormatter';
import { getLoginValidationMessage, isLoginFormValid } from '../utils/loginValidator';
import { verifyPinCredentials } from '../services/loginAuth.service';

/**
 * useLoginFlow
 *
 * Agrupa estado y acciones del login para mantener la pantalla delgada.
 */
export function useLoginFlow({ onLoginSuccess }) {
  const { workers, loading, error } = useWorkers();
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const formattedDate = formatDateInSpanish();
  const isFormValid = isLoginFormValid(!!selectedWorker);
  const validationMessage = getLoginValidationMessage(!!selectedWorker);

  const openPinModal = () => {
    if (!isFormValid) return;
    setPinCode('');
    setPinError('');
    setIsPinModalVisible(true);
  };

  const closePinModal = () => {
    if (!isAuthenticating) {
      setIsPinModalVisible(false);
      setPinError('');
    }
  };

  const handlePinChange = (value) => {
    setPinCode(value.replace(/\D/g, '').slice(0, 4));
    if (pinError !== '') setPinError('');
  };

  const submitPin = async () => {
    if (pinCode.length !== 4 || selectedWorker == null) {
      setPinError('El PIN debe tener 4 dígitos.');
      return;
    }

    setIsAuthenticating(true);
    try {
      const result = await verifyPinCredentials({ workerId: selectedWorker, pinCode });
      if (!result.isValid) {
        setPinError(result.message);
        return;
      }

      setIsPinModalVisible(false);
      onLoginSuccess({ workerId: selectedWorker, pinCode });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    workers,
    loading,
    error,
    selectedWorker,
    setSelectedWorker,
    formattedDate,
    isFormValid,
    validationMessage,
    isPinModalVisible,
    pinCode,
    pinError,
    isAuthenticating,
    openPinModal,
    closePinModal,
    handlePinChange,
    submitPin,
  };
}
