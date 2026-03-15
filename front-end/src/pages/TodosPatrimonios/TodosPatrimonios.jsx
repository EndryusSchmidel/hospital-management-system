import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/DashboardComponents/Sidebar/Sidebar';
import Header from '../../components/DashboardComponents/Header/Header';
import "./TodosPatrimonios.css";
import api from '../../services/api';
import { RefreshCw } from 'lucide-react';

const TodosPatrimonios = ({ statusFiltro, tituloPagina}) => {
    // Estados principais
    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };
    const [patrimonios, setPatrimonios] = useState([]); // Lista que vem do banco
    const [busca, setBusca] = useState(""); // O que o usuário digita
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


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
                nome: busca || undefined
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
            });

    };

    // 3. Carrega ao montar o componente
    useEffect(() => {
        carregarDados(page);
    }, [page, statusFiltro]);

    useEffect(() => {
    const timeout = setTimeout(() => {
        carregarDados(0);
    }, 100);

    return () => clearTimeout(timeout);
}, [busca]);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <Header />
                
                <div className='titulo-secao'>
                    <h1>{tituloPagina || "Todos os patrimônios"}</h1>
                    
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
                        
                        <button 
                            className={`btn-atualizar ${loading ? 'girando' : ''}`} 
                            onClick={carregarDados}
                            disabled={loading}
                        >
                            <RefreshCw size={20} />
                            {loading ? 'Carregando...' : 'Atualizar'}
                        </button>
                    </div>
                </div>

                <div className='patrimonios-container'>
                    <ul className="patrimonios-lista">
                        {patrimonios.length > 0 ? (
                            [...patrimonios].reverse().map((p, index) => {
                                const classeStatus = getClasseStatus(p.status);
                                
                                return (
                                    <li key={p.idPatrimonio || index} className={`patrimonio-item status-${classeStatus}`}>
                                        <div className="patrimonio-detalhe">
                                            {/* Badge colorida igual ao histórico */}
                                            <span className={`badge-status badge-${classeStatus}`}>
                                                {p.status || 'Não definido'}
                                            </span>
                                            
                                            <br />
                                            <strong>Nome: </strong>
                                            <span className='dado-destaque'>{p.name}</span> <br />
                                            <strong>Marca: </strong>
                                            <span className='dado-destaque'>{p.marca}</span> <br />
                                            <strong>Etiqueta: </strong>
                                            <span className='dado-destaque'>{p.etiqueta}</span> <br />
                                            <strong>Setor: </strong>
                                            <span className='dado-destaque'>{p.setor}</span> <br />
                                            <strong>Valor: </strong>
                                            <span className='dado-destaque'>{formatarMoeda(p.valor)}</span> <br />
                                            {/* <strong>Valor: </strong>R$ {p.valor} <br /> */}
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <p className="not-found">Nenhum patrimônio encontrado para "{busca}"</p>
                        )}
                    </ul>
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
                </div>
            </main>
        </div>
    );
}

export default TodosPatrimonios;