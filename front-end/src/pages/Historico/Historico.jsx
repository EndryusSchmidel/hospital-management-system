import React, { useEffect, useState, useRef } from 'react';
import "./Historico.css";
import Sidebar from '../../components/DashboardComponents/Sidebar/Sidebar';
import Header from '../../components/DashboardComponents/Header/Header';
import api from '../../services/api';
import { RefreshCw, FileText, PackageOpen, SearchX, ChevronDown, MapPin, DollarSign, Tag, Activity } from 'lucide-react';

const Historico = () => {
    const [historicoPatrimonios, setHistoricoPatrimonios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [busca, setBusca] = useState("");
    const topoDaListaRef = useRef(null);

    // 🚀 ESTADO DO ACCORDION: Controla qual card está aberto
    const [expandedId, setExpandedId] = useState(null);

    const toggleCard = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const gerarRelatorioPDF = () => {
        setLoading(true);
        api.get('/patrimonios/relatorio-historico', {
            params: { busca: busca || undefined },
            responseType: 'blob' 
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const dataAtual = new Date().toLocaleDateString('pt-BR').replaceAll('/', '-');
            link.setAttribute('download', `Historico_Patrimonio_${dataAtual}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Erro ao gerar PDF", err);
            setLoading(false);
            alert("Erro ao gerar o relatório. Verifique o console.");
        });
    };

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    const formatarTexto = (str) => {
        if (!str) return "";
        return str
            .replace(/_/g, ' ') 
            .replace(/\b\w/g, (l) => l.toUpperCase()); 
    };

    const carregarHistorico = (pagina = 0) => {
        setLoading(true);
        api.get(`/patrimonios/historico-geral`, {
            params: {
                page: pagina,
                size: 10,
                busca: busca || undefined
            }
        })
        .then(response => {
            setHistoricoPatrimonios(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(response.data.number);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro ao buscar histórico", err);
            setLoading(false);
        });
    };

    const getAcaoConfig = (tipo) => {
        switch (tipo) {
            case 0: return { label: "ADICIONADO", classe: "adicionado" };
            case 1: return { label: "EDITADO", classe: "editado" };
            case 2: return { label: "REMOVIDO", classe: "removido" };
            default: return { label: "DESCONHECIDO", classe: "desconhecido" };
        }
    };

    const getClasseStatus = (status) => {
        const s = status ? status.toLowerCase() : "";
        if (s === "ativo") return "ativo";
        if (s === "em manutenção" || s === "manutencao") return "manutencao";
        if (s === "inativo") return "inativo";
        return "";
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            carregarHistorico(0);
        }, 300);
        return () => clearTimeout(timeout);
    }, [busca]);

    useEffect(() => {
        if (!loading && topoDaListaRef.current) {
            topoDaListaRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }, [page, loading]);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content" ref={topoDaListaRef}>
                <Header />
                <div className='titulo-secao'>
                    <h1>Histórico de movimentações</h1>
                    <div className="inventory-actions">
                        <div className="search-bar">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            {!busca && (
                                <div className="marquee-container">
                                    <span className="marquee-text">
                                        Pesquisar no histórico por Nome, Marca, Etiqueta ou Setor...
                                    </span>
                                </div>
                            )}
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />
                        </div>
                        <div className="button-group" style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className="btn-relatorio" 
                                onClick={gerarRelatorioPDF}
                                disabled={loading}
                                title="Gerar Relatório PDF"
                            >
                                <FileText size={20} />
                                {loading ? 'Processando...' : 'Relatório'}
                            </button>

                            <button 
                                className={`btn-atualizar ${loading ? 'girando' : ''}`} 
                                onClick={() => carregarHistorico(page)}
                                disabled={loading}
                            >
                                <RefreshCw size={20} />
                                {loading ? 'Atualizando...' : 'Atualizar'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className='list-container'>
                    <ul className='smart-list'>
                        {historicoPatrimonios.length > 0 ? (
                            historicoPatrimonios.map((p, index) => {
                                const acaoConfig = getAcaoConfig(p.revisaoNumero);
                                const classeStatus = getClasseStatus(p.status);
                                const isExpanded = expandedId === index;

                                return (
                                    // 🚀 O NOVO CARD DE HISTÓRICO EXPANSÍVEL
                                    <li 
                                        key={index} 
                                        className={`modern-card rev-border-${acaoConfig.classe} ${isExpanded ? 'expanded' : ''}`} 
                                        onClick={() => toggleCard(index)}
                                    >
                                        
                                        {/* CABEÇALHO DO CARD (Sempre Visível) */}
                                        <div className="card-header-visible">
                                            <div className="card-main-info">
                                                <div className="history-meta-top" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                                                    
                                                    <span className={`badge-acao rev-bg-${acaoConfig.classe}`}>
                                                        {acaoConfig.label}
                                                    </span>
                                                    
                                                    
                                                    <span className="historico-data">
                                                        {new Date(p.dataRevisao).toLocaleDateString('pt-BR')} às {new Date(p.dataRevisao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                                <span className="item-name">{p.name}</span>
                                                <div className="detail-item" title="Etiqueta">
                                                        <Tag size={16} /> <span>{p.etiqueta}</span>
                                                    </div>
                                            </div>
                                            
                                            <ChevronDown className="expand-icon" size={24} />
                                        </div>

                                        {/* CORPO EXPANSÍVEL (Detalhes do Patrimônio na época) */}
                                        <div className="card-expandable-area">
                                            <div className="card-expandable-content">
                                                <div className="card-details-row">
                                                    <div className="detail-item" title="Marca">
                                                        <PackageOpen size={16} /> <span>{p.marca}</span>
                                                    </div>
                                                    <div className="detail-item" title="Setor">
                                                        <MapPin size={16} /> <span>{formatarTexto(p.setor)}</span>
                                                    </div>
                                                    <div className="detail-item highlight-valor" title="Valor">
                                                        <DollarSign size={16} /> <span>{formatarMoeda(p.valor)}</span>
                                                    </div>
                                                    <div className="detail-item" title="Status do Equipamento">
                                                        <Activity size={16} /> 
                                                        <span className={`status-text color-${classeStatus}`}>
                                                            {formatarTexto(p.status)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <div className="empty-state-container">
                                <div className="empty-state-icon">
                                    {busca ? <SearchX size={60} strokeWidth={1.5} /> : <PackageOpen size={60} strokeWidth={1.5} />}
                                </div>
                                <h3>{busca ? `Nenhuma movimentação para "${busca}"` : "Histórico vazio"}</h3>
                                <p>Nenhum registro de auditoria foi encontrado no sistema.</p>
                                {!busca && (
                                    <button className="btn-empty-state" onClick={() => carregarHistorico(0)}>
                                        Atualizar Histórico
                                    </button>
                                )}
                            </div>
                        )}
                    </ul>
                    
                    {historicoPatrimonios.length > 0 && (
                        <div className="paginacao">
                            <button 
                                className='paginacao-btn' 
                                disabled={page === 0}
                                onClick={() => carregarHistorico(page - 1)}
                            >
                                Anterior
                            </button>

                            <span className='paginacao-texto'>Página {page + 1} de {totalPages}</span>

                            <button 
                                className='paginacao-btn' 
                                disabled={page + 1 >= totalPages}
                                onClick={() => carregarHistorico(page + 1)}
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Historico;