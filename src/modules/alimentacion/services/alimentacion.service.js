import AsyncStorage from "@react-native-async-storage/async-storage";

const CLAVE = "alimentaciones_v1";

const alimentacionService = {
    getAll: async () => {
        try {
            const datos = await AsyncStorage.getItem(CLAVE);
            return datos ? JSON.parse(datos) : [];
        } catch {
            return [];
        }
    },

    create: async (registro) => {
        const lista = await alimentacionService.getAll();
        const nuevo = {
            ...registro,
            id:        Date.now().toString(),
            timestamp: new Date().toISOString(),
        };
        await AsyncStorage.setItem(CLAVE, JSON.stringify([...lista, nuevo]));
        return nuevo;
    },

    deleteById: async (id) => {
        const lista = await alimentacionService.getAll();
        await AsyncStorage.setItem(CLAVE, JSON.stringify(lista.filter(r => r.id !== id)));
    },
};

export default alimentacionService;