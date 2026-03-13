import "./KpiCards.css"

const Kpicards = ({ dados }) => {
    if (!dados) return null;

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    return (
        <div className="kpi-container-bg">
                <section className="kpi-grid">
                    {/* Card 1: p Total / Azul escuro */}
                    <div className="kpi-card total">
                    <div className="kpi-content">
                        <h2>{dados.total}</h2>
                        <p>Total de patrimônios</p>
                    </div>
                    <i className="fa-solid fa-chart-simple"></i>
                    </div>

                    {/* Card 2: P Ativos / Azul ciano */}
                    <div className="kpi-card ativos">
                    <div className="kpi-content">
                        <h2>{dados.ativos}</h2>
                        <p>Patrimônios Ativos</p>
                    </div>
                    <i className="fa-solid fa-check"></i>
                    </div>

                    {/* Card 3: P Inativos / vermelho*/}
                    <div className="kpi-card inativos">
                    <div className="kpi-content">
                        <h2>{dados.inativos}</h2>
                        <p>Patrimônios Inativos</p>
                    </div>
                    <i className="fa-solid fa-xmark"></i>
                    </div>

                    {/* Card 4: p Valor / verde */}
                    <div className="kpi-card valor-total">
                    <div className="kpi-content">
                        <h2>{formatarMoeda(dados.valorTotal)}</h2>
                        <p>Valor total de Patrimônios</p>
                    </div>
                    <i className="fa-solid fa-money-bill-wave"></i>
                    </div>
                </section>
                </div>
    );
};

export default Kpicards;