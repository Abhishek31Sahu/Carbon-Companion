import {
  FormControl,
  Autocomplete,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";

function FuelType({ onSumbit }) {
  const [fuelType, setFuelType] = useState("Petrol");
  const fuelOptions = ["Petrol", "Diesel", "CNG", "BioCNG"];
  const handleChange = (event, value) => {
    setFuelType(value);
    onSumbit({ value });
  };

  return (
    <FormControl variant="outlined" sx={{ m: 1, minWidth: 400 }}>
      <Autocomplete
        options={fuelOptions}
        value={fuelType}
        onChange={handleChange}
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
  );
}

export default FuelType;
