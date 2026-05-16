import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, Send, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from 'react-toastify';
import api from "../../services/api";
import "./Login.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!email) {
            toast.warn("Por favor, informe seu e-mail.");
            return;
        }

        setIsLoading(true);

        try {
            // 🚀 Rota que criaremos no Java futuramente
            // await api.post("/auth/forgot-password", { email });
            
            // Simulando o tempo de resposta do servidor por enquanto
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSuccess(true);
            toast.success("Instruções enviadas para o seu e-mail!");
        } catch (err) {
            setError("Não encontramos uma conta com este e-mail.");
            toast.error("Erro ao solicitar recuperação.");
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-screen-wrapper">
            <div className="login-overlay"></div> 

            <div className="login-glass-card">
                <div className="login-header">
                    <h1>Recuperar Senha</h1>
                    <p>Enviaremos as instruções para o seu e-mail</p>
                </div>
                
                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="login-form">
                        
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input 
                                type="email" 
                                placeholder="Seu e-mail cadastrado" 
                                className={`modern-input ${error ? 'input-error' : ''}`} 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="error-message-container">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                            {!isLoading && <Send size={18} />}
                        </button>
                    </form>
                ) : (
                    <div className="success-message-container" style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        textAlign: 'center', 
                        padding: '30px 0' 
                    }}>
                        <CheckCircle2 size={60} color="#4ade80" style={{ marginBottom: '20px' }} />
                        
                        <h3 style={{ color: '#4ade80', marginBottom: '10px', fontSize: '1.5rem' }}>
                            E-mail Enviado!
                        </h3>
                        
                        <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '280px' }}>
                            Verifique sua caixa de entrada e a pasta de spam para redefinir sua senha.
                        </p>
                    </div>
                )}

                <div className="signup-link">
                    <p><Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <ArrowLeft size={16} /> Voltar para o Login
                    </Link></p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;