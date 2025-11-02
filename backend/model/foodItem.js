import mongoose from "mongoose";

const fooditem = new mongoose.Schema({
  fooditem: { type: String, required: true },
  quantity:{ type: Number, required: true },
  quantity_unit:{ type: String, required: true },
  co2e: { type: Number, required: true },
  co2e_unit: { type: String, required: true },
  date: { type: Date, default: Date.now },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const FoodItem = mongoose.model("FoodItem", fooditem);
export default FoodItem;
