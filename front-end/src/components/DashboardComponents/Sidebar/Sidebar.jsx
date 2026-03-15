import "./Sidebar.css"
import { useNavigate, useLocation} from "react-router-dom";
import logo from '../../../assets/logo.png';


const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const rotaAtual = location.pathname;

    return (
        <aside className="sidebar">
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
                    onClick={() => navigate('/dashboard')}>
                    <i className="fa-solid fa-chart-line"></i> Dashboard
                </li>
                <li className={rotaAtual === '/todos-patrimonios' ? 'active' : ''}
                    onClick={() => navigate('/todos-patrimonios')}>
                    <i className="fa-solid fa-layer-group"></i> Todos Patrimônios
                </li>
                <li className={rotaAtual === '/ativos' ? 'active' : ''}
                    onClick={() => navigate('/ativos')}
                >
                    <i className="fa-solid fa-circle-check"></i> Ativos
                </li>
                <li className={rotaAtual === '/inativos' ? 'active' : ''}
                    onClick={() => navigate('/inativos')}
                >
                    <i className="fa-solid fa-circle-xmark"></i> Inativos
                </li>
                <li className={rotaAtual === '/manutencao' ? 'active' : ''}
                    onClick={() => navigate('/manutencao')}
                >
                    <i className="fa-solid fa-screwdriver-wrench"></i> Em manutenção
                </li>
                <li className={rotaAtual === '/historico' ? 'active' : ''}
                    onClick={() => navigate('/historico')}>
                    <i className="fas fa-file-signature" ></i> Histórico
                </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;