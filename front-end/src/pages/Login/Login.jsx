import { FaUser, FaLock, FaInfoCircle } from "react-icons/fa" // Adicionei o FaInfoCircle
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import "./Login.css"
import api from "../../services/api";

const Login = () => {
    useEffect(() => {
    localStorage.removeItem("token");
    }, []);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Função mágica para o recrutador
    const preencherVisitante = () => {
        setUsername("teste@teste.com");
        setPassword("1234");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username.trim() === "" || password.trim() === "") {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const response = await api.post("/auth/login", {
                username: username,
                password: password
            });
            localStorage.setItem("token", response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error("DEBUG LOGIN:", error.response); // Olhe isso no F12 do navegador
            alert("Erro ao acessar: " + (error.response?.data?.message || "Usuário ou senha inválidos"));
        }
    };

    return (
        <div className="login-screen-wrapper">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="titulo">
                        <h1>Acessar sistema</h1>
                    </div>
                    
                    {/* Input de E-mail com value vinculado ao state */}
                    <div>
                        <input 
                            type="email" 
                            placeholder='E-mail' 
                            className="input-email" 
                            value={username} // Importante para o preenchimento automático funcionar
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    {/* Input de Senha com value vinculado ao state */}
                    <div>
                        <input 
                            type="password" 
                            placeholder='Senha' 
                            className="input-password" 
                            value={password} // Importante para o preenchimento automático funcionar
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <div className="recall-forget">
                        <label className="lembrar">
                            <input className="checkbox" type="checkbox"/>
                            Lembrar de mim
                        </label>
                        <a href="#" className="forget-password">Esqueceu a senha?</a>
                    </div>

                    <button className="button-enter">Entrar</button>

                    {/* DICA VISUAL: Card de Acesso para Visitante */}
                    <div className="guest-access-card">
                        <div className="guest-header">
                            <FaInfoCircle title="Esta conta não tem permissão para deletar patrimônios!" /> <span>Acesso para Teste</span>
                        </div>
                        <p>Use as credenciais de visitante para explorar:</p>
                        <button 
                            type="button" 
                            className="btn-auto-fill" 
                            onClick={preencherVisitante}
                        >
                            Preencher como Visitante
                        </button>
                    </div>

                    <div className="signup-link">
                        <p>Não tem uma conta? <a href="#">Registrar</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login