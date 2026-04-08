import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

export const useAuthMonitor = () => {
    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const { exp } = jwtDecode(token);
                const agora = Date.now() / 1000; // Tempo atual em segundos

                // Se o tempo atual passou da expiração
                if (agora >= exp) {
                    localStorage.removeItem('token');
                    
                    Swal.fire({
                        title: 'Sessão Expirada',
                        text: 'Sua sessão acabou de expirar. Por favor, faça login novamente.',
                        icon: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ir para Login',
                        allowOutsideClick: false
                    }).then(() => {
                        window.location.href = '/';
                    });
                }
            } catch (error) {
                console.error("Erro ao decodificar token", error);
            }
        };

        // Verifica a cada 5 segundos se o token ainda é válido
        const interval = setInterval(checkToken, 5000);
        
        return () => clearInterval(interval); // Limpa o timer ao fechar a aba
    }, []);
};