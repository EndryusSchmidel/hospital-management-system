import axios from "axios";
import { toast } from 'react-toastify';


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
        const status = error.response ? error.response.status : null;
        const url = error.config.url || "";
        const isLoginRequest = url.includes('/auth/login');

        if ((status === 401 || status === 403) && !isLoginRequest) {
            // 1. Limpa o token imediatamente
            localStorage.removeItem('token');

            // 2. Mostra o aviso moderno
            toast.error("Sua sessão expirou. Redirecionando para o login...", {
                toastId: "session-expired", // Evita duplicar vários toasts se houver várias chamadas
            });

            // 3. Aguarda 2 segundos para o usuário ver o toast e então redireciona
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);

            // Importante: Retorna uma promise pendente para "travar" os catches dos componentes
            return new Promise(() => {});
        }
        
        return Promise.reject(error);
    }
);

export default api;
