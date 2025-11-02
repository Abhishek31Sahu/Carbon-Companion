import React, { useState } from "react";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import GetDataSet from "../../dataset/emission";
// import ShinyBarChartHorizontal from "../../graphBoth";
import {
  Button,
  TextField,
  FormControl,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Typography,
  List,
  ListItem,
  Divider,
  LinearProgress,
  Chip,
  Paper,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
const getUnitColor = (type) => {
  return type === "weight" ? "success" : "info";
};
const unit = ["g", "kg", "ml", "l"];

const RecipeChecklist = ({ recipeData }) => {
  const navigate = useNavigate();
  const { recipe, totalWeight } = recipeData;
  const [recipeIng, setRecipeIng] = useState(recipe);
  const [checkedState, setCheckedState] = useState(
    new Array(recipeIng.length).fill(true)
  );

  const allChecked = checkedState.every(Boolean);
  const someChecked = checkedState.some(Boolean);
  const checkedCount = checkedState.filter(Boolean).length;
  const progress = (checkedCount / recipeIng.length) * 100;

  const handleParentToggle = () => {
    const newState = new Array(recipeIng.length).fill(!allChecked);
    setCheckedState(newState);
  };

  const handleChildToggle = (index) => {
    const newState = [...checkedState];
    newState[index] = !newState[index];
    setCheckedState(newState);
  };

  const [addIng, setAddIng] = useState("");
  const [addIngWt, setAddIngWt] = useState("");
  const [addUnit, setAddUnit] = useState("");
  const [emissionData, setEmissionData] = useState(null);
  const handleSumbit = (e) => {
    e.preventDefault();
    const wt = parseFloat(addIngWt);
    let valid = false;
    recipeIng.forEach((IngInfo) => {
      valid =
        IngInfo.name === addIng
          ? IngInfo.quantity === wt
            ? console.warn("Already Exist")
            : true
          : true;
    });
    if (valid) {
      let copy = [...recipeIng];

      const data = {
        name: addIng,
        quantity: wt,
        unit: addUnit,
        unit_type: addUnit === "ml" || addUnit === "l" ? "volume" : "weight",
      };
      copy.push(data);
      console.log(copy);
      setRecipeIng(copy);
      setAddIng("");
      setAddIngWt("");
      // setAddUnit("");/
      copy = [...checkedState];
      copy.push(true);
      setCheckedState(copy);
    }
  };

  const wtUpdate = (idx, val) => {
    let copy = [...recipeIng];
    copy[idx].quantity = val;
    setRecipeIng(copy);
  };

  const handleEmission = async (e) => {
    let selectedIng = [];
    let selectedWt = 0;
    for (let i = 0; i < checkedState.length; i++) {
      if (checkedState[i]) {
        selectedIng.push(recipeIng[i]);
        // const wt = parseFloat(addIngWt);
        selectedWt += parseFloat(recipeIng[i].quantity);
      }
    }
    // console.log(selectedIng);
    const data = { recipe: selectedIng, totalWeight: selectedWt };
    // console.log(data);
    const emission = await axios.post("/api/ingredients/emission", data, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    console.log("Estimated Emission:", emission.data);

    const getDataSetGraph = GetDataSet({ data: emission.data.results });
    setEmissionData(getDataSetGraph);
    console.log("Graph Data:", getDataSetGraph);
    navigate("/food/emission", { state: { dataset: getDataSetGraph } });
  };

  return (
    <div style={{ backgroundColor: " #FFFDF5 ", padding: "20px" }}>
      {/* <Paper
        elevation={4}
        sx={{ maxWidth: 1000, margin: "auto", padding: 4, borderRadius: 3 }}
      > */}

      <Paper
        elevation={4}
        sx={{
          maxWidth: 700,
          margin: "auto",
          padding: 4,
          borderRadius: 3,
          backgroundColor: "",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          🧪 Recipe Checklist
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Total Weight: <strong>{totalWeight}g</strong>
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5, marginBottom: 2 }}
        />
        {/* Parent Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={allChecked}
              indeterminate={!allChecked && someChecked}
              onChange={handleParentToggle}
              sx={{ transform: "scale(1.2)" }}
            />
          }
          label={
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Select All Ingredients
            </Typography>
          }
        />

        {/* Child Checkboxes */}
        <List sx={{ paddingLeft: 2 }}>
          {recipeIng.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingY: 1,
                borderBottom: "1px solid #eee",
                "&:hover": { backgroundColor: "#f9f9f9" },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    color={getUnitColor(item.unit_type)}
                    checked={checkedState[index]}
                    onChange={() => handleChildToggle(index)}
                    sx={{ transform: "scale(1.1)" }}
                  />
                }
                label={
                  <div>
                    <Typography variant="body1">
                      <div>
                        {item.name}
                        <TextField
                          value={item.quantity}
                          type="number"
                          required
                          // label=
                          onChange={(e) => {
                            wtUpdate(index, e.target.value);
                          }}
                          size="small"
                          sx={{
                            width: 70,
                            marginLeft: 3,
                            "& .MuiInputBase-input": {
                              padding: "6px 10px",
                              fontSize: 14,
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: 13,
                            },
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                sx={{ padding: 0, margin: -1 }}
                              >
                                {item.unit}
                              </InputAdornment>
                            ),
                          }}
                        />
                        {/* <TextField
                        value={item.unit}
                        type="text"
                        required
                        sx={{
                          width: 30,
                          marginLeft: 1,
                          marginTop: 0.7,
                          "& .MuiInputBase-input": {
                            padding: "1px 1px 1px 5px",
                            fontSize: 14,
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: 13,
                          },
                        }}
                      /> */}
                        {/* {item.unit} */}
                      </div>
                    </Typography>
                  </div>
                }
              />
              <Chip
                label={item.unit_type}
                color={getUnitColor(item.unit_type)}
                size="small"
                sx={{ marginLeft: 2 }}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ marginTop: 3 }} />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ marginTop: 1 }}
        >
          {checkedCount} of {recipeIng.length} ingredients selected
        </Typography>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        onClick={handleEmission}
        sx={{ margin: 5 }}
      >
        Check Emission
      </Button>

      <Paper
        elevation={4}
        sx={{ maxWidth: 300, margin: "auto", padding: 4, borderRadius: 3 }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          🧪 Add Ingredient in Checklist
        </Typography>
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 100 }}>
          <TextField
            type="text"
            value={addIng}
            required
            label="Ingredient"
            onChange={(e) => {
              setAddIng(e.target.value);
            }}
          />
          {/* &nbsp;&nbsp;&nbsp; */}
          {/* <br /> */}
          <TextField
            type="number"
            required
            label="Quantity"
            value={addIngWt}
            onChange={(e) => {
              setAddIngWt(e.target.value);
            }}
          />
          <Autocomplete
            options={unit}
            onChange={(e, val) => {
              setAddUnit(val);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Unit" variant="outlined" />
            )}
          />

          <Button variant="contained" color="primary" onClick={handleSumbit}>
            Add New Ingredient
          </Button>
        </FormControl>
        <br />
        <br />
      </Paper>
    </div>
  );
};

export default RecipeChecklist;
