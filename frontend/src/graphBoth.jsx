import HorizontalBarChart from "./graph";
import { Button } from "@mui/material";
function GraphBoth({ dataset }) {
  const handleflexDirection = () => {
    const container = document.querySelector('div[style*="display: flex"]');
    if (container) {
      container.style.flexDirection =
        container.style.flexDirection === "row" ? "column" : "row";
    }
  };
  return (
    <div
      className="App"
      style={{ padding: "20px", width: `${window.innerWidth}px` }}
    >
      <h1 style={{ textAlign: "center" }}>
        Food Carbon Footprint: Linear vs. Logarithmic Comparison
      </h1>

      <p
        style={{
          textAlign: "center",
          maxWidth: "1250px",
          margin: "10px auto 30px",
          fontSize: "1.1em",
        }}
      >
        Use the **Linear Scale** (Left) to see the true, overwhelming magnitude
        of the highest impact foods. Use the **Logarithmic Scale** (Right) to
        easily compare and read the values of the low-impact foods.
      </p>
      <Button onClick={handleflexDirection}>Toggle Flex Direction</Button>
      {/* Container for side-by-side display */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          gap: "20px",
        }}
      >
        {/* 1. Linear Scale Chart: True Magnitude */}
        <HorizontalBarChart dataset={dataset} scaleType="linear" />

        {/* 2. Logarithmic Scale Chart: Visibility of Small Values */}
        <HorizontalBarChart dataset={dataset} scaleType="logarithmic" />
      </div>
    </div>
  );
}

export default GraphBoth;
