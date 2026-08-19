import axios from "axios";

const api = axios.create({

    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers:{
        "Content-Type": "application/json"
    }
})

// ── Interceptor: adjunta el JWT en cada petición autenticada ──
api.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem('caprocam_auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            // Ignorar
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Interceptor:  Maneja respuestas y renovación del token ──
api.interceptors.response.use(
    (response) => {
        try {
            const renewedToken = response.headers['x-renewed-token'] ||
                response.headers['X-Renewed-Token'];
            if (renewedToken) {
                localStorage.setItem('caprocam_auth_token', renewedToken);
            }
        } catch (e) {
            // Ignorar
        }
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || 
                error.response.status === 403)) {
            try {
                localStorage.removeItem('caprocam_auth_token');
                localStorage.removeItem('caprocam_usuario');
            } catch (e) {
                // Ignorar
            }
        }
        return Promise.reject(error);
    }
);

export default api;