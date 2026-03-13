import "./dashboardcharts.css"
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


// Registrar as ferramentas do gráfico
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);



const donutData = {
    labels: ["Ativos", "Inativos", "Manutenção"],
    datasets: [
        {
            data: [10, 10, 5],
            backgroundColor: ["#0076a8", "#8a0000", "#ffd900"], // Verde água e Vermelho
            borderWidth: 0,
        },
    ],
};

const DashboardCharts = ({ data }) => {
    const setoresConfig = [
        { id: "cti", label: "CTI - Terapia Intensiva"},
        { id: "sala_vermelha", label: "Sala Vermelha"},
        { id: "sala_amarela", label: "Sala Amarela"},
        { id: "centro_cirurgico", label: "Centro Cirúrgico"}
    ];

    const labelsExibicao = setoresConfig.map(s => s.label);

    const contagemPorSetor = setoresConfig.map(setor => {
        return data.filter(p => p.setor === setor.id).length;
    });

    const barData = {
        labels: labelsExibicao,
        datasets: [
            {
                label: "Quantidade",
                data: contagemPorSetor,
                backgroundColor: "#0076a8",
                borderRadius: 5,
            }
        ]
    }

    const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite que o gráfico respeite o tamanho da div
    plugins: {
      legend: { display: false }, // Esconde a legenda igual na imagem
    },
};

    return (
        <section className="charts-grid">
                <div className="chart-card">
                    <h3>Distribuição por Setor</h3>
                    <div style={{ flex: 1 }}>
                    <Bar data={barData} options={barOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Status do Inventário</h3>
                    <div style={{ flex: 1 }}>
                    <Doughnut
                        data={donutData}
                        options={{ maintainAspectRatio: false }}
                    />
                    </div>
                </div>
                </section>
    );
};

export default DashboardCharts;