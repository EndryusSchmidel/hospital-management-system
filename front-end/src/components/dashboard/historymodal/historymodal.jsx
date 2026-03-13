import React, { useEffect, useState} from 'react';
import axios from 'axios';
import "../patrimoniomodal/patrimoniomodal.css";


const HistoryModal = ({ idPatrimonio, onClose}) => {
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        if (idPatrimonio) {
            axios.get(`http://localhost:8080/patrimonios/${idPatrimonio}/historico`)
                .then(response => setHistorico(response.data))
                .catch(err => console.error("Erro ao buscar histórico", err));
        }
    }, [idPatrimonio]);

    return (
        <div className="modal-overlay">
            <div className="modal-content history-modal">
                <div className="modal-header">
                    <h3>Histórico de Alterações</h3>
                    <button onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <ul className="history-list">
                        {historico.map((rev, index) => (
                            <li key={index} className="history-item">
                                <span className="rev-badge">Revisão número: {rev.revisaoNumero}</span>
                                <div className="history-details">
                                    <strong>Status:</strong> {rev.status} | 
                                    <strong> Setor:</strong> {rev.setor} | 
                                    <strong> Valor:</strong> R$ {rev.valor}
                                    <p className="history-date">Alterado em: {new Date(rev.dataRevisao).toLocaleString('pt-BR')}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;