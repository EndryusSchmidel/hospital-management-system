import React, { useEffect, useState } from 'react';
import "./Historico.css";
import Sidebar from '../../components/DashboardComponents/Sidebar/Sidebar';
import Header from '../../components/DashboardComponents/Header/Header';
import api from '../../services/api';
import { RefreshCw, FileText } from 'lucide-react';

const Historico = () => {
    const [historicoPatrimonios, setHistoricoPatrimonios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [busca, setBusca] = useState("");

    const gerarRelatorioPDF = () => {
    setLoading(true);
    
    // Chamamos o endpoint de relatório passando os mesmos filtros da busca atual
    api.get('/patrimonios/relatorio-historico', {
        params: { busca: busca || undefined },
        responseType: 'blob' // CRUCIAL: avisa o Axios que o retorno é um arquivo
    })
    .then((response) => {
        // Cria um link temporário na memória do navegador
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Define o nome do arquivo que será baixado
        const dataAtual = new Date().toLocaleDateString('pt-BR').replaceAll('/', '-');
        link.setAttribute('download', `Historico_Patrimonio_${dataAtual}.pdf`);
        
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

    const getStatusConfig = (tipo) => {
        switch (tipo) {
            case 0: return { label: "ADICIONADO", color: "#28a745", bg: "#e6ffed" };
            case 1: return { label: "EDITADO", color: "#eab308", bg: "#fffbe6" };
            case 2: return { label: "REMOVIDO", color: "#dc3545", bg: "#ffeef0" };
            default: return { label: "DESCONHECIDO", color: "#6c757d", bg: "#f8f9fa" };
        }
    };

    // Debounce para a busca: espera o usuário parar de digitar por 300ms
    useEffect(() => {
        const timeout = setTimeout(() => {
            carregarHistorico(0);
        }, 300);
        return () => clearTimeout(timeout);
    }, [busca]);

    // Scroll suave ao trocar de página ou carregar
    useEffect(() => {
        if (!loading) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [loading, page]);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <Header />
                <div className='titulo-secao'>
                    <h1>Histórico de movimentações</h1>

                    {/* Container de ações identico ao TodosPatrimonios */}
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
                                className="btn-relatorio" // Crie um estilo azul ou cinza para este
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

                <div className='historico-conteudo'>
                    <ul className='historico-lista'>
                        {historicoPatrimonios.length > 0 ? (
                            historicoPatrimonios.map((p, index) => {
                                const config = getStatusConfig(p.revisaoNumero);

                                return (
                                    <li key={index} className='historico-item' style={{ borderLeft: `6px solid ${config.color}` }}>
                                        <div style={{
                                            backgroundColor: config.bg,
                                            color: config.color,
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            display: 'inline-block',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            marginBottom: '10px'
                                        }}>
                                            {config.label}
                                        </div>

                                        <div className='historico-detalhe'>
                                            <strong>Nome: </strong>{p.name} <br />
                                            <strong>Marca: </strong>{p.marca} <br />
                                            <strong>Etiqueta: </strong>{p.etiqueta} <br />
                                            <strong>Setor: </strong>{p.setor} <br />
                                            <strong>Status: </strong>{p.status} <br />
                                            <strong>Valor: </strong>{formatarMoeda(p.valor)} <br />
                                            <small style={{ color: '#666' }}>
                                                Data: {new Date(p.dataRevisao).toLocaleString('pt-BR')}
                                            </small>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <p className="not-found">Nenhuma movimentação encontrada para "{busca}"</p>
                        )}
                    </ul>

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
                </div>
            </main>
        </div>
    );
};

export default Historico;