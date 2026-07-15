
/**
 * ============================================================
 * SERVICIO: loginAuth
 * ============================================================
 *
 * Encapsula la validación local del PIN usado por LoginScreen.
 * Cuando exista backend, este archivo será el punto de cambio
 * para reemplazar la lógica mock por una petición real.
 */

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
