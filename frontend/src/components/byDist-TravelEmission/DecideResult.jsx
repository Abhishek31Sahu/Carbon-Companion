import React from "react";
import { useEmissionStore } from "../../emissionStore";
import AnalysisBox from "./analysisBox";
import CarbonReport from "./resultBox";
import { Box } from "@mui/material";

function DecideResult({ id }) {
  console.log("DecideResult ID:", id);
  const emission = useEmissionStore((state) => state.emission);
  const hasDistanceData = emission?.[id];
  console.log("Has Distance Data:", hasDistanceData);

  const boxStyles = {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    boxShadow: 3,
    p: 4,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  };

  return (
    <Box sx={boxStyles}>
      {hasDistanceData ? (
        <CarbonReport hasDistanceData={hasDistanceData} />
      ) : (
        <AnalysisBox />
      )}
    </Box>
  );
}

export default DecideResult;
