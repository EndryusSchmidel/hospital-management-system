import "./Header.css"

const Header = () => {
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
                <div className="user-profile">
                <img src="https://i.pravatar.cc/40" alt="Foto do usuário" />
                </div>
            </div>
            </header>
    );
};

export default Header;
