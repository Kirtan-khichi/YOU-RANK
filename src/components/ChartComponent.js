import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, Title, CategoryScale, LinearScale, PointElement, LineElement, LineController, Legend } from "chart.js";
import "./chartStyle.css";

Chart.register(Title, CategoryScale, LinearScale, PointElement, LineElement, LineController, Legend);

function ChartComponent({ chartData }) {
  if (!chartData || !Array.isArray(chartData)) {
    return <div>Loading chart data...</div>;
  }

  // Extracting unique labels from the first dataset
  const uniqueLabels = chartData[0]?.labels || [];
  
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
  // Configure Chart.js options
// Configure Chart.js options
const options = {
  plugins: {
    title: {
      display: true,
      text: "Collge rank over years", // Title for the chart
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
        text: "Ranking", // Label for y-axis
      },
      // Configure y-axis ticks to display integer values only
      ticks: {
        stepSize: 1, // Set step size to 1 to display integer values
        precision: 0, // Set precision to 0 to remove decimal points
        beginAtZero: false, // Start y-axis from the next integer value greater than 0
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
