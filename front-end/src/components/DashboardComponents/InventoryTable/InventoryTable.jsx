import React, { useState } from "react";
import { History, Search, ChevronDown, Edit2, Trash2, PackageOpen, MapPin, Tag, Activity } from 'lucide-react'; 

import "./InventoryTable.css";

const InventoryTable = ({ data, onEdit, onDelete, onVerHistorico }) => {
    const [busca, setBusca] = useState("");
    // 🚀 Estado para controlar qual card está aberto (Accordion)
    const [expandedCard, setExpandedCard] = useState(null);

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

    // Função para definir a classe CSS da borda lateral
    const getStatusClass = (status) => {
        const s = status ? status.toLowerCase() : "";
        if (s === "ativo") return "ativo";
        if (s === "em manutenção" || s === "manutencao") return "manutencao";
        if (s === "inativo") return "inativo";
        return "default";
    };

    const formatarTexto = (str) => {
        if (!str) return "";
        return str
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Função de Toggle do Accordion
    const toggleCard = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
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
                                    Pesquisar por Nome, Marca, Etiqueta, Setor...
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

            {/* 🚀 NOVA ESTRUTURA: Lista de Cards Expansíveis */}
            <div className="inventory-list">
                {dadosFiltrados.slice().reverse().slice(0, 5).map((p) => {
                    const isExpanded = expandedCard === p.idPatrimonio;
                    const statusClass = getStatusClass(p.status);

                    return (
                        <div 
                            key={p.idPatrimonio} 
                            className={`inventory-card status-${statusClass} ${isExpanded ? 'expanded' : ''}`}
                            onClick={() => toggleCard(p.idPatrimonio)}
                        >
                            {/* PARTE SEMPRE VISÍVEL (Retraído) */}
                            <div className="card-visible-header">
                                <div className="card-main-info" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span className="card-title">{p.name}</span>
                                    
                                    {/* 🚀 Etiqueta com Ícone alinhado */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Tag size={14} /> 
                                        <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{p.etiqueta}</span>
                                    </div>
                                </div>
                                <div className="card-indicator">
                                    <ChevronDown className="chevron-icon" size={20} />
                                </div>
                            </div>

                            {/* PARTE EXPANSÍVEL (Oculta por padrão) */}
                            <div className="card-expandable-wrapper">
                                <div className="card-expandable-content">
                                    <div className="card-expandable-inner">
                                        
                                        {/* 🚀 Detalhes Ocultos com Ícones (Sem labels de texto) */}
                                        <div className="card-details-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                            
                                            <div className="detail-item" title="Marca" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                                <PackageOpen size={16} /> 
                                                <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{p.marca}</span>
                                            </div>
                                            
                                            <div className="detail-item" title="Setor" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                                <MapPin size={16} /> 
                                                <span className="tag-setor">{formatarTexto(p.setor)}</span>
                                            </div>
                                            
                                            <div className="detail-item" title="Status" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                                <Activity size={16} /> 
                                                <span className={`status-text color-${statusClass}`}>
                                                    {formatarTexto(p.status || "Ativo")}
                                                </span>
                                            </div>
                                            
                                        </div>

                                        {/* Botões de Ação */}
                                        <div className="card-action-group">
                                            <button 
                                                className="btn-action btn-history" 
                                                onClick={(e) => { e.stopPropagation(); onVerHistorico(p.idPatrimonio); }}
                                            >
                                                <History size={16} /> Histórico
                                            </button>
                                            <button 
                                                className="btn-action btn-edit" 
                                                onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                                            >
                                                <Edit2 size={16} /> Editar
                                            </button>
                                            {onDelete && (
                                                <button 
                                                    className="btn-action btn-delete" 
                                                    onClick={(e) => { e.stopPropagation(); onDelete(p.idPatrimonio); }}
                                                >
                                                    <Trash2 size={16} /> Excluir
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {dadosFiltrados.length === 0 && (
                <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                    Nenhum resultado encontrado.
                </p>
            )}
        </section>
    );
};

export default InventoryTable;