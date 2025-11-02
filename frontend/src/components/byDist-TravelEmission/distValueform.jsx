import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
// import EcoIcon from "@mui/icons-material/Eco";
import TopHeading from "./heading";
import "./dis.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Button from "@mui/material/Button";
import { useState } from "react";

import { Tooltip, Box, FormControl, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CarbonReport from "./resultBox";
import VehicleTYpe from "./vehicleType";
import Footer from "./footer";
import Autocomplete from "@mui/material/Autocomplete";
import DecideResult from "./DecideResult";
// petrol and diesel

function TravelEmissionByDistance({ onSubmit }) {
  const [fuelType, setFuelType] = useState("Petrol");

  const showWeightFieldFor = [
    "freight_vehicle-vehicle_type_hgv_rigid-fuel_source_cng-vehicle_weight_gt_20t_lt_26t-distance_uplift_included",

    "freight_vehicle-vehicle_type_hgv_rigid-fuel_source_cng-vehicle_weight_gt_12t_lt_20t-distance_uplift_included",
  ];

  const fuelOptions = ["Petrol", "Diesel", "CNG", "BioCNG"];

  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [vehicleType, setVehicleType] = useState("");
  const [passElg, setPassElg] = useState(false);
  const [passenger, setPassenger] = useState(1);
  const [weight, setWeight] = useState();
  const [weight_unit, setWeight_Unit] = useState("kg");
  const [flag, setFlag] = useState(false);
  const [id, setId] = useState("/api/travel-emission/distances");
  const handleSubmit = (e) => {
    e.preventDefault();
    const convertDitance =
      distanceUnit === "miles" ? distance * 1.60934 : distance;
    onSubmit({
      distance: convertDitance,
      fuelType,
      vehicleType:
        typeof vehicleType === "object" ? vehicleType.key : vehicleType,
      passenger,
      weight: weight || 0,
      weight_unit,
    });
    // CarbonReport("Abhishek");
    setFlag(true);
  };

  return (
    <div className="main">
      <TopHeading />
      <div className="flex-col">
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: 4,
            boxShadow: 3,
            border: "1px solid #d0e8d0",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            p: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ margin: 1, marginBottom: 3 }}>
            <span style={{ fontSize: "30px" }}>🧮</span>
            Travel Details
          </Typography>

          {/* <p>Enter your travel details to calculate CO₂ emissions.</p> */}
          <form onSubmit={handleSubmit}>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 400 }}>
              <Autocomplete
                options={fuelOptions}
                value={fuelType}
                onChange={(event, value) => {
                  setFuelType(value);
                  setVehicleType("");
                  if (value === "CNG" || value === "BioCNG") {
                    setPassElg(true);
                  } else {
                    setPassElg(false);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fuel Type"
                    variant="outlined"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          // sx={{ marginRight: 0 }}
                        >
                          ⛽
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                sx={{
                  minWidth: 235,
                  backgroundColor: "#ffffff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  "& .MuiInputLabel-root": {
                    color: "#388e3c",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a5d6a7",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#66bb6a",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#388e3c",
                  },
                }}
              />
            </FormControl>
            <br></br>
            <FormControl
              variant="outlined"
              sx={{ m: 1, minWidth: 400 }}
              required
            >
              <Autocomplete
                options={VehicleTYpe(fuelType)}
                getOptionLabel={(option) =>
                  (fuelType === "CNG" || fuelType === "BioCNG") && option?.value
                    ? option.value
                    : option
                }
                value={vehicleType}
                onChange={(event, value) => {
                  setVehicleType(value);

                  if (
                    value?.value === "Rigid-Truck-wt_20-26" ||
                    value?.value === "Rigid-Truck-wt_12-20"
                  ) {
                    setPassElg(false);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Vehicle Type"
                    variant="outlined"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ marginRight: 0 }}
                        >
                          🚗
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                sx={{
                  minWidth: 235,
                  backgroundColor: "#ffffff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  "& .MuiInputLabel-root": {
                    color: "#388e3c",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a5d6a7",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#66bb6a",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#388e3c",
                  },
                }}
              />
            </FormControl>
            <br />
            <br />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <TextField
                type="number"
                label="Distance"
                variant="outlined"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
                sx={{
                  minWidth: 200,
                  backgroundColor: "#ffffff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  "& .MuiInputLabel-root": {
                    color: "#388e3c", // deep green
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a5d6a7",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#66bb6a",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#388e3c",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"> 🌍</InputAdornment>
                  ),
                }}
              />
              <Autocomplete
                options={["km", "miles"]}
                value={distanceUnit}
                onChange={(event, value) => setDistanceUnit(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="distance_unit"
                    variant="outlined"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ marginRight: 0 }}
                        >
                          📏
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                sx={{
                  backgroundColor: "#ffffff",
                  width: 90,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  "& .MuiInputLabel-root": {
                    color: "#388e3c",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a5d6a7",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#66bb6a",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#388e3c",
                  },
                }}
              />
              <Tooltip title="Distance affects your carbon footprint. Longer trips = more emissions.">
                <InfoOutlinedIcon
                  sx={{ color: "#388e3c", cursor: "pointer" }}
                />
              </Tooltip>
            </Box>
            <br />
            <br />

            {passElg && (
              <TextField
                type="number"
                label="Passenger"
                variant="outlined"
                value={passenger}
                onChange={(e) => setPassenger(e.target.value)}
                required
                sx={{
                  minWidth: 400,
                  backgroundColor: "#ffffff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  "& .MuiInputLabel-root": {
                    color: "#388e3c", // deep green
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a5d6a7",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#66bb6a",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#388e3c",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"> 👤</InputAdornment>
                  ),
                }}
              />
            )}

            <br />

            {showWeightFieldFor.includes(
              typeof vehicleType === "object" ? vehicleType.key : vehicleType
            ) && (
              <TextField
                type="number"
                label="Weight"
                variant="outlined"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                sx={{
                  minWidth: 400,
                  backgroundColor: "#ffffff",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                  "& .MuiInputLabel-root": {
                    color: "#388e3c", // deep green
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#a5d6a7",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#66bb6a",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#388e3c",
                  },
                  marginTop: 2,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),

                  startAdornment: (
                    <InputAdornment position="start"> ⚖️</InputAdornment>
                  ),
                }}
              />
            )}
            <br />
            <br />

            <Button variant="contained" type="submit" className="btn">
              Calculate Emissions
            </Button>
          </form>
        </Box>
        {/* <Container maxWidth="sm" sx={{ width: 500 }}> */}

        <DecideResult id={id} />
      </div>
      {/* Footer */}

      <Footer />
    </div>
  );
}
export default TravelEmissionByDistance;

// rfce
