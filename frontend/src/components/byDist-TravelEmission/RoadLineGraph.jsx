import { Line } from "react-chartjs-2";
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
import { Box } from "@mui/material";

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

function RoadLineGraph({ data }) {
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
        label: "CO₂ Emissions in Travel(kg)",
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
            const detail = entry.aboutVehicle;

            const vehicle = detail?.type || "Unknown Vehicle";
            const fuel_Type = detail?.fuel || "Unknown Fuel Type";

            return [
              `Date: ${new Date(entry.date).toLocaleDateString()}`,
              `CO₂: ${entry.co2e} ${entry.co2e_unit}`,
              `Distance: ${entry.distance} ${entry.distance_unit}`,
              `Vehicle: ${vehicle}`,
              `Fuel_Type: ${fuel_Type}`,
            ];
          },
        },
      },
      title: {
        display: true,
        text: "CO₂ Emission Trends (Electricity vs Travel)",
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

export default RoadLineGraph;
