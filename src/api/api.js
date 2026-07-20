import axios from "axios";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "authToken";

// Token de prueba QA (colaboradorId: 1), mientras el login por PIN no
// emite token real. Se usa solo como respaldo si SecureStore no tiene
// nada guardado. Cuando exista login real, borrar esta constante y el
// fallback de abajo.
const TOKEN_QA_PRUEBA = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZ3J1cG9EYXRvcyI6MSwicm9sSWQiOjEsIm5vbWJyZSI6IlVzdWFyaW8iLCJjb2xhYm9yYWRvcklkIjoyLCJpYXQiOjE3ODQ1MzQzOTksImV4cCI6MTc4NTEzOTE5OX0.mIO26WXPxIppRgZdV-De9QznkBuwhqsVf6jR9IgCwm4";



const api = axios.create({

    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers:{
        "Content-Type": "application/json"
    }
})

// Adjunta el token guardado (login por PIN o login web) a cada request.
// Mientras no exista token real guardado, usa el token de prueba QA
// como respaldo para no bloquear las pruebas.
api.interceptors.request.use(async (config) => {
    let tokenGuardado = null;
    try {
        tokenGuardado = await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
        // SecureStore no está disponible en web; seguimos con el fallback.
    }
    const token = tokenGuardado || TOKEN_QA_PRUEBA;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helpers para que la pantalla de login (PIN o web) guarde/borre el token
// sin tener que tocar este archivo de nuevo.
export async function guardarToken(token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function borrarToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function obtenerTokenActual() {
  let token = null;
  try {
    token = await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    // no disponible en web
  }
  return token || TOKEN_QA_PRUEBA;
}

export async function obtenerColaboradorIdDesdeToken() {
  const token = await obtenerTokenActual();
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.colaboradorId ?? payload.id ?? 1;
  } catch (error) {
    return 1;
  }
}

export default api;