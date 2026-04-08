import "./Sidebar.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Ícones modernos para Mobile
import logo from '../../../assets/logo.png';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const rotaAtual = location.pathname;

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Função que navega e fecha a sidebar em telas menores
    const handleNavigation = (rota) => {
        navigate(rota);
        setIsOpen(false); 
    };

    return (
        <>
            {/* BOTÃO HAMBÚRGUER (Aparece apenas no Mobile) */}
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <Menu size={24} />
            </button>

            {/* FUNDO ESCURECIDO (Aparece quando a Sidebar está aberta no Mobile) */}
            {isOpen && (
                <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>
            )}

            {/* SIDEBAR */}
            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                

                <div className="profile-section">
                    <div className="profile-photo-container">
                        <img 
                            src={logo} 
                            alt="Foto de perfil de Endryus Schmidel" 
                            className="profile-photo" 
                        />
                    </div>
                    <div className="profile-info">
                        <span className="profile-subtitle">Full Stack Developer</span>
                    </div>
                </div>

                {/* Lista de Navegação */}
                <nav className="sidebar-nav">
                    <ul>
                        <li className={rotaAtual === '/dashboard' ? 'active' : ''}
                            onClick={() => handleNavigation('/dashboard')}>
                            <i className="fa-solid fa-chart-line"></i> Dashboard
                        </li>
                        <li className={rotaAtual === '/todos-patrimonios' ? 'active' : ''}
                            onClick={() => handleNavigation('/todos-patrimonios')}>
                            <i className="fa-solid fa-layer-group"></i> Todos Patrimônios
                        </li>
                        <li className={rotaAtual === '/ativos' ? 'active' : ''}
                            onClick={() => handleNavigation('/ativos')}
                        >
                            <i className="fa-solid fa-circle-check"></i> Ativos
                        </li>
                        <li className={rotaAtual === '/inativos' ? 'active' : ''}
                            onClick={() => handleNavigation('/inativos')}
                        >
                            <i className="fa-solid fa-circle-xmark"></i> Inativos
                        </li>
                        <li className={rotaAtual === '/manutencao' ? 'active' : ''}
                            onClick={() => handleNavigation('/manutencao')}
                        >
                            <i className="fa-solid fa-screwdriver-wrench"></i> Em manutenção
                        </li>
                        <li className={rotaAtual === '/historico' ? 'active' : ''}
                            onClick={() => handleNavigation('/historico')}>
                            <i className="fas fa-file-signature"></i> Histórico
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;