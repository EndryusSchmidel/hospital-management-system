import {FaUser, FaLock} from "react-icons/fa"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "./Login.css"

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aqui você faria a validação (ex: se o login está correto)
    if (username.trim() !== "" && password.trim() !== "") {
        console.log("Enviando dados:", { username, password });

        // 3. O PULO DO GATO: Redireciona para a rota que você criou no App.jsx
        navigate('/Dashboard');
    } else {
        alert("Preencha todos os campos!");
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