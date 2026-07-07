/**
 * ============================================================
 * SERVICE DENSIDADPOBLACIONAL.SERVICE
 * ============================================================
 *
 * Persiste los registros de densidad poblacional (conteo) en
 * AsyncStorage bajo la clave "densidad_poblacional_v1". Sigue
 * exactamente el mismo patrón que alimentacion.service.js.
 *
 * Funcionalidad:
 * - getAll(): retorna todos los registros guardados.
 * - create(registro): agrega un registro nuevo con id y timestamp.
 * - deleteById(id): elimina un registro por id.
 * - clearAll(): elimina todos los registros guardados.
 *
 * Importante:
 * - Este archivo NO valida los datos que recibe: la validación
 *   de campos obligatorios ocurre antes, en useDensidadPoblacional
 *   y useDatosConteo.
 *
 * Ejemplo:
 * await densidadPoblacionalService.create(registro);
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const CLAVE = "densidad_poblacional_v1";

const densidadPoblacionalService = {
    getAll: async () => {
        try {
            const datos = await AsyncStorage.getItem(CLAVE);
            return datos ? JSON.parse(datos) : [];
        } catch {
            return [];
        }
    },

    create: async (registro) => {
        const lista = await densidadPoblacionalService.getAll();
        const nuevo = {
            ...registro,
            id:        Date.now().toString(),
            timestamp: new Date().toISOString(),
        };
        await AsyncStorage.setItem(CLAVE, JSON.stringify([...lista, nuevo]));
        return nuevo;
    },

    deleteById: async (id) => {
        const lista = await densidadPoblacionalService.getAll();
        await AsyncStorage.setItem(CLAVE, JSON.stringify(lista.filter(r => r.id !== id)));
    },

    clearAll: async () => {
        await AsyncStorage.removeItem(CLAVE);
    },
};

export default densidadPoblacionalService;
