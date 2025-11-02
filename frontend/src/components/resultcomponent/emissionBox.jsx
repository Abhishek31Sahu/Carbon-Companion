import React, { PureComponent } from "react";
import "../byDist-TravelEmission/dis.css";

import { Car, Fuel, Route, Leaf, AlertTriangle } from "lucide-react";
import { Box } from "@mui/material";

export function Intro({ text }) {
  return (
    <div className="distance-traveled heading ">
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
        className="  leaf-design"
      >
        <Leaf />
      </div>
      <div className="distance-traveled-value ">
        <div style={{ display: "flex", fontWeight: 600, fontSize: "18px" }}>
          Carbon Footprint
        </div>
        <div style={{ opacity: 0.5, fontSize: 12 }}>{text}</div>
      </div>
    </div>
  );
}

export function EmissionBox({ emission }) {
  const boxStyles = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    color: "red",
    m: 0,
  };

  return (
    <Box
      sx={{
        border: "1px solid red",
        p: 2,
        backgroundColor: "#f7dcdcff",
        borderRadius: "8px",
        color: "red",
        // marginBottom: "16px",
        // textAlign: "center",
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        minWidth: "350px",
      }}
    >
      <Box sx={boxStyles}>
        <span>{<AlertTriangle />}</span>CO₂ Emissions
      </Box>
      <div className="co2-emissions">
        <strong>{emission.co2e_kg}</strong>
      </div>
      kg CO₂ equivalent
      <br />({emission.co2e_gm})grams
    </Box>
  );
}

export function InputData({ quantity, unit, emission }) {
  return (
    <div className="distance-traveled space">
      <div className="distance-traveled">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            opacity: 0.5,
          }}
          className="margin-adjust symbol"
        >
          {<Route />}
        </div>

        <div className="distance-traveled-value margin-adjust">
          <div style={{ display: "flex", fontWeight: 600, fontSize: "15px" }}>
            {quantity}&nbsp;
            {unit}
          </div>
          <div style={{ opacity: 0.5, fontSize: 12 }}>
            {unit === "km" || unit === "m"
              ? "Distance traveled"
              : unit === "kwh"
              ? "Energy consumed"
              : ""}
          </div>
        </div>
      </div>
      <div className=" margin-adjust design">
        {(emission.co2e_gm / quantity).toFixed(2)}
        {unit === "km" ? "g/km" : unit === "kwh" ? "g/kWh" : ""}
      </div>
    </div>
  );
}

export function Provider({}) {
  return (
    <div className="distance-traveled">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          opacity: 0.5,
        }}
        className="margin-adjust symbol"
      >
        {<Car />}
      </div>

      <div className="distance-traveled-value margin-adjust">
        <div style={{ display: "flex", fontWeight: 600, fontSize: "15px" }}>
          {/* {hasDistanceData.vehicle_type}&nbsp; */}
          Small
        </div>
        <div style={{ opacity: 0.5, fontSize: 12 }}>vehicle type</div>
      </div>
    </div>
  );
}

export function Resource({ fuel_type }) {
  return (
    <div className="distance-traveled">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          opacity: 0.5,
        }}
        className="margin-adjust symbol"
      >
        {<Fuel />}
      </div>

      <div className="distance-traveled-value margin-adjust">
        <div style={{ display: "flex", fontWeight: 600, fontSize: "15px" }}>
          {fuel_type}&nbsp;
        </div>
        <div style={{ opacity: 0.5, fontSize: 12 }}>fuel type</div>
      </div>
    </div>
  );
}

export function EnvironmentalContext({ treesNeeded }) {
  return (
    <div className="Environmental-Context size">
      <div className="distance-traveled">
        <Leaf className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">
          Environmental Context
        </span>
      </div>
      <div className="text-sm text-green-700">
        To offset this trip, you would need approximately{" "}
        <strong>
          {treesNeeded} tree{treesNeeded !== 1 ? "s" : ""}
        </strong>{" "}
        <br />
        for one year of carbon absorption.
      </div>
    </div>
  );
}
