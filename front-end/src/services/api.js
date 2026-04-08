import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080"
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
        const isMeRequest = url.includes('/auth/me');
        
        // 🚀 A REGRA DE OURO: Se for erro no login, passa direto pro Login.jsx tratar!
        if (isLoginRequest) {
            return Promise.reject(error);
        }
        
        // Pega a mensagem exata do Spring Boot (para as outras rotas)
        const serverMessage = error.response?.data?.message || "";
        const isPermissionError = serverMessage.toLowerCase().includes("permissão") || 
                                serverMessage.toLowerCase().includes("autorizado");

        // ==========================================
        // ERRO 401 OU 403 (Focado em Permissão)
        // ==========================================
        if ((status === 401 || status === 403) && isPermissionError) {
            Swal.fire({
                title: 'Ação negada! (Conta TESTE)',
                text: serverMessage,
                icon: 'error',
                confirmButtonColor: '#0ea5e9',    
                showConfirmButton: true
            });
            return new Promise(() => {}); // Trava a execução, não desloga
        }

        // ==========================================
        // ERRO 401: Token Expirado (Sessão real que caiu)
        // ==========================================
        if (status === 401) {
            localStorage.removeItem('token');
            Swal.fire({
                title: 'Sessão Expirada',
                text: 'Sua sessão expirou. Por favor, faça login novamente.',
                icon: 'warning',
                confirmButtonColor: '#0ea5e9'
            }).then(() => {
                window.location.href = '/';
            });
            return new Promise(() => {}); 
        }

        // ==========================================
        // ERRO 403 GENÉRICO (Se o backend não mandar msg)
        // ==========================================
        if (status === 403 && !isMeRequest) {
            Swal.fire({
                title: 'Ação negada! (Conta TESTE)',
                text: serverMessage,
                icon: 'error',
                confirmButtonColor: '#0ea5e9',    
                showConfirmButton: true
            });
            return new Promise(() => {}); 
        }

        return Promise.reject(error);
    }
);

export default api;