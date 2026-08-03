/**
 * HOOK: useLoginFlow
 * Orquesta el flujo de inicio de sesión de colaboradores: carga trabajadores,
 * filtra por nombre, controla la ventana modal de PIN y valida credenciales.
 *
 * @dependencies - useWorkers, formatDateInSpanish, getLoginValidationMessage, isLoginFormValid, verifyPinCredentials
 * @validations  - Filtra lista por nombre y requiere PIN exacto de 4 dígitos.
 * @navigation   - N/A (ejecuta el callback onLoginSuccess al autenticar PIN).
 */

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
  const [workerSearchText, setWorkerSearchText] = useState('');
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasSyncedData, setHasSyncedData] = useState(false);

  const formattedDate = formatDateInSpanish();
  const isFormValid = isLoginFormValid(!!selectedWorker);
  const validationMessage = getLoginValidationMessage(!!selectedWorker);
  const normalizedSearchText = workerSearchText.trim().toLowerCase();
  const filteredWorkers = normalizedSearchText === ''
    ? workers
    : workers.filter((worker) => String(worker.name ?? '').toLowerCase().includes(normalizedSearchText));

  const openPinModal = () => {
    if (!isFormValid) return;
    setPinCode('');
    setPinError('');
    setIsPinModalVisible(true);
  };

  const handleSyncData = () => {
    if (hasSyncedData) return;
    setHasSyncedData(true);
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
    filteredWorkers,
    loading,
    error,
    selectedWorker,
    setSelectedWorker,
    workerSearchText,
    setWorkerSearchText,
    formattedDate,
    isFormValid,
    validationMessage,
    isPinModalVisible,
    pinCode,
    pinError,
    isAuthenticating,
    hasSyncedData,
    openPinModal,
    handleSyncData,
    closePinModal,
    handlePinChange,
    submitPin,
  };
}
