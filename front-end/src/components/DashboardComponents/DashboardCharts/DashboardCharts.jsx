import React, { useState, useEffect } from "react";
import "./DashboardCharts.css";
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
    const [chartColors, setChartColors] = useState({
        bgCard: '#ffffff',
        textMain: '#111827',
        textMuted: '#6b7280',
        borderColor: '#e5e7eb'
    });

    const updateThemeColors = () => {
        const rootStyle = getComputedStyle(document.documentElement);
        setChartColors({
            bgCard: rootStyle.getPropertyValue('--bg-card').trim() || '#ffffff',
            textMain: rootStyle.getPropertyValue('--text-main').trim() || '#111827',
            textMuted: rootStyle.getPropertyValue('--text-muted').trim() || '#6b7280',
            borderColor: rootStyle.getPropertyValue('--border-color').trim() || '#e5e7eb'
        });
    };

    useEffect(() => {
        // Primeira leitura ao carregar a tela
        updateThemeColors();

        const observer = new MutationObserver(() => {
            // 🚀 TRUQUE: Espera 10 milissegundos para o navegador aplicar o CSS do Dark Mode 
            // antes de tentarmos ler as variáveis com o getComputedStyle
            setTimeout(() => {
                updateThemeColors();
            }, 10);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

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
            backgroundColor: "#0ea5e9",
            borderRadius: 6,
            barThickness: 40,
        }]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: chartColors.bgCard,
                titleColor: chartColors.textMain,
                bodyColor: chartColors.textMain,
                borderColor: chartColors.borderColor,
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: { 
                    // 🚀 MUDANÇA AQUI: Usando textMain para ficar Branco no Dark e Preto no Light
                    color: chartColors.textMain, 
                    font: { weight: '700' }
                }
            },
            y: {
                grid: { 
                    color: chartColors.borderColor, 
                    drawBorder: false 
                },
                border: { display: false },
                ticks: { 
                    // 🚀 MUDANÇA AQUI: Usando textMain também nos números
                    color: chartColors.textMain, 
                    font: { weight: '700' }
                }
            }
        }
    };

    const contagemAtivos = data.filter(p => p.status === 'ativo').length;
    const contagemInativos = data.filter(p => p.status === 'inativo').length;
    const contagemManutencao = data.filter(p => p.status === 'manutencao').length;

    const donutData = {
        labels: ["Ativos", "Inativos", "Manutenção"],
        datasets: [{
            data: [contagemAtivos, contagemInativos, contagemManutencao],
            backgroundColor: ["#10b981", "#ef4444", "#f59e0b"], 
            borderWidth: 6, 
            borderColor: chartColors.bgCard, 
            hoverOffset: 10
        }],
    };

    const donutOptions = {
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
            legend: { 
                position: 'bottom', 
                labels: { 
                    usePointStyle: true, 
                    boxWidth: 8,
                    padding: 20,
                    color: chartColors.textMain, 
                    font: { size: 13, weight: '600' }
                } 
            }
        }
    };

    return (
        <section className="charts-grid">
            <div className="chart-card">
                <h3>Distribuição por Setor</h3>
                <div className="chart-wrapper">
                    <Bar key={`bar-${chartColors.bgCard}`} data={barData} options={barOptions} />
                </div>
            </div>

            <div className="chart-card">
                <h3>Status do Inventário</h3>
                <div className="chart-wrapper">
                    <Doughnut key={`donut-${chartColors.bgCard}`} data={donutData} options={donutOptions} />
                </div>
            </div>
        </section>
    );
};

export default DashboardCharts;