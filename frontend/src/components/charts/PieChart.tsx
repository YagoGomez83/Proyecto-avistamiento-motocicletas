import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

interface PieChartProps {
  data: PieChartData;
  title: string;
  onExportImage?: () => void;
  onExportCSV?: () => void;
  showExportButtons?: boolean;
  customTooltip?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  title, 
  onExportImage,
  onExportCSV,
  showExportButtons = true,
  customTooltip = true
}) => {
  const chartRef = useRef<ChartJS<'pie'>>(null);

  // Colores predefinidos para el gráfico - palette más suave
  const defaultColors = [
    '#60A5FA', // blue-400
    '#F87171', // red-400
    '#34D399', // emerald-400
    '#FBBF24', // amber-400
    '#A78BFA', // violet-400
    '#22D3EE', // cyan-400
    '#F472B6', // pink-400
    '#A3E635', // lime-400
    '#FB923C', // orange-400
    '#818CF8', // indigo-400
  ];

  // Asegurar que tengamos suficientes colores
  const extendedColors = [...defaultColors];
  while (extendedColors.length < data.labels.length) {
    extendedColors.push(...defaultColors);
  }

  const processedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || extendedColors.slice(0, data.labels.length),
      borderColor: dataset.borderColor || ['#ffffff'],
      borderWidth: dataset.borderWidth || 3,
    }))
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
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
          bottom: 20,
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
            const label = context.label || '';
            const value = context.parsed;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} avistamientos (${percentage}%)`;
          },
        },
      } : undefined,
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
        <Pie
          ref={chartRef}
          data={processedData}
          options={options}
        />
      </div>
    </div>
  );
};

export default PieChart;
