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

function TransportLineGraph({ data }) {
  const labels = Array.from(
    new Set([
      ...(data?.[0]?.map((d) => d.date) || []),
      ...(data?.[1]?.map((d) => d.date) || []),
    ])
  ).sort((a, b) => new Date(a) - new Date(b));

  const chartData = {
    labels: labels.map((d) =>
      new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Road Travel Emissions (kg)",
        data: labels.map(
          (date) => data?.[0]?.find((d) => d.date === date)?.co2e || 0
        ),
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66, 165, 245, 0.3)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Air Travel Emissions (kg)",
        data: labels.map(
          (date) => data?.[1]?.find((d) => d.date === date)?.co2e || 0
        ),
        borderColor: "#FF7043",
        backgroundColor: "rgba(255, 112, 67, 0.3)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
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
      {/* <h2 className="text-xl font-semibold mb-4">
        CO₂ Emissions Comparison Chart
      </h2> */}
      {/* {chartData ? ( */}
      <Line
        data={chartData}
        options={options}
        style={{ minHeight: "250px", minWidth: "350px" }}
      />
      {/* ) : (
        <p>Loading chart...</p>
      )} */}
    </Box>
  );
}

export default TransportLineGraph;
