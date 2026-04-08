import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import "./HistoryModal.css";

const HistoryModal = ({ idPatrimonio, onClose }) => {
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        if (idPatrimonio) {
            api.get(`/patrimonios/${idPatrimonio}/historico`)
                .then(response => setHistorico(response.data))
                .catch(err => console.error("Erro ao buscar histórico", err));
        }
    }, [idPatrimonio]);

    const formatarTexto = (str) => {
    if (!str) return "";
    return str
        .replace(/_/g, ' ') // Troca underline por espaço
        .replace(/\b\w/g, (l) => l.toUpperCase()); // Primeira letra de cada palavra em Maiúsculo
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content history-modal-container">
                <div className="history-header">
                    <div className="header-title">
                        <i className="fas fa-history"></i>
                        <h3>Histórico de Alterações</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {historico.length > 0 ? (
                        <div className="timeline">
                            {historico.map((rev, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-header">
                                            <span className="rev-number">Rev. #{rev.revisaoNumero}</span>
                                            <span className="rev-date">
                                                {new Date(rev.dataRevisao).toLocaleString('pt-BR', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <div className="timeline-details">
                                            <div className="detail-tag">
                                                <strong>Status:</strong> <span>{formatarTexto(rev.status)}</span>
                                            </div>
                                            <div className="detail-tag">
                                                <strong f>Setor:</strong> <span>{formatarTexto(rev.setor)}</span>
                                            </div>
                                            <div className="detail-tag highlight">
                                                <strong>Valor:</strong> <span>R$ {rev.valor}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">Nenhuma alteração encontrada para este item.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;