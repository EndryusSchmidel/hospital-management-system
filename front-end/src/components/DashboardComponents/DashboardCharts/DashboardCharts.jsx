import "./DashboardCharts.css"
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

ChartJS.register(
    CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend
);

const DashboardCharts = ({ data }) => {
    // 1. DADOS DINÂMICOS PARA O GRÁFICO DE BARRA
    const setoresConfig = [
        { id: "cti", label: "CTI" },
        { id: "sala_vermelha", label: "S. Vermelha" },
        { id: "sala_amarela", label: "S. Amarela" },
        { id: "centro_cirurgico", label: "C. Cirúrgico" }
    ];

    const barData = {
        labels: setoresConfig.map(s => s.label),
        datasets: [{
            label: "Patrimônios",
            data: setoresConfig.map(s => data.filter(p => p.setor === s.id).length),
            backgroundColor: "#0ea5e9", // Azul SaaS
            borderRadius: 6, // Arredonda o topo das barras
            barThickness: 40, // Deixa as barras mais finas e elegantes
        }]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                grid: { display: false }, // Remove as linhas verticais do fundo
                border: { display: false } // Remove a linha dura do eixo X
            },
            y: {
                grid: { 
                    color: '#f3f4f652', // Linhas horizontais ultra finas e claras
                    drawBorder: false,
                },
                border: { display: false }
            }
        }
    };

    // 2. DADOS DINÂMICOS PARA O GRÁFICO DE ROSCA
    const contagemAtivos = data.filter(p => p.status === 'ativo').length;
    const contagemInativos = data.filter(p => p.status === 'inativo').length;
    const contagemManutencao = data.filter(p => p.status === 'manutencao').length;

    const donutData = {
        labels: ["Ativos", "Inativos", "Manutenção"],
        datasets: [{
            data: [contagemAtivos, contagemInativos, contagemManutencao],
            backgroundColor: ["#10b981", "#ef4444", "#f59e0b"], // Verde, Vermelho, Laranja/Amarelo SaaS
            borderWidth: 4, // Espaço entre as fatias
            borderColor: '#ffffff', // A cor do fundo da página para o efeito de recorte
            hoverOffset: 10
        }],
    };

    const donutOptions = {
        maintainAspectRatio: false,
        cutout: '75%', // Deixa a 'rosca' mais fina
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }
        }
    };

    return (
        <section className="charts-grid">
            <div className="chart-card">
                <h3>Distribuição por Setor</h3>
                <div className="chart-wrapper">
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>

            <div className="chart-card">
                <h3>Status do Inventário</h3>
                <div className="chart-wrapper">
                    <Doughnut data={donutData} options={donutOptions} />
                </div>
            </div>
        </section>
    );
};

export default DashboardCharts;