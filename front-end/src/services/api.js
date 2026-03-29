import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            const url = error.config.url || "";

            // Se for login ou a rota de perfil inicial, NÃO fazemos o fluxo de "Sessão Expirada"
            const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/me');

            if (!isAuthRequest) {
                console.warn("Sessão expirada em rota protegida.");
                localStorage.removeItem('token');
                alert("Sessão expirada. Por favor, faça login novamente.");
                window.location.href = '/';
                return Promise.reject(error);
            }
        }
        
        // Se for erro de login, o erro "passa reto" por aqui e vai para o catch do Login.jsx
        return Promise.reject(error);
    }
);
export default api;
