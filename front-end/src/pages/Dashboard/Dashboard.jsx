import "./Dashboard.css";
import { useState } from 'react';
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Registrar as ferramentas do gráfico
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Dados do Gráfico de Barras (Headcount)
  const barData = {
    labels: [
      "CTI",
      "S. Vermelha",
      "S. Amarela",
      "Consultório",
      "Recepção",
      "ADM",
    ],
    datasets: [
      {
        label: "Quantidade",
        data: [27, 9, 14, 19, 17, 22],
        backgroundColor: "#0076a8",
        borderRadius: 5,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico respeite o tamanho da div
    plugins: {
      legend: { display: false }, // Esconde a legenda igual na imagem
    },
  };

  const donutData = {
    labels: ["Ativos", "Inativos"],
    datasets: [
      {
        data: [97, 5],
        backgroundColor: ["#0076a8", "#8a0000"], // Verde água e Vermelho
        borderWidth: 0,
      },
    ],
  };

  return (
    
    
    <div className="dashboard-container">
      {/* Lado Esquerdo: Sidebar */}
      <aside className="sidebar">
        {/* Área do Logo - Igual à imagem */}
        <div className="logo-area">
          <i className="fas fa-info-circle"></i> {/* Ícone azul claro */}
          <span className="logo-text">Endryus Schmidel</span>
        </div>

        {/* Lista de Navegação */}
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <i className="fas fa-th-large"></i> Dashboard
            </li>
            <li>
              <i className="fa-solid fa-boxes-stacked"></i> Todos Patrimônios
            </li>
            <li>
              <i className="fa-solid fa-circle-check"></i> Ativos
            </li>
            <li>
              <i className="fa-solid fa-circle-xmark"></i> Inativos
            </li>
            <li>
              <i className="fa-solid fa-screwdriver-wrench"></i> Em manutenção
            </li>
            <li>
              <i className="fa-solid fa-qrcode"></i> Etiquetas/QR Code
            </li>
            <li>
              <i className="fas fa-file-signature"></i> Relatórios
            </li>
          </ul>
        </nav>
      </aside>

      {/* Lado Direito: Conteúdo Principal */}
      <main className="main-content">
        
        {/* Local do Header (Etapa 3) */}
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Dashboard Geral</h2>
          {/* Botão para o seu Back-end de Patrimônios */}
          <button className="btn-add-patrimonio" onClick={() => setIsModalOpen(true)}
            style={{
              padding: "10px 15px",
              backgroundColor: "#0076a8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            + Gerenciar Patrimônios
          </button>
        </div>

        {/* Local dos Cards (Etapa 4) */}
        <div className="kpi-container-bg">
          <section className="kpi-grid">
            {/* Card 1: p Total / Azul escuro */}
            <div className="kpi-card total">
              <div className="kpi-content">
                <h2>102</h2>
                <p>Total de patrimônios</p>
              </div>
              <i className="fa-solid fa-chart-simple"></i>
            </div>

            {/* Card 2: P Ativos / Azul ciano */}
            <div className="kpi-card ativos">
              <div className="kpi-content">
                <h2>97</h2>
                <p>Patrimônios Ativos</p>
              </div>
              <i className="fa-solid fa-check"></i>
            </div>

            {/* Card 3: P Inativos / vermelho*/}
            <div className="kpi-card inativos">
              <div className="kpi-content">
                <h2>5</h2>
                <p>Patrimônios Inativos</p>
              </div>
              <i className="fa-solid fa-xmark"></i>
            </div>

            {/* Card 4: p Valor / verde */}
            <div className="kpi-card valor-total">
              <div className="kpi-content">
                <h2>R$ 99.999</h2>
                <p>Valor total de Patrimônios</p>
              </div>
              <i className="fa-solid fa-money-bill-wave"></i>
            </div>
          </section>
        </div>
        <section className="charts-grid">
          <div className="chart-card">
            <h3>Distribuição por Setor</h3>
            <div style={{ flex: 1 }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h3>Status do Inventário</h3>
            <div style={{ flex: 1 }}>
              <Doughnut
                data={donutData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </section>
        <section className="inventory-section">
          <div className="inventory-header">
            <h3>Últimos Patrimônios Cadastrados</h3>
            <div className="inventory-actions">
              <div className="search-bar">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Buscar por Nome, Marca ou ID..."
                />
              </div>
              <button className="btn-filter">
                <i className="fa-solid fa-filter"></i> Filtrar
              </button>
            </div>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Marca</th>
                <th>Etiqueta</th>
                <th>Setor</th> {/* Nova Coluna */}
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monitor Cardíaco</td>
                <td>Philips</td>
                <td>124-ABC</td>
                <td>
                  <span className="sector-tag">CTI</span>
                </td>{" "}
                {/* Exemplo de Setor */}
                <td>
                  <span className="status active">Ativo</span>
                </td>
                <td>
                  <button className="btn-edit">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="btn-delete">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>Desfibrilador</td>
                <td>Zoll</td>
                <td>552-DEF</td>
                <td>
                  <span className="sector-tag">S. Vermelha</span>
                </td>
                <td>
                  <span className="status inactive">Inativo</span>
                </td>
                <td>
                  <button className="btn-edit">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="btn-delete">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        {/* POPUP GERENCIAR PATRIMONIOS */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Cadastrar Novo Patrimônio</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              
              <form className="modal-form">
                <div className="form-group">
                  <label>Nome do Equipamento</label>
                  <input type="text" placeholder="Ex: Monitor Cardíaco" />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Marca</label>
                    <input type="text" placeholder="Ex: Philips" />
                  </div>
                  <div className="form-group">
                    <label>Nº Etiqueta</label>
                    <input type="text" placeholder="Ex: 124-ABC" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Setor Destinado</label>
                  <select>
                    <option value="">Selecione o setor...</option>
                    <option value="cti">CTI</option>
                    <option value="s-vermelha">Sala Vermelha</option>
                    <option value="centro-cirurgico">Centro Cirúrgico</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn-save">Salvar Patrimônio</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
