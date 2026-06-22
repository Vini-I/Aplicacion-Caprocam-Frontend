
/**
 * verifyPinCredentials
 *
 * Valida el PIN localmente por ahora.
 * Cuando exista backend, aquí se reemplaza por fetch/axios.
 */
export async function verifyPinCredentials({ workerId, pinCode }) {
  if (workerId == null || pinCode.length !== 4) {
    return { isValid: false, message: 'Datos inválidos para autenticar.' };
  }

  return { isValid: true, message: '' };
}
