import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, UserPlus, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from 'react-toastify';
import api from "../../services/api";
import "./Login.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!email || !password) {
            toast.warn("Preencha todos os campos!");
            return;
        }

        setIsLoading(true);

        try {
            // 🚀 Chamada para o endpoint que criamos no Java
            await api.post("/auth/register", {
                email: email,
                password: password
            });
            
            toast.success("Conta criada com sucesso! Faça seu login.");
            navigate('/login'); // Redireciona para o login após o sucesso
        } catch (err) {
            // Tratamento de erro: verifica se o e-mail já existe
            const msgErro = err.response?.data || "Erro ao criar conta. Tente novamente.";
            setError(msgErro);
            toast.error(msgErro);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-screen-wrapper">
            <div className="login-overlay"></div> 

            <div className="login-glass-card">
                <div className="login-header">
                    <h1>Nova Conta</h1>
                    <p>Solicitar acesso ao Sistema Hospitalar</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    
                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input 
                            type="email" 
                            placeholder="Seu melhor e-mail" 
                            className={`modern-input ${error ? 'input-error' : ''}`} 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input 
                            type="password" 
                            placeholder="Crie uma senha forte" 
                            className={`modern-input ${error ? 'input-error' : ''}`} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    {error && (
                        <div className="error-message-container">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? "Processando..." : "Criar Minha Conta"}
                        {!isLoading && <UserPlus size={18} />}
                    </button>
                </form>

                <div className="signup-link">
                    <p>Já possui acesso? <Link to="/login">Fazer Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;