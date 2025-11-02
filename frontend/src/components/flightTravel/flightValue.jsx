import {
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
// import { Box } from "lucide-react";
import { Tooltip, Box, FormControl, Typography } from "@mui/material";
function FlightValue({ onSumbit }) {
  const [form, setForm] = useState({
    iata_from: "",
    iata_to: "",
    flight_class: "Economy",
    round_trip: "Y",
    add_rf: "Y",
    include_wtt: "Y",
    passengers: 1,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form.iata_from);
    const data = {
      iata_from: form.iata_from,
      iata_to: form.iata_to,
      flight_class: form.flight_class,
      round_trip: form.round_trip,
      add_rf: form.add_rf,
      include_wtt: form.include_wtt,
      passengers: form.passengers,
    };
    console.log(data);
    onSumbit(data);
  };

  const flightClassOptions = ["Economy", "Premium", "Business", "First"];

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        textAlign: "center",
        height: "100%",
        width: "40%",
        position: "relative",
        // border: "4px solid #4CAF50",
        borderRadius: "20px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
      }}
    >
      <Typography variant="h4" sx={{ margin: 1, marginBottom: 3 }}>
        <span style={{ fontSize: "30px" }}>🧮</span>
        Travel Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 400 }}>
          <TextField
            label="IATA From"
            value={form.iata_from}
            onChange={(e) => handleChange("iata_from", e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"> 🛫</InputAdornment>
              ),
            }}
          />
          <br />
          <TextField
            label="IATA To"
            value={form.iata_to}
            onChange={(e) => handleChange("iata_to", e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"> 🛬</InputAdornment>
              ),
            }}
          />
          <br />

          <Autocomplete
            options={flightClassOptions}
            value={form.flight_class}
            onChange={(e, val) => handleChange("flight_class", val)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Flight Class"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start" sx={{ marginRight: 0 }}>
                      🪑
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <br />
          <TextField
            label="Number of Passengers"
            type="number"
            value={form.passengers}
            onChange={(e) => handleChange("passengers", e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"> 👤</InputAdornment>
              ),
            }}
          />
        </FormControl>
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.round_trip === "Y"}
              onChange={(e) =>
                handleChange("round_trip", e.target.checked ? "Y" : "N")
              }
            />
          }
          label="Round Trip"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.add_rf === "Y"}
              onChange={(e) =>
                handleChange("add_rf", e.target.checked ? "Y" : "N")
              }
            />
          }
          label="Add RF"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.include_wtt === "Y"}
              onChange={(e) =>
                handleChange("include_wtt", e.target.checked ? "Y" : "N")
              }
            />
          }
          label="Include WTTT"
        />
        <h6>include_wttt means Adds fuel production chain emissions </h6>
        <h6>Add RF means Adds high-altitude indirect climate effects</h6>
        <br />

        <br />
        <Button type="submit" variant="contained" color="primary">
          Calculate Emissions
        </Button>
      </form>
    </Box>
  );
}

export default FlightValue;
