import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DoughnutChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

interface DoughnutChartProps {
  data: DoughnutChartData;
  title: string;
  onExportImage?: () => void;
  onExportCSV?: () => void;
  showExportButtons?: boolean;
  customTooltip?: boolean;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ 
  data, 
  title, 
  onExportImage,
  onExportCSV,
  showExportButtons = true,
  customTooltip = true
}) => {
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  // Colores predefinidos para el gráfico
  const defaultColors = [
    '#3B82F6', // blue-500
    '#EF4444', // red-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#8B5CF6', // violet-500
    '#06B6D4', // cyan-500
    '#EC4899', // pink-500
    '#84CC16', // lime-500
    '#F97316', // orange-500
    '#6366F1', // indigo-500
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
      borderColor: dataset.borderColor || extendedColors.slice(0, data.labels.length),
      borderWidth: dataset.borderWidth || 2,
    }))
  };

  const options: ChartOptions<'doughnut'> = {
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
    cutout: '60%', // Esto hace el "hueco" del doughnut
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
        <Doughnut
          ref={chartRef}
          data={processedData}
          options={options}
        />
      </div>
    </div>
  );
};

export default DoughnutChart;
