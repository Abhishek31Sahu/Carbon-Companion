import mongoose from "mongoose";

const emissionSchema = new mongoose.Schema({
  energy_kwh: { type: Number, required: true },
  co2e: { type: Number, required: true },
  co2e_unit: { type: String, required: true },
  date: { type: Date, default: Date.now },
  detail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MajorElectSupp",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const EmissionElectricity = mongoose.model(
  "EmissionElectricity",
  emissionSchema
);
export default EmissionElectricity;
