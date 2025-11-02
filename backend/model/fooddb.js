import mongoose from "mongoose";
import FoodItem from "./foodItem.js";
const fooddb = new mongoose.Schema({
  fooditemsList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },
  ],
  co2e: { type: Number, required: true },
  co2e_unit: { type: String, required: true },
  date: { type: Date, default: Date.now },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
});

const FoodEmi = mongoose.model("FoodEmi", fooddb);
export default FoodEmi;
