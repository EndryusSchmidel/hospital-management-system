import React, { useEffect, useState, useRef } from 'react';
import { RefreshCw, FileText, PackageOpen, SearchX, PlusCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';

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
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patrimonioParaEditar, setPatrimonioParaEditar] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (id, event) => {
        event.stopPropagation(); // Evita que o clique acione outros eventos da lista
        // Se clicar no mesmo que já está aberto, fecha. Se for outro, abre o novo.
        setActiveDropdown(activeDropdown === id ? null : id); 
    };

    const handleEdit = (patrimonio) => {
        setActiveDropdown(null);
        setPatrimonioParaEditar(patrimonio);
        setIsModalOpen(true);
    };

    const handleDelete = async (idPatrimonio) => {
        setActiveDropdown(null);
        const resultado = await Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação não poderá ser revertida!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    });
        if (resultado.isConfirmed) {
            try {
                await api.delete(`/patrimonios/${idPatrimonio}`);
                Swal.fire({
                    title: 'Excluído!',
                    text: 'O patrimônio foi removido com sucesso.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
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
                    icon: 'error'
                });
            }
        }
    };

    const gerarRelatorioPDF = () => {
    setLoading(true);
    
    // Chamamos o endpoint de relatório passando os mesmos filtros da busca atual
    api.get('/patrimonios/relatorio', {
        params: { 
            busca: busca || undefined,
            status: statusFiltro || undefined
        },
        responseType: 'blob'

    })
    .then((response) => {
        // Cria um link temporário na memória do navegador
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Define o nome do arquivo que será baixado
        const dataAtual = new Date().toLocaleDateString('pt-BR').replaceAll('/', '-');
        link.setAttribute('download', `Inventario_Geral_${dataAtual}.pdf`);         
        document.body.appendChild(link);
        link.click();
        
        // Limpeza
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

    // Função auxiliar para definir a cor baseada no Status
    const getClasseStatus = (status) => {
        const s = status ? status.toLowerCase() : "";
        if (s === "ativo") return "ativo";
        if (s === "em manutenção" || s === "manutencao") return "manutencao";
        if (s === "inativo") return "inativo";
        return "";
    };

    // 2. Função para carregar os dados do Back-end
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
            <main className="main-content"  ref={topoDaListaRef}>
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
                            <button className='paginacao-btn'
                                disabled={page === 0}
                                onClick={() => setPage(prev => prev - 1)}
                            >
                                Anterior
                            </button>

                            <span className='paginacao-texto'>Página {page + 1} de {totalPages}</span>

                            <button className='paginacao-btn'
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(prev => prev + 1)}
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                    <ul className="smart-list">
                        {patrimonios.length > 0 ? (
                            [...patrimonios].reverse().map((p, index) => {
                                const classeStatus = getClasseStatus(p.status);
                                const itemId = p.idPatrimonio || index;
            
                                return (
                                    <li key={itemId} className={`smart-row-base patrimonio-grid-layout status-${classeStatus}`}>
                                        {/* COLUNA 1: Nome e Detalhes (Ocupa mais espaço) */}
                                        <div className="row-main-info">
                                            <span className="item-name">{p.name}</span>
                                            <span className="item-sub-info">
                                                {p.marca} • <span className="item-etiqueta">{p.etiqueta}</span>
                                            </span>
                                        </div>

                                        {/* COLUNA 2: Setor (Fixo no centro) */}
                                        <div className="meta-group campo-setor">
                                            <span className="meta-label">Setor</span>
                                            <span className="meta-value">{formatarTexto(p.setor)}</span>
                                        </div>

                                        {/* COLUNA 3: Valor (Fixo antes das ações) */}
                                        <div className="meta-group campo-valor">
                                            <span className="meta-label">Valor</span>
                                            <span className="meta-value highlight-valor">
                                                {formatarMoeda(p.valor)}
                                            </span>
                                        </div>

                                        {/* COLUNA 4: Status e Ações (Direita) */}
                                        <div className="row-actions-principal">
                                            <span className={`badge-pill badge-${classeStatus}`}>
                                                {p.status || 'Não definido'}
                                            </span>

                                        <div className="action-menu-container">
                                            <button 
                                                className="btn-more-actions" 
                                                onClick={(e) => toggleDropdown(itemId, e)}
                                                title="Opções"
                                            >
                                                <MoreVertical size={20} color="#64748b" />
                                            </button>

                                        {activeDropdown === itemId && (
                                            <div className="dropdown-menu" ref={dropdownRef}>
                                                <button className="dropdown-item" onClick={() => handleEdit(p)}>
                                                    <Edit2 size={16} /> Editar
                                                </button>
                                                <button className="dropdown-item delete" onClick={() => handleDelete(itemId)}>
                                                    <Trash2 size={16} /> Excluir
                                                </button>
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        /* Seu empty state continua aqui normalmente... */
                        <div className="empty-state-container">...</div>
                        )}
                    </ul>
                    {patrimonios.length > 0 && (
                        <div className="paginacao">
                            <button className='paginacao-btn'
                                disabled={page === 0}
                                onClick={() => setPage(prev => prev - 1)}
                            >
                                Anterior
                            </button>

                            <span className='paginacao-texto'>Página {page + 1} de {totalPages}</span>

                            <button className='paginacao-btn'
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(prev => prev + 1)}
                            >
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
                        carregarDados(page); // Atualiza a lista após salvar/editar
                    }}
                />
            </main>
        </div>
    );
}

export default TodosPatrimonios;