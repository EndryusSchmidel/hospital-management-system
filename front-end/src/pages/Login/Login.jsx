import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Info, AlertCircle, ArrowRight } from "lucide-react"; // 🚀 Ícones modernos e limpos
import { toast } from 'react-toastify';
import api from "../../services/api";
import "./Login.css";

const Login = () => {
    useEffect(() => {
        localStorage.removeItem("token");
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Função mágica para o recrutador
    const preencherVisitante = () => {
        setEmail("teste@teste.com");
        setPassword("1234");
        setLoginError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError("");

        if (email.trim() === "" || password.trim() === "") {
            toast.warn("Preencha todos os campos!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email: email,
                password: password
            });
            localStorage.setItem("token", response.data.token);
            toast.info("Acesso autorizado. Bem-vindo!");
            navigate('/dashboard');
        } catch (error) {
            console.error("DEBUG LOGIN:", error.response);
            setLoginError("E-mail ou senha incorretos. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-screen-wrapper">
            {/* Camada escura sobre a imagem para dar contraste ao card */}
            <div className="login-overlay"></div> 

            <div className="login-glass-card">
                <div className="login-header">
                    <h1>Acesso Restrito</h1>
                    <p>Gestão de Patrimônio Hospitalar</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    
                    {/* Input Group: E-mail */}
                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input 
                            type="email" 
                            placeholder="E-mail corporativo" 
                            className={`modern-input ${loginError ? 'input-error' : ''}`} 
                            value={email} 
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if(loginError) setLoginError("");
                            }}
                        />
                    </div>
                    
                    {/* Input Group: Senha */}
                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input 
                            type="password" 
                            placeholder="Sua senha" 
                            className={`modern-input ${loginError ? 'input-error' : ''}`} 
                            value={password} 
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if(loginError) setLoginError("");
                            }} 
                        />
                    </div>

                    {/* Mensagem de Erro perfeitamente alinhada abaixo do input */}
                    {loginError && (
                        <div className="error-message-container">
                            <AlertCircle size={16} />
                            <span>{loginError}</span>
                        </div>
                    )}

                    {/* Opções de Login */}
                    <div className="login-options">
                        <label className="checkbox-container">
                            <input type="checkbox" className="custom-checkbox"/>
                            <span>Lembrar de mim</span>
                        </label>
                        <a href="#" className="forget-password">Esqueceu a senha?</a>
                    </div>

                    {/* Botão Principal */}
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? "Autenticando..." : "Entrar no Sistema"}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="divider">
                    <span>OU</span>
                </div>

                {/* Card de Visitante (Estilo SaaS Callout) */}
                <div className="guest-access-card">
                    <div className="guest-header">
                        <Info size={18} /> 
                        <span>Acesso para Recrutadores</span>
                    </div>
                    <p>Explore o sistema com permissões de leitura e relatórios.</p>
                    <button type="button" className="btn-guest" onClick={preencherVisitante}>
                        Preencher como Visitante
                    </button>
                </div>

                <div className="signup-link">
                    <p>Não possui credenciais? <Link to="/register">Solicitar acesso</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;