import React, { useEffect, useState} from 'react';
import "./Historico.css";
import Sidebar from '../../components/DashboardComponents/Sidebar/Sidebar';
import Header from '../../components/DashboardComponents/Header/Header';
import api from '../../services/api';
import { RefreshCw } from 'lucide-react';

const Historico = () => {
    const [historicoPatrimonios, setHistoricoPatrimonios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [busca, setBusca] = useState("");
    
    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };
    
    const carregarHistorico = (pagina = 0) => {
    setLoading(true);
    // Usando params do Axios para ficar mais limpo
    api.get(`/patrimonios/historico-geral`, {
        params: {
            page: pagina,
            size: 10,
            busca: busca || undefined // Envia a busca se houver algo digitado
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

    useEffect(() => {
    const timeout = setTimeout(() => {
        carregarHistorico(0);
    }, 300); // 300ms é um tempo seguro
    return () => clearTimeout(timeout);
}, [busca]);

    useEffect(() => {
        if (!loading) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [loading]);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <main className="main-content">
                <Header />
                <div className='titulo-secao'>
                    <h1>Histórico de movimentações</h1>
                    <button 
                        className={`btn-atualizar ${loading ? 'girando' : ''}`} 
                        onClick={carregarHistorico}
                        disabled={loading}
                    >
                        <RefreshCw size={20} />
                        {loading ? 'Atualizando...' : 'Atualizar'}
                    </button>
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
                
                <div className='historico-conteudo'>
                    <ul className='historico-lista'>
                        {historicoPatrimonios.map((p, index) => {
                            // 2. Chame a config AQUI DENTRO para cada item 'p'
                            // Use o nome do campo que você criou no DTO (provavelmente tipoAcao ou status)
                            const config = getStatusConfig(p.revisaoNumero); 

                            return (
                                <li key={index} className='historico-item' style={{ borderLeft: `6px solid ${config.color}` }}>
                                    {/* 3. Badge estilizado com os dados da config */}
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
                                        {/* <strong>Id: </strong>{p.idPatrimonio} <br />*/}
                                        <strong>Nome: </strong>{p.name} <br />
                                        <strong>Marca: </strong>{p.marca} <br />
                                        <strong>Etiqueta: </strong>{p.etiqueta} <br />
                                        <strong>Setor: </strong>{p.setor} <br />
                                        <strong>Status: </strong>{p.status} <br />
                                        <strong>Valor: </strong>{formatarMoeda(p.valor)} <br />
                                        {/* 4. Dica: mostre a data também! */}
                                        <small style={{color: '#666'}}>Editado: {new Date(p.dataRevisao).toLocaleString()}</small>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="paginacao">

                        <button className='paginacao-btn' disabled={page === 0}
                        onClick={() => carregarHistorico(page - 1)}>
                            Anterior
                        </button>

                        <span className='paginacao-texto'>Página {page + 1} de {totalPages}</span>

                        <button className='paginacao-btn' disabled={page + 1 >= totalPages}
                        onClick={() => carregarHistorico(page + 1)}>
                            Próxima
                        </button>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Historico;