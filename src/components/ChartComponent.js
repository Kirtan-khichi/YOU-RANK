import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, Title, CategoryScale, LinearScale, PointElement, LineElement, LineController, Legend } from "chart.js";
import "./chartStyle.css";

Chart.register(Title, CategoryScale, LinearScale, PointElement, LineElement, LineController, Legend);

function ChartComponent({ chartData }) {
  if (!chartData || !Array.isArray(chartData)) {
    return <div>Loading chart data...</div>;
  }

  const allLabels = chartData.reduce((acc, current) => [...acc, ...current.labels], []);
  const uniqueLabels = [...new Set(allLabels)]; // Remove duplicates using Set

  const datasets = chartData.map((data, index) => ({
    label: data.datasets[0].label,
    data: data.datasets[0].data,
    fill: data.datasets[0].fill,
    borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`, // Generate random color for each line
  }));

  const data = {
    labels: uniqueLabels, // Use the unique labels for clarity
    datasets: datasets,
  };

  // Configure Chart.js options
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Number of Students over Time", // Title for the chart
      },
      legend: {
        display: true, // Enable the legend
        position: "right", // Display the legend on the right side
      },
    },
    scales: {
      x: {
        type: "category", // Use 'category' scale for x-axis
        title: {
          display: true,
          text: "Year", // Label for x-axis
        },
        // Use the unique labels for the x-axis ticks
        ticks: {
          labels: uniqueLabels,
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Students", // Label for y-axis
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
}

export default ChartComponent;
