import "./PatrimonioModal.css";
import React, { useEffect, useState } from 'react';
import api from "../../../services/api";
import { toast } from 'react-toastify';


const PatrimonioModal = ({ data, isOpen, onClose, onPatrimonioSalvo }) => {
    // Estado inicial do formulário (vazio)
    const [formData, setFormData] = useState({
        name: '',
        marca: '',
        etiqueta: '',
        setor: '',
        status: 'ativo',
        valor: ''
    });

    useEffect(() => {
        if(data) setFormData(data);
    }, [data])

    if (!isOpen) return null;

    // Função que atualiza o estado conforme o usuário digita
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            let response;
            
            if (formData.idPatrimonio) {
                response = await api.put(`/patrimonios/${formData.idPatrimonio}`, formData);
            } else {
                response = await api.post(`/patrimonios`, formData);
            }

            // Sucesso!
            if (response.status === 201 || response.status === 200) {
                if (onPatrimonioSalvo) onPatrimonioSalvo();
                onClose();
                // Reset completo
                setFormData({ name: '', marca: '', etiqueta: '', setor: '', status: 'ativo', valor: '' });
            }

        } catch (error) {
            console.error("DEBUG Backend Error: ", error.response); // Útil para você olhar no F12

            // Captura a mensagem exata que o Spring Boot enviou
            let mensagemBackend = "Erro ao conectar com o servidor.";

            if (error.response && error.response.data) {
                // Verifica se o Spring enviou como { message: "Etiqueta duplicada" }
                if (error.response.data.message) {
                    mensagemBackend = error.response.data.message;
                } 
                // Verifica se o Spring enviou apenas a string direta "Etiqueta duplicada"
                else if (typeof error.response.data === 'string') {
                    mensagemBackend = error.response.data;
                }
            }

            // Exibe o erro focado e real
            toast.error(mensagemBackend);
            
            // NOTA: Não chamamos onClose() aqui. 
            // O modal continua aberto com os dados preenchidos para o usuário corrigir a etiqueta e tentar salvar de novo.
        }
    };

    return (
        <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
            <h3>{formData.idPatrimonio ? "Editar Patrimônio" : "Cadastrar Novo Patrimônio"}</h3>
            <button className="close-btn" onClick={onClose}>
                &times;
            </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Nome do Equipamento</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Monitor Cardíaco" required />
            </div>

            <div className="form-group-row">
                <div className="form-group">
                <label>Marca</label>
                <input type="text" name="marca" value={formData.marca} onChange={handleChange} placeholder="Ex: Philips" required />
                </div>
                <div className="form-group">
                <label>Nº Etiqueta</label>
                <input type="text" name="etiqueta"  value={formData.etiqueta} onChange={handleChange} placeholder="Ex: 124-ABC" />
                </div>
            </div>
            <div className="form-group">
                <label>Valor do patrimônio (R$)</label>
                <input 
                    type="number"
                    name="valor" 
                    required
                    placeholder="Ex: 1500.00"
                    value={formData.valor}
                    onChange={handleChange}
                    step="0.01"
                    />
            </div>

            <div className="form-group">
                <label>Setor Destinado</label>
                <select name="setor" value={formData.setor} onChange={handleChange} required>
                <option value="">Selecione o setor...</option>
                <option value="centro_cirurgico">Centro Cirúrgico</option>
                <option value="cti">CTI</option>
                <option value="sala_amarela">Sala Amarela</option>
                <option value="sala_vermelha">Sala Vermelha</option>
                </select>
                <label>Status do Patrimônio</label>
            <select 
                name="status" 
                value={formData.status} // O estado que controla seu formulário
                onChange={handleChange}  // Sua função de atualizar o estado
                className="form-select"
            >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="manutencao">Em Manutenção</option>
            </select>
            </div>
            {/* Exemplo de como deve ficar no seu formulário de edição */}
            

            <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
                </button>
                <button type="submit" className="btn-save">
                Salvar Patrimônio
                </button>
            </div>
            </form>
        </div>
        </div>
    );
};

export default PatrimonioModal;
