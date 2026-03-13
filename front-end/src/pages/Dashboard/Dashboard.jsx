import "./Dashboard.css";
import { useEffect, useState } from 'react';
import Sidebar from "../../components/DashboardComponents/Sidebar/Sidebar";
import Kpicards from "../../components/DashboardComponents/kpicards/kpicards";
import PatrimonioModal from "../../components/DashboardComponents/patrimoniomodal/patrimoniomodal";
import InventoryTable from "../../components/DashboardComponents/inventorytable/inventorytable";
import Header from "../../components/DashboardComponents/Header/Header";
import DashboardCharts from "../../components/DashboardComponents/DashboardCharts/DashboardCharts";
import HistoryModal from "../../components/DashboardComponents/HistoryModal/HistoryModal"
import api from "../../services/api";
import { ImportIcon } from "lucide-react";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patrimonios, setPatrimonios] = useState([]);
  const carregarPatrimonios = async () => {
    try {
      const response = await api.get("/patrimonios");
      setPatrimonios(response.data);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  };
  useEffect(() => {
    carregarPatrimonios();
  }, [])
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

        {/* Local dos Cards*/}
        <Kpicards dados={{
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
        onDelete={handleDelete}
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

