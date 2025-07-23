import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

interface BarChartProps {
  data: BarChartData;
  title: string;
  onExportImage?: () => void;
  onExportCSV?: () => void;
  showExportButtons?: boolean;
  customTooltip?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  onExportImage,
  onExportCSV,
  showExportButtons = true,
  customTooltip = true
}) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: customTooltip ? {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (tooltipItems) => {
            return `${tooltipItems[0].label}`;
          },
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const percentage = data.datasets[0].data.length > 0 
              ? ((value / data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
              : '0';
            return `${label}: ${value} avistamientos (${percentage}%)`;
          },
        },
      } : undefined,
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11,
          },
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  const handleExportImage = () => {
    if (chartRef.current && onExportImage) {
      const chart = chartRef.current;
      const url = chart.toBase64Image('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_chart.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onExportImage();
    }
  };

  const handleExportCSV = () => {
    if (onExportCSV) {
      // Generar CSV
      const csvData = [
        ['Categoría', 'Avistamientos'],
        ...data.labels.map((label, index) => [
          label,
          data.datasets[0].data[index].toString()
        ])
      ];
      
      const csvContent = csvData
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_data.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onExportCSV();
    }
  };

  const hasData = data.labels.length > 0 && data.datasets[0]?.data.some(value => value > 0);

  if (!hasData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500 font-medium">No hay datos disponibles</p>
            <p className="text-gray-400 text-sm mt-1">
              No se encontraron avistamientos para los filtros seleccionados
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {showExportButtons && (
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            title="Exportar datos como CSV"
          >
            📊 CSV
          </button>
          <button
            onClick={handleExportImage}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            title="Exportar gráfico como PNG"
          >
            📷 PNG
          </button>
        </div>
      )}
      
      <div className="relative h-64 md:h-80">
        <Bar
          ref={chartRef}
          data={data}
          options={options}
        />
      </div>
    </div>
  );
};

export default BarChart;
