import { useState } from "react";
import { History, Search } from 'lucide-react'; // Ícones modernos
import "./InventoryTable.css";

const InventoryTable = ({ data, onEdit, onDelete, onVerHistorico}) => {
    const [busca, setBusca] = useState("");

    // Mesma lógica de filtro inteligente que usamos na outra página
    const dadosFiltrados = data.filter((item) => {
        const termo = busca.toLowerCase();
        return (
            (item.name && item.name.toLowerCase().includes(termo)) ||
            (item.marca && item.marca.toLowerCase().includes(termo)) ||
            (item.etiqueta && item.etiqueta.toLowerCase().includes(termo)) ||
            (item.setor && item.setor.toLowerCase().includes(termo)) ||
            (item.status && item.status.toLowerCase().includes(termo))
        );
    });

    // Função para definir a cor do texto do status na tabela
    const getStatusColor = (status) => {
        const s = status ? status.toLowerCase() : "";
        if (s === "ativo") return "#2e7d32"; // Verde
        if (s === "em manutenção" || s === "manutencao") return "#f57f17"; // Amarelo/Laranja
        if (s === "inativo") return "#c62828"; // Vermelho
        return "#666";
    };

    return (
        <section className="inventory-section">
            <div className="inventory-header">
                <h3>Últimos Patrimônios Cadastrados</h3>
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
                </div>
            </div>

            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Marca</th>
                        <th>Etiqueta</th>
                        <th>Setor</th>
                        <th>Status</th>
                        <th style={{ paddingLeft: '20px'}}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Pegamos os filtrados, invertemos para ver os últimos e limitamos a 5 */}
                    {dadosFiltrados.slice().reverse().slice(0, 5).map((p) => (
                        <tr key={p.idPatrimonio}>
                            <td className="patrimonio-destaque">{p.name}</td>
                            <td className="patrimonio-destaque">{p.marca}</td>
                            <td className="col-etiqueta">
                                <span className="tag-patrimonio tag-etiqueta">{p.etiqueta}</span>
                            </td>
                            <td className="col-setor" >
                                <span className="tag-patrimonio tag-setor">{p.setor}</span>
                            </td>
                            <td>
                                <strong style={{ color: getStatusColor(p.status), 
                                textTransform: "capitalize"
                                }}>
                                    {p.status || "Ativo"}
                                </strong>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button className="btn-acoes-revisao" onClick={() => onVerHistorico(p.idPatrimonio)} title="Ver Histórico">
                                        <i className="fa-solid fa-clock-rotate-left"></i>
                                    </button>
                                    <button className="btn-edit" title="Editar" onClick={() => onEdit(p)}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button className="btn-delete" title="Excluir" onClick={() => onDelete(p.idPatrimonio)}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {dadosFiltrados.length === 0 && (
                <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Nenhum resultado encontrado.</p>
            )}
        </section>
    );
};

export default InventoryTable;