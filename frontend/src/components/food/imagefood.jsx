import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";

import RecipeChecklist from "./checkBoxList";
import { FullscreenControl } from "mapbox-gl";

const ImageFood = () => {
  const [ingredientObj, setIngredientObj] = useState({});
  const [eligible, setElgible] = useState(false);

  const [image, setImage] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    // Here you would typically send the formData to your backend API
    // For example:
    const response = await axios.post("/api/ingredients", formData);
    const data = response.data;
    setIngredientObj(data);
    console.log("Ingredients:", data);
    setElgible(true);
    // const emission = await axios.post("/api/ingredients/emission", data);
    // console.log("Estimated Emission:", emission.data);
  };

  return (
    <div
      style={{
        backgroundColor: " #FFFDF5 ",
        padding: "20px",
      }}
    >
      <h1>Food Image Upload</h1>
      <TextField
        type="file"
        accept="image/*"
        required
        onChange={(e) => {
          setImage(e.target.files[0]);
        }}
      />
      <br />
      <br />
      <br />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload Image
      </Button>
      <br />
      <br />
      <br />
      {/* ✅ Conditional rendering using && */}
      {eligible && <RecipeChecklist recipeData={ingredientObj} />}

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default ImageFood;
