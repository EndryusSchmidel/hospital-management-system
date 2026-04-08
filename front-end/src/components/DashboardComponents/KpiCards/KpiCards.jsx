import "./KpiCards.css";
import "../../../styles/GlobalStyles.css"
import { Package, CheckCircle2, XCircle, DollarSign } from "lucide-react"; // Ícones Premium

const Kpicards = ({ dados }) => {
    if (!dados) return null;

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    return (
        // Removemos a caixa cinza em volta, deixamos apenas o grid flutuante
        <section className="kpi-grid">
            
            {/* Card 1: Total */}
            <div className="kpi-card shadow-md">
                <div className="kpi-content">
                    <p>Total de patrimônios</p>
                    <h2>{dados.total}</h2>
                </div>
                <div className="kpi-icon-wrapper total-icon">
                    <Package size={28} />
                </div>
            </div>

            {/* Card 2: Ativos */}
            <div className="kpi-card shadow-md">
                <div className="kpi-content">
                    <p>Patrimônios Ativos</p>
                    <h2>{dados.ativos}</h2>
                </div>
                <div className="kpi-icon-wrapper ativos-icon">
                    <CheckCircle2 size={28} />
                </div>
            </div>

            {/* Card 3: Inativos */}
            <div className="kpi-card shadow-md">
                <div className="kpi-content">
                    <p>Patrimônios Inativos</p>
                    <h2>{dados.inativos}</h2>
                </div>
                <div className="kpi-icon-wrapper inativos-icon">
                    <XCircle size={28} />
                </div>
            </div>

            {/* Card 4: Valor */}
            <div className="kpi-card shadow-md">
                <div className="kpi-content">
                    <p>Valor Total</p>
                    <h2>{formatarMoeda(dados.valorTotal)}</h2>
                </div>
                <div className="kpi-icon-wrapper valor-icon">
                    <DollarSign size={28} />
                </div>
            </div>

        </section>
    );
};

export default Kpicards;