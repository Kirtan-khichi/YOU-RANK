import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';

const ChartComponent = ({ csvData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const processData = (csvData) => {
      // Parse CSV data using PapaParse
      const { data } = Papa.parse(csvData, { header: true });

      // Extract labels and data from CSV
      const chartLabels = data.map(row => row.label); // Assuming 'label' column contains x-axis labels
      const chartData = data.map(row => parseInt(row.value, 10)); // Assuming 'value' column contains numeric data

      return {
        labels: chartLabels,
        datasets: [
          {
            label: 'Data',
            data: chartData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
          },
        ],
      };
    };

    if (chartRef.current && csvData) {
      const chartData = processData(csvData);
      // Update the chart data
      chartRef.current.chartInstance.data = chartData;
      // Redraw the chart
      chartRef.current.chartInstance.update();
    }
  }, [csvData]);

  return (
    <div>
      {csvData ? (
        <Line ref={chartRef} />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default ChartComponent;
