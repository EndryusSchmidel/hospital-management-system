import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, FileText, PackageOpen, SearchX, PlusCircle, MoreVertical, Edit2, Trash2, ChevronDown, MapPin, DollarSign, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import api from '../../services/api';
import Header from '../../components/DashboardComponents/Header/Header';
import PatrimonioModal from '../../components/DashboardComponents/PatrimonioModal/PatrimonioModal';
import Sidebar from '../../components/DashboardComponents/Sidebar/Sidebar';

import "./TodosPatrimonios.css";
import "../../styles/GlobalStyles.css";

const TodosPatrimonios = ({ statusFiltro, tituloPagina}) => {
    const [patrimonios, setPatrimonios] = useState([]);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const topoDaListaRef = useRef(null);
    
    // 🚀 NOVO ESTADO: Controla qual Card está expandido (Accordion)
    const [expandedId, setExpandedId] = useState(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patrimonioParaEditar, setPatrimonioParaEditar] = useState(null);

    // Função de Toggle do Accordion
    const toggleCard = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEdit = (patrimonio) => {
        setPatrimonioParaEditar(patrimonio);
        setIsModalOpen(true);
    };

    const handleDelete = async (idPatrimonio) => {
        // 🚀 SWEET ALERT 2 ADAPTADO PARA DARK MODE
        const resultado = await Swal.fire({
            title: 'Tem certeza?',
            text: "Esta ação não poderá ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // Vermelho Rose (Destruição)
            cancelButtonColor: '#64748b',  // Cinza Discreto (Cancelar)
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            background: 'var(--bg-card)', // Herda o fundo do tema
            color: 'var(--text-main)'     // Herda o texto do tema
        });

        if (resultado.isConfirmed) {
            try {
                await api.delete(`/patrimonios/${idPatrimonio}`);
                Swal.fire({
                    title: 'Excluído!',
                    text: 'O patrimônio foi removido com sucesso.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)'
                });
                carregarDados(page);
            } catch (error) {
                console.log("=== LOG DE ERRO NA EXCLUSÃO ===");
                console.log("Erro completo:", error);
                console.log("Resposta do Servidor:", error.response);
                const msgErro = error.response?.data?.message || "Erro interno ou acesso negado.";
            
                Swal.fire({
                    title: 'Erro!',
                    text: msgErro,
                    icon: 'error',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)'
                });
            }
        }
    };

    const gerarRelatorioPDF = () => {
        setLoading(true);
        api.get('/patrimonios/relatorio', {
            params: { 
                busca: busca || undefined,
                status: statusFiltro || undefined
            },
            responseType: 'blob'
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const dataAtual = new Date().toLocaleDateString('pt-BR').replaceAll('/', '-');
            link.setAttribute('download', `Inventario_Geral_${dataAtual}.pdf`);         
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

    const getClasseStatus = (status) => {
        const s = status ? status.toLowerCase() : "";
        if (s === "ativo") return "ativo";
        if (s === "em manutenção" || s === "manutencao") return "manutencao";
        if (s === "inativo") return "inativo";
        return "";
    };

    const carregarDados = () => {
        setLoading(true);
        api.get("/patrimonios", {
            params: {
                page: page,
                size: 10,
                status: statusFiltro || undefined,
                busca: busca || undefined
            }
        })
        .then(response => {
            setPatrimonios(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(response.data.number);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro ao buscar patrimônios", err);
            setLoading(false);
            if(err.response?.status !== 401) {
                toast.error("Erro ao carregar dados.");
            }
        });
    };

    useEffect(() => {
        setPage(0);
    }, [statusFiltro, busca]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            carregarDados(page);
        }, 300);
        
        return () => clearTimeout(timeout);
    }, [page, statusFiltro, busca]);

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
                    <h1>{tituloPagina || "Todos os patrimônios"} </h1>
                    <div className="inventory-actions">
                        <div className="search-bar">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            {!busca && (
                                <div className="marquee-container">
                                    <span className="marquee-text">
                                        Pesquisar por Nome, Marca, Etiqueta, Setor ou Status (Ativo/Inativo)...
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
                                onClick={() => carregarDados(page)}
                                disabled={loading}
                            >
                                <RefreshCw size={20} />
                                {loading ? 'Atualizando...' : 'Atualizar'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className='list-container'>
                    {patrimonios.length > 9 && (
                        <div className="paginacao">
                            <button className='paginacao-btn' disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>
                                Anterior
                            </button>
                            <span className='paginacao-texto'>Página {page + 1} de {totalPages}</span>
                            <button className='paginacao-btn' disabled={page >= totalPages - 1} onClick={() => setPage(prev => prev + 1)}>
                                Próxima
                            </button>
                        </div>
                    )}
                    
                    <ul className="smart-list">
                        {patrimonios.length > 0 ? (
                            [...patrimonios].reverse().map((p, index) => {
                                const classeStatus = getClasseStatus(p.status);
                                const itemId = p.idPatrimonio || index;
                                const isExpanded = expandedId === itemId;
            
                                return (
                                    // 🚀 O NOVO CARD MOBILE-FIRST (ACCORDION)
                                    <li key={itemId} className={`modern-card status-${classeStatus} ${isExpanded ? 'expanded' : ''}`} onClick={() => toggleCard(itemId)}>
    
    {/* CABEÇALHO DO CARD (Sempre Visível) */}
    <div className="card-header-visible">
        <div className="card-main-info">
            <span className="item-name">{p.name}</span>
            <div className="card-badges">
                {/* Removemos a tag-etiqueta daqui e deixamos apenas o Status brilhando */}
                <div className="detail-item" title="Etiqueta">
                    <Tag size={16} /> <span>{p.etiqueta}</span>
                </div>
                <span className={`badge-pill badge-${classeStatus}`}>
                    {p.status || 'Indefinido'}
                </span>
            </div>
            
        </div>
        <ChevronDown className="expand-icon" size={24} />
    </div>

    {/* CORPO EXPANSÍVEL (Detalhes e Ações) */}
    <div className="card-expandable-area">
        <div className="card-expandable-content">
            
            {/* Detalhes com Ícones (Padronizado com o Histórico) */}
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
            </div>

            {/* Botões de Ação Grandes e Clicáveis */}
            <div className="card-actions-group">
                <button className="btn-card-action edit" onClick={(e) => { e.stopPropagation(); handleEdit(p); }}>
                    <Edit2 size={18} /> Editar
                </button>
                <button className="btn-card-action delete" onClick={(e) => { e.stopPropagation(); handleDelete(itemId); }}>
                    <Trash2 size={18} /> Excluir
                </button>
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
                                <h3>{busca ? `Nenhum resultado para "${busca}"` : "Nenhum patrimônio encontrado"}</h3>
                                <p>{busca ? "Verifique a ortografia ou tente termos mais genéricos." : `Atualmente não existem itens registrados com o status "${statusFiltro || 'Geral'}".`}</p>
                                {!busca && (
                                    <button className="btn-empty-state" onClick={() => window.location.reload()}>
                                        Atualizar Lista
                                    </button>
                                )}
                            </div>
                        )}
                    </ul>

                    {patrimonios.length > 0 && (
                        <div className="paginacao">
                            <button className='paginacao-btn' disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>
                                Anterior
                            </button>
                            <span className='paginacao-texto'>Página {page + 1} de {totalPages}</span>
                            <button className='paginacao-btn' disabled={page >= totalPages - 1} onClick={() => setPage(prev => prev + 1)}>
                                Próxima
                            </button>
                        </div>
                    )}
                </div>
                <PatrimonioModal 
                    isOpen={isModalOpen} 
                    data={patrimonioParaEditar}
                    onClose={() => {
                        setIsModalOpen(false);
                        setPatrimonioParaEditar(null);
                    }}
                    onPatrimonioSalvo={() => {
                        toast.success("Patrimônio salvo com sucesso!");
                        carregarDados(page); 
                    }}
                />
            </main>
        </div>
    );
}

export default TodosPatrimonios;