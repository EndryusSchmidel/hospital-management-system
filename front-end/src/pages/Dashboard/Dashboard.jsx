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
    // 1. Dispara o SweetAlert de Confirmação (Substituindo o window.confirm feio)
    const resultado = await Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação não poderá ser revertida!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // Vermelho Rose (Ação de Destruição)
        cancelButtonColor: '#64748b',  // Cinza Discreto (Ação Segura)
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar',
        reverseButtons: true, // Coloca o Cancelar na esquerda e Excluir na direita (Melhor UX)
        background: 'var(--bg-card)', // 🌙 Fundo adapta ao Dark Mode
        color: 'var(--text-main)'     // 🌙 Texto adapta ao Dark Mode
    });

    // 2. Se o usuário clicou no botão vermelho de confirmar...
    if (resultado.isConfirmed) {
      try {
        await api.delete(`/patrimonios/${id}`);
        toast.success("Patrimônio removido com sucesso!");
        carregarPatrimonios();
      } catch (error) {
        const msgErro = error.response?.data?.message || "Erro interno ou acesso negado.";
        
        // 3. SweetAlert de Erro (Também adaptado pro Dark Mode)
        Swal.fire({
            title: 'Erro!',
            text: msgErro,
            icon: 'error',
            confirmButtonColor: '#0ea5e9', // Azul SaaS para o botão "OK"
            background: 'var(--bg-card)', 
            color: 'var(--text-main)'
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