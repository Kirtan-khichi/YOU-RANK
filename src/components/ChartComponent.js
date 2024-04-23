import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, Title, CategoryScale, LinearScale, PointElement, LineElement, LineController, Legend, Tooltip } from "chart.js";
import "./chartStyle.css";

Chart.register(Title, CategoryScale, LinearScale, PointElement, LineElement, LineController, Legend, Tooltip);

function ChartComponent({ chartData }) {
  if (!chartData || !Array.isArray(chartData)) {
    return <div>Loading chart data...</div>;
  }

  // Extracting unique labels from the first dataset
  const uniqueLabels = chartData[0]?.labels || [];
  
  const datasets = chartData.map((data, index) => {
    // Preprocess the data to break the line when encountering a 0 value
    const preprocessedData = data.datasets[0].data.map(val => val === 0 ? null : val);

    return {
      label: data.datasets[0].label,
      data: preprocessedData,
      fill: data.datasets[0].fill,
      borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`, // Generate random color for each line
    };
  });

  const data = {
    labels: uniqueLabels, // Use the unique labels for clarity
    datasets: datasets,
  };

  // Configure Chart.js options
  const options = {
    plugins: {
      title: {
        display: true,
        text: "College rank over years", // Title for the chart
      },
      legend: {
        display: false, // Disable the legend
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
        reverse: true,
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
