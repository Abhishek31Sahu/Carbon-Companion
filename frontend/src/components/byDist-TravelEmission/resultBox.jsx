import { Box } from "@mui/material";
import React, { useState } from "react";
import { Car, Fuel, Route, Leaf, AlertTriangle } from "lucide-react";
import { m } from "framer-motion";
import {
  EmissionBox,
  EnvironmentalContext,
  Intro,
  InputData,
  Provider,
  Resource,
} from "../resultcomponent/emissionBox";

import "./dis.css";
function CarbonReport({ hasDistanceData }) {
  const treesNeeded = Math.ceil(hasDistanceData.co2e_kg / 22); // Rough estimate: 1 tree absorbs ~22kg CO2/year
  const impactLevel =
    hasDistanceData.co2e_kg < 10
      ? "low"
      : hasDistanceData.co2e_kg < 25
      ? "medium"
      : "high";

  return (
    <div>
      <Box>
        <Intro text="Trip Environmental Impact" />
        <EmissionBox emission={hasDistanceData} />
        <div>
          <InputData
            quantity={hasDistanceData.distance_value}
            unit={hasDistanceData.distance_unit}
            emission={hasDistanceData}
          />

          <Provider />
          <Resource fuel_type={hasDistanceData.fuel_type} />
        </div>
        <EnvironmentalContext treesNeeded={treesNeeded} />
      </Box>
    </div>
  );
}

export default CarbonReport;
