import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react"; 
import profileIMG from "../../../assets/profilePicture.jpeg";
import "./Header.css";
import { ThemeToggle } from "../../ThemeToggle";

const Header = () => {
    const navigate = useNavigate();
    const menuRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/"; 
    };


    return (
        <header className="main-header">
            {/* Lado Esquerdo: Hambúrguer (Mobile) + Links (Desktop) */}
            <div className="header-left">
                <div className="header-menu">
                    <span>Feed</span>
                    <span>Agenda</span>
                    <span className="active-link">Gestão</span>
                    <span>Feedbacks</span>
                    <span>Tarefas</span>
                </div>
            </div>

            {/* Lado Direito: Busca, Sino e Perfil */}
            
            <div className="header-right">
                <ThemeToggle/>
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Encontre conexões" />
                </div>
                
                <i className="far fa-bell icon-btn notification-icon"></i>

                
                <div className="user-profile-container" ref={menuRef}>
                    <img 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        src={profileIMG} 
                        alt="Foto do usuário"
                        className="profile-img"
                    />
                    

                    {isMenuOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-user-info">
                                <strong>Endryus Schmidel</strong>
                                <small>Visualizando Dashboard</small>
                            </div>
                            <hr />
                            <ul>
                                <li onClick={() => navigate('#')}>Meu Perfil</li>
                                <li onClick={() => navigate('#')}>Configurações</li>
                                <li className="logout-option" onClick={handleLogout}>Sair</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;