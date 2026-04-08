import React, { useEffect, useState } from 'react';
import "./Dashboard.css";
import Sidebar from "../../components/DashboardComponents/Sidebar/Sidebar";
import KpiCards from "../../components/DashboardComponents/KpiCards/KpiCards";
import PatrimonioModal from "../../components/DashboardComponents/PatrimonioModal/PatrimonioModal";
import InventoryTable from "../../components/DashboardComponents/InventoryTable/InventoryTable";
import Header from "../../components/DashboardComponents/Header/Header";
import DashboardCharts from "../../components/DashboardComponents/DashboardCharts/DashboardCharts";
import HistoryModal from "../../components/DashboardComponents/HistoryModal/HistoryModal";
import api from "../../services/api";
import { Plus } from "lucide-react";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patrimonios, setPatrimonios] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [patrimonioParaEditar, setPatrimonioParaEditar] = useState(null);

  const valorTotalGeral = patrimonios.reduce((acc, p) => acc + (p.valor || 0), 0);

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
        console.log("Erro ao carregar usuário: ", error);
      }
    }

    carregarUsuario();
    carregarPatrimonios();
  }, []);

  const carregarPatrimonios = async () => {
    try {
      const response = await api.get("/patrimonios", {
        params: { page: 0, size: 1000 }
      });
      setPatrimonios(response.data.content);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  };

  const handlePatrimonioSalvo = () => {
    setIsModalOpen(false);
    setPatrimonioParaEditar(null);
    carregarPatrimonios();
    toast.success("Dados salvos com sucesso!");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este patrimônio?")) {
      try {
        await api.delete(`/patrimonios/${id}`);
        toast.success("Patrimônio removido com sucesso!");
        carregarPatrimonios();
      } catch (error) {
        const msgErro = error.response?.data?.message || "Erro interno ou acesso negado.";
        Swal.fire({
            title: 'Erro!',
            text: msgErro,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#0284c7' // Azul SaaS
        });
      }
    }
  };

  const handleEdit = (patrimonio) => {
    setPatrimonioParaEditar(patrimonio);
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container bg-gray-50 dark:bg-slate-950">
      <Sidebar />

      <main className="main-content fade-in">
        <Header /> 

        {/* Criei uma classe específica para organizar o cabeçalho interno */}
        <div className="dashboard-page-header">
          <div>
            <h2 className="page-title">Dashboard Geral</h2>
            <p className="page-subtitle">Visão geral e gestão estratégica de ativos</p>
          </div>
          
          <button className="btn-add-patrimonio" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} strokeWidth={2.5} />
            Cadastrar Patrimônio
          </button>
        </div>

        {/* Os componentes filhos devem herdar o novo CSS de sombras e bordas (ver abaixo) */}
        <KpiCards dados={{
          total: patrimonios.length,
          ativos: patrimonios.filter(p => p.status === 'ativo').length,
          inativos: patrimonios.filter(p => p.status === 'inativo').length,
          valorTotal: valorTotalGeral
        }}/>

        <DashboardCharts data={patrimonios}/>

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

        <PatrimonioModal 
          isOpen={isModalOpen} 
          data={patrimonioParaEditar}
          onClose={() => {
            setIsModalOpen(false);
            setPatrimonioParaEditar(null);
          }}
          onPatrimonioSalvo={handlePatrimonioSalvo}
        />

      </main>
    </div>
  );
};

export default Dashboard;