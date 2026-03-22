import "./Dashboard.css";
import { useEffect, useState } from 'react';
import Sidebar from "../../components/DashboardComponents/Sidebar/Sidebar";
import KpiCards from "../../components/DashboardComponents/KpiCards/KpiCards";
import PatrimonioModal from "../../components/DashboardComponents/PatrimonioModal/PatrimonioModal";
import InventoryTable from "../../components/DashboardComponents/InventoryTable/InventoryTable";
import Header from "../../components/DashboardComponents/Header/Header";
import DashboardCharts from "../../components/DashboardComponents/DashboardCharts/DashboardCharts";
import HistoryModal from "../../components/DashboardComponents/HistoryModal/HistoryModal"
import api from "../../services/api";
import { ImportIcon } from "lucide-react";

const Dashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
    }
  }, []);

  const [usuario, setUsuario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patrimonios, setPatrimonios] = useState([]);
  const carregarPatrimonios = async () => {
    try {
      const response = await api.get("/patrimonios", {
        params: {
          page: 0,
          size: 1000
        }
    });
      setPatrimonios(response.data.content);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  };

  useEffect(() => {

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  async function carregarUsuario() {
    try {
      const response = await api.get("/auth/me");
      setUsuario(response.data);
    } catch (error) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }

  carregarUsuario();
  carregarPatrimonios();

}, []);

  const valorTotalGeral = patrimonios.reduce((acc, p) => acc + (p.valor || 0), 0);

  const [selectedHistoryId, setSelectedHistoryId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir exte patrimônio?")) {
      try {
        await api.delete(`/patrimonios/${id}`);
        carregarPatrimonios();
      } catch (error) {
        alert("Erro ao excluir: " + error.response?.data?.message);
      }
    }
  };

  const [patrimonioParaEditar, setPatrimonioParaEditar] = useState(null);

  const handleEdit = (patrimonio) => {
    setPatrimonioParaEditar(patrimonio);
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      {/* Lado Esquerdo: Sidebar */}
      <Sidebar />

      {/* Lado Direito: Conteúdo Principal */}
      <main className="main-content">
        
        {/* Local do Header (Etapa 3) */} 
        <Header /> 

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Dashboard Geral</h2>
          {/* Botão para Back-end de Patrimônios */}
          <button className="btn-add-patrimonio" onClick={() => setIsModalOpen(true)}>
            + Cadastrar Patrimônio
          </button>
        </div>

        {/* Local dos Cards*/}
        <KpiCards dados={{
          total: patrimonios.length,
          ativos: patrimonios.filter(p => p.status === 'ativo').length,
          inativos: patrimonios.filter(p => p.status === 'inativo').length,
          valorTotal: valorTotalGeral
        }}/>

        {/* DashboardCharts */}
        <DashboardCharts data={patrimonios}/>

        {/* Tabela de inventarios */}
        <InventoryTable 
        data={patrimonios} 
        onVerHistorico={(id) => setSelectedHistoryId(id)}
        onEdit={handleEdit}
        onDelete={usuario?.roles[0]?.authority === "ROLE_ADMIN" ? handleDelete : null}
        />

        {selectedHistoryId && (
          <HistoryModal
            idPatrimonio={selectedHistoryId}
            onClose={() => setSelectedHistoryId(null)}
            />
        )}

        {/* POPUP GERENCIAR PATRIMONIOS */}
        <PatrimonioModal 
          isOpen={isModalOpen} 
          data={patrimonioParaEditar}
          onClose={() => {
            setIsModalOpen(false);
            setPatrimonioParaEditar(null);
          }}
          onPatrimonioSalvo={carregarPatrimonios}
        />

      </main>
    </div>
  );
};

export default Dashboard;

