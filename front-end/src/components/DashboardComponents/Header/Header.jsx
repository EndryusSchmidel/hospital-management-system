import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import profileIMG from "../../../assets/profilePicture.jpeg";
import "./Header.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef()

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/"; 
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="main-header">
            {/* Links da Esquerda */}
            <div className="header-menu">
                <span>Feed</span>
                <span>Agenda</span>
                <span className="active-link">Gestão</span>
                <span>Feedbacks</span>
                <span>Tarefas</span>
            </div>

            {/* Lado Direito: Busca e Perfil */}
            <div className="header-right">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Encontre alguma conexão" />
                </div>
                
                <i className="far fa-bell icon-btn"></i>

                {/* Container do Perfil com Menu */}
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
                                <small>Visualizando Hospital</small>
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