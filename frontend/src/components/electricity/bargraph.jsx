import { Line } from "react-chartjs-2";
import { Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function EmissionLineGraph({ data }) {
  // console.log("EmissionLineGraph data:", data[0].detail);
  // console.log("EmissionLineGraph data:", data[0].detail?.provider);
  const chartData = {
    labels: data.map((e) =>
      new Date(e.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "CO₂ Emissions (kg)",
        data: data.map((e) => e.co2e),
        borderColor: "#1E88E5",
        backgroundColor: "rgba(66, 165, 245, 0.3)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const entry = data[context.dataIndex];
            const detail = entry.detail;

            const provider = detail?.provider?.value || "Unknown Source";
            const region = detail?.region?.value || "Unknown Region";

            return [
              `Date: ${new Date(entry.date).toLocaleDateString()}`,
              `CO₂: ${entry.co2e} ${entry.co2e_unit}`,
              `Energy: ${entry.energy_kwh} kWh`,
              `Source: ${provider}`,
              `Region: ${region}`,
            ];
          },
        },
      },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        textAlign: "center",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <h2>CO₂ Emissions Chart</h2>
      <Line data={chartData} options={options} />
    </Box>
  );
}

export default EmissionLineGraph;
