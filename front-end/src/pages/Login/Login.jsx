import {FaUser, FaLock} from "react-icons/fa"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "./Login.css"
import api from "../../services/api";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

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

            // 🔐 salva token
            localStorage.setItem("token", response.data.token);

            // redireciona
            navigate('/dashboard');

        } catch (error) {
            alert("Usuário ou senha inválidos", error);
        }
    };

return (
    <div className="login-screen-wrapper">
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="titulo">
                <h1>Acessar sistema</h1>
                </div>
                <div>
                    <input type="email" size={"40"} name="email" id="email" placeholder='E-mail' className="input-email" onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div>
                    <input type="password" size={"40"} name="password" className="input-password" id="password" placeholder='Senha' onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="recall-forget">
                    <label htmlFor="" className="lembrar">
                        <input className="checkbox" type="checkbox"/>
                        Lembrar de mim
                    </label>
                    <a href="$" className="forget-password">Esqueceu a senha?</a>
                </div>
                <button className="button-enter">Entrar</button>
                <div className="signup-link">
                    <p>Não tem uma conta? <a href="$">Registar</a></p>
                </div>
            </form>
        </div>
    </div>
    )
}

export default Login