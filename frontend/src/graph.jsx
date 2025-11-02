// src/components/HorizontalBarChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register all necessary components and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

// ACCEPT 'scaleType' PROP
export default function HorizontalBarChart({ dataset, scaleType }) {
  const labels = dataset.map((d) => d.producer);
  const dataValues = dataset.map((d) => d.quantity);

  let max = -Infinity;
  for (let i = 0; i < dataValues.length; i++) {
    max = Math.max(max, dataValues[i]);
  }

  const MAX_QUANTITY = max;
  const HIGHLIGHT_COLOR = "#ff4500"; // Orange-Red for the highest impact
  const TOP_TIER_COLOR = "#d32f2f"; // Darker Red for medium-high tier
  const DEFAULT_COLOR = scaleType === "logarithmic" ? "#4db6ac" : "#a6a6a6"; // Greenish for log, Grey for linear small values

  const backgroundColors = dataValues.map((value) => {
    if (value === MAX_QUANTITY) return HIGHLIGHT_COLOR;
    if (value > 3) return TOP_TIER_COLOR;
    return DEFAULT_COLOR;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "CO₂e (kg)",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderRadius: 5,
        barPercentage: 0.9,
        categoryPercentage: 0.8,
      },
    ],
  };

  // Define scale-specific options
  const xScales =
    scaleType === "logarithmic"
      ? {
          type: "logarithmic",
          min: 0.01,
          max: max * 1.5,
          ticks: {
            callback: (value) => {
              // Display only major ticks for logarithmic scale
              if (value >= 1) return value;
              if (value === 0.1 || value === 0.01) return value;
              return null;
            },
            font: { size: 10 },
          },
          title: {
            display: true,
            text: "Quantity (kg CO₂e) - Logarithmic Scale (Visibility of Small Values)",
            font: { size: 14, weight: "bold" },
          },
        }
      : {
          type: "linear",
          min: 0,
          max: max * 1.1,
          ticks: {
            callback: (value) => `${value}`,
            font: { size: 10 },
          },
          title: {
            display: true,
            text: "Quantity (kg CO₂e) - Linear Scale (True Magnitude)",
            font: { size: 14, weight: "bold" },
          },
        };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Food Carbon Footprint Comparison (${
          scaleType === "logarithmic" ? "Logarithmic" : "Linear"
        } View)`,
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `Impact: ${context.raw.toFixed(2)} kg CO₂e`,
        },
      },
      datalabels: {
        align: "end",
        anchor: "end",
        offset: 5,
        color: "#444444",
        font: {
          weight: "bold",
          size: 9,
        },
        formatter: (value) => value.toFixed(2),
        // Display labels for all bars in log scale, but only large bars in linear scale
        display: (context) =>
          scaleType === "logarithmic" ||
          context.dataset.data[context.dataIndex] > 1,
      },
    },

    scales: {
      x: xScales,
      y: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "99%",
        height: "650px",
        padding: "10px",
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Bar data={data} options={options} />
    </div>
  );
}
