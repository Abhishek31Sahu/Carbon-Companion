import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Paper,
} from "@mui/material";

const emissionFactors = {
  car: {
    petrol: 0.192,
    diesel: 0.213,
    cng: 0.166,
    electric: 0.12,
  },
  bus: {
    diesel: 0.105,
    cng: 0.089,
    electric: 0.07,
  },
  motorcycle: {
    petrol: 0.075,
  },
  auto_rickshaw: {
    cng: 0.065,
  },
  train: {
    diesel: 0.04,
    electric: 0.015,
  },
  metro: {
    electric: 0.012,
  },
  flight: {
    domestic: 0.16,
    international: 0.11,
  },
};

export default function CarbonCalculator() {
  const [mode, setMode] = useState("car");
  const [fuel, setFuel] = useState("petrol");
  const [distance, setDistance] = useState(100);
  const [passengers, setPassengers] = useState(1);
  const [result, setResult] = useState("");

  const handleCalculate = () => {
    const factor = emissionFactors[mode]?.[fuel];
    if (factor) {
      const emissions = factor * distance * passengers;
      setResult(`${emissions.toFixed(2)} kg CO₂e`);
    } else {
      setResult("Invalid combination of transport mode and fuel type.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          🌱 India Travel Carbon Emissions Calculator
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Transport Mode</InputLabel>
          <Select value={mode} onChange={(e) => setMode(e.target.value)}>
            {Object.keys(emissionFactors).map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Fuel Type</InputLabel>
          <Select value={fuel} onChange={(e) => setFuel(e.target.value)}>
            {Object.keys(emissionFactors[mode]).map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Distance (km)"
          type="number"
          fullWidth
          margin="normal"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />

        <TextField
          label="Passengers"
          type="number"
          fullWidth
          margin="normal"
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
        />

        <Box textAlign="center" mt={2}>
          <Button variant="contained" onClick={handleCalculate}>
            Calculate
          </Button>
        </Box>

        {result && (
          <Typography variant="h6" mt={3} textAlign="center">
            Estimated Emissions: {result}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

//"activity_id": "passenger_vehicle-vehicle_type_bus_line-fuel_source_cng-distance_na-engine_size_na",
// "activity_id": "passenger_vehicle-vehicle_type_small_car-fuel_source_cng-distance_na-engine_size_na",
// "activity_id": "passenger_vehicle-vehicle_type_large_car-fuel_source_cng-distance_na-engine_size_na",
// "activity_id": "passenger_vehicle-vehicle_type_small_car-fuel_source_bio_cng-distance_na-engine_size_na",
// "activity_id": "passenger_vehicle-vehicle_type_medium_car-fuel_source_bio_cng-distance_na-engine_size_na",
// "activity_id": "passenger_vehicle-vehicle_type_large_car-fuel_source_bio_cng-distance_na-engine_size_na",
// "activity_id": "freight_vehicle-vehicle_type_hgv_rigid-fuel_source_cng-vehicle_weight_gt_20t_lt_26t-distance_uplift_included",
// "activity_id": "freight_vehicle-vehicle_type_hgv_rigid-fuel_source_cng-vehicle_weight_gt_12t_lt_20t-distance_uplift_included",
// "activity_id": "passenger_vehicle-vehicle_type_car-fuel_source_bev-engine_size_lt_1350cc-vehicle_age_post_2020-vehicle_weight_na",
