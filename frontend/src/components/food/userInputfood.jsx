import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function FoodTypeInput({ onFoodTypeChange }) {
  const [foodType, setFoodType] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [foodUnit, setFoodUnit] = useState("kg");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFoodTypeChange(foodType, foodQuantity, foodUnit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Select Food Type</h3>
      <p>Choose a food type to view emissions data.</p>
      <TextField
        type="text"
        value={foodType}
        label="Food Type"
        onChange={(e) => setFoodType(e.target.value)}
      />
      <TextField
        type="number"
        value={foodQuantity}
        label="Food Quantity"
        onChange={(e) => setFoodQuantity(e.target.value)}
      />
      <Select
        value={foodUnit}
        label="Food Unit"
        onChange={(e) => setFoodUnit(e.target.value)}
      >
        <MenuItem value="kg">kg</MenuItem>
        <MenuItem value="g">g</MenuItem>
        <MenuItem value="lbs">lbs</MenuItem>
      </Select>
      <br />
      <br />
      <Button type="submit" variant="contained" color="primary">
        Update
      </Button>
    </form>
  );
}

export default FoodTypeInput;
