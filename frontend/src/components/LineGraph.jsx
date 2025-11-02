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

function LineGraph({ data }) {
  // try {
  console.log("great", data);
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
        label: "Electricity Emissions (kg)",
        data: labels.map(
          (date) => data?.[0]?.find((d) => d.date === date)?.co2e || 0
        ),
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66, 165, 245, 0.3)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Travel Emissions (kg)",
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
  // } catch (err) {
  //   console.error("Error fetching emissions:", err);
  // }

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
    scales: {
      x: {
        grid: {
          display: false, // ❌ No grid lines on X-axis
          drawBorder: false,
        },
        ticks: {
          color: "#555",
          font: { size: 12 },
        },
      },
      y: {
        grid: {
          display: false, // ❌ No grid lines on Y-axis
          drawBorder: false,
        },
        ticks: {
          color: "#555",
          font: { size: 12 },
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
        // border: "4px solid #4CAF50",
        // borderRadius: "20px",
        // boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
      }}
    >
      <h2 className="text-xl font-semibold mb-4"></h2>
      {/* {chartData ? ( */}
      <Line
        data={chartData}
        options={options}
        style={{ minHeight: "250px", minWidth: "450px" }}
      />
      {/* ) : (
        <p>Loading chart...</p>
      )} */}
    </Box>
  );
}

export default LineGraph;
