import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import axios from "axios";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import path from "path";
import qs from "qs";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./model/user.js";
import MajorElectSupp from "./model/MajorElectSupp.js";
import bodyParser from "body-parser";
const app = express();
import EmissionElectricity from "./model/electricitydb.js";
import FoodItem from "./model/foodItem.js";
import FoodEmi from "./model/fooddb.js";
import RoadTransportEmi from "./model/roadtransportdb.js";
import vehicleInfo from "./model/vehicleInfo.js";
import FlightEmissions from "./model/flightdb.js";
import FlightInfo from "./model/filightInfo.js";
import {
  signupValidation,
  loginValidation,
} from "./middleware/authValidation.js";
import { signUp, signIn } from "./controllers/authController.js";
import { verifyAuthorization } from "./middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const CLIMATIQ_API_KEY = process.env.CLIMATIQ_API_KEY;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const sessionOption = {
  secret: "mysupersecret",
  saveUninitialized: true,
  resave: false,
  cookie: {
    expires: Date.now() + 100 * 60 * 60 * 24 * 3,
    maxAge: 100 * 60 * 60 * 24 * 3,
    httpOnly: true,
    secure: false, // change to true in production with HTTPS
    sameSite: "lax",
  },
};
app.use(express.json()); // for JSON bodies
app.use(express.urlencoded({ extended: true })); // for form submissions

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/api/register", signupValidation, signUp);
app.post("/api/login", loginValidation, signIn);

app.post("/api/provider-default", verifyAuthorization, async (req, res) => {
  const topProvider = await MajorElectSupp.findOne({
    owner: req.user._id,
  }).sort({ count: -1 });

  console.log(topProvider);
  res.json(topProvider);
});

app.post("/api/electricity/provider", async (req, res) => {
  let s = req.body;
  console.log(s.state);
  try {
    let provider = await axios.get(
      `https://api.climatiq.io/data/v1/search?data_version=^21&category=Electricity&sector=Energy&unit_type=Energy&region=${s.state}`,
      {
        headers: {
          Authorization: CLIMATIQ_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(provider.data);
    let provderList = [];
    if (Array.isArray(provider.data.results)) {
      provderList = provider.data.results.map((activity) => ({
        key: activity.activity_id,
        value: activity.name,
      }));
    } else {
      console.error("Expected 'results' to be an array!");
    }
    console.log(provderList);
    const data = {};
    res.json(provderList);
  } catch (error) {
    console.error("Error fetching emissions by date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/log-electricity", verifyAuthorization, async (req, res) => {
  const { provider, region, energyKWH, co2e, co2e_unit } = req.body;
  console.log("Logged electricity data:", { energyKWH, co2e, co2e_unit });

  const entry = new EmissionElectricity({
    energy_kwh: energyKWH,
    co2e: co2e,
    co2e_unit: co2e_unit,
  });
  const data = await MajorElectSupp.findOne({
    provider,
    owner: req.user._id,
  });

  console.log(data);
  if (!data) {
    const elecProv = new MajorElectSupp({
      provider: provider,
      region: region,
      owner: req.user._id,
      count: 1,
    });
    await elecProv.save();
    const getnewObj = await MajorElectSupp.findOne({
      provider,
      owner: req.user._id,
    });

    console.log(getnewObj);
    entry.detail = getnewObj._id;
    entry.owner = req.user._id;
    await entry.save();
  } else {
    data.count += 1;
    await data.save();
    entry.owner = req.user._id;
    entry.detail = data._id;
    await entry.save();
  }

  res.sendStatus(200);
});

app.get("/api/emissions", async (req, res) => {
  try {
    let { from, to } = req.query;

    //parse string dates into actual date format
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // validate date
    if (isNaN(fromDate) || isNaN(toDate)) {
      const data = await EmissionElectricity.find({})
        .sort({ date: 1 })
        .limit(30);
      res.json(data);
    } else {
      // data extrction
      const emission = await EmissionElectricity.find({
        date: { $gte: fromDate, $lte: toDate },
      }).sort({ date: 1 });

      res.json(emission);
    }
  } catch (error) {
    console.error("Error fetching emissions by date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/details", async (req, res) => {
  try {
    const { ids } = req.query;
    console.log("IDs received:", ids);
    let query = {};
    if (ids) {
      let commaSeptId = ids.split(",");
      query = { _id: { $in: commaSeptId } };
    }
    console.log(query);
    const data = await MajorElectSupp.find(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/roadEmissions", async (req, res) => {
  try {
    let { fromDate, toDate } = req.params;
    if (isNaN(fromDate) || isNaN(toDate)) {
      const data = await RoadTransportEmi.find({}).sort({ date: 1 }).limit(30);
      res.json(data);
    } else {
      const data = await RoadTransportEmi.find({
        date: { $gte: fromDate, $lte: toDate },
      }).sort({ date: 1 });
    }
  } catch (err) {
    console.error("Error fetching road emissions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/vehicleDetails", async (req, res) => {
  try {
    const { ids } = req.query;
    let query = [];
    if (ids) {
      const sepIds = ids.split(",");
      query = { id: { $in: sepIds } };
    }

    const vehicleDetails = await vehicleInfo.find(query);
    res.json(vehicleDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

app.get("/api/flightDetail", async (req, res) => {
  try {
    const { ids } = req.query;
    let query = [];
    if (ids) {
      const sepIds = ids.split(",");
      query = { id: { $in: sepIds } };
    }

    const FlightDetails = await FlightInfo.find(query);
    res.json(FlightDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

app.get("/api/flightEmissions", async (req, res) => {
  try {
    let { fromDate, toDate } = req.params;
    if (isNaN(fromDate) || isNaN(toDate)) {
      const data = await FlightEmissions.find({}).sort({ date: 1 }).limit(30);
      res.json(data);
    } else {
      const data = await FlightEmissions.find({
        date: { $gte: fromDate, $lte: toDate },
      }).sort({ date: 1 });
    }
  } catch (err) {
    console.error("Error fetching flight emissions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get original extension
    cb(null, Date.now() + ext); // Save with timestamp + extension
  },
});

const upload = multer({ storage });

app.post("/api/ingredients", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  async function segmentImage() {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(req.file.path));
    console.log("🧾 File extension:", path.extname(req.file.path));

    const segmentationUrl =
      "https://api.logmeal.com/v2/image/segmentation/complete/v1.0?language=eng";
    try {
      const res = await axios.post(segmentationUrl, formData, {
        headers: {
          Authorization: process.env.LOGMEAL_API_KEY,
          ...formData.getHeaders(),
        },
      });
      const imageId = res.data.imageId;
      if (!imageId) {
        throw new Error("Image ID not found in response");
      } else {
        console.log("🆔 Segmentation imageId:", imageId);

        return imageId;
      }
    } catch (err) {
      console.error(
        "❌ Segmentation Error:",
        err.response?.data || err.message
      );
      return null;
    }
  }

  // Function to get recipe ingredients from the segmented image
  async function getRecipeIngredients(imageId) {
    try {
      const response = await axios.post(
        `https://api.logmeal.com/v2/nutrition/recipe/ingredients/v1.0?language=eng`,
        { imageId },
        {
          headers: {
            Authorization: process.env.LOGMEAL_API_KEY,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      let sum = 0;
      let recipe = [];
      const items = response.data.recipe;
      items.forEach((ingredient) => {
        let unitExtra = {};
        if (
          ingredient.unit === "g" ||
          ingredient.unit === "kg" ||
          ingredient.unit === "mg"
        ) {
          unitExtra.unit_type = "weight";
        } else if (ingredient.unit === "ml" || ingredient.unit === "l") {
          unitExtra.unit_type = "volume";
        }
        let ingredients = {
          name: ingredient.name,
          quantity: ingredient.weight,
          unit: ingredient.unit,
          ...unitExtra,
        };
        recipe.push(ingredients);
        sum += ingredient.weight;
      });
      // console.log("🍽️ Recipe Ingredients:", recipe);
      console.log("Total Weight:", sum);
      res.json({ recipe, totalWeight: sum });

      // console.log(
      //   "✅ Recipe Ingredients:",
      //   JSON.stringify(response.data, null, 2)
      // );
    } catch (error) {
      console.error(
        "❌ Recipe fetch failed:",
        error.response?.data || error.message
      );
    }
  }

  // 🚀 Run the full flow
  (async () => {
    try {
      const imageId = await segmentImage();
      console.log("🆔 Image ID for recipe ingredients:", imageId); //1986101
      await getRecipeIngredients(imageId);
    } catch (err) {
      console.error("⚠️ Flow terminated due to error.");
    }
  })();
});

app.post("/api/ingredients/emission", verifyAuthorization, async (req, res) => {
  const { recipe, totalWeight } = req.body;

  if (!recipe || !totalWeight) {
    return res.status(400).json({ error: "Invalid recipe data" });
  }
  console.log(recipe, totalWeight);
  let activity = [];
  console.log(activity);
  async function searchEmissionFactor(ingredient) {
    await axios
      .get(
        `https://api.climatiq.io/data/v1/search?query=${ingredient.name}&data_version=^24&unit_type=${ingredient.unit_type}&results_per_page=1`,
        {
          headers: {
            Authorization: CLIMATIQ_API_KEY,
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        if (response.data.results.length === 0 || !response.data.results) {
          console.warn(`No results found for ${ingredient.name}`);
          if (ingredient.unit_type === "weight") {
            console.warn(
              `No activity found for ${ingredient.name} with weight unit`
            );
            return null;
          } else if (ingredient.unit_type === "volume") {
            if (ingredient.unit === "ml") {
              ingredient.unit = "g";
              ingredient.unit_type = "weight";
            } else if (ingredient.unit === "l") {
              ingredient.unit = "kg";
              ingredient.unit_type = "weight";
            }
            await searchEmissionFactor(ingredient);
            return null;
          }
        }
        // console.log(
        //   `🔍 Found activity ID for ${ingredient.name}:`,
        //   response.data
        // );

        response.data.results.forEach((result) => {
          const activityId = result.activity_id;
          // console.log("🔍 Activity ID:", activityId);
          // console.log("version:", result.data_version);
          // console.log("region:", result.region);
          // console.log("information :", result.data_version_information);
          activity.push({
            id: activityId,
            name: ingredient.name,
            quantity: ingredient.quantity,
            quantity_unit: ingredient.unit,
            region: result.region,
            information: result.data_version_information,
          });
        });
        // console.log(activity);
      })
      .catch((error) => {
        console.error(
          "❌ Error fetching activity ID:",
          error.response?.data || error.message
        );
        throw new Error("Failed to fetch activity ID");
      });
  }
  console.log(activity);
  async function estimateEmissions(params) {
    axios
      .post("https://api.climatiq.io/data/v1/estimate/batch", params, {
        headers: {
          Authorization: CLIMATIQ_API_KEY,
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        // console.log(
        //   "Batch Emission Data:",
        //   response.data.results[0].valid_values
        // );
        let activityLoc = new Map();
        let idx = 0;
        let totalco2e = 0;
        response.data.results.forEach((em) => {
          activityLoc.set(em.emission_factor.activity_id, idx);
          idx++;
          totalco2e += em.co2e;
        });
        console.log(activityLoc);

        const food = new FoodEmi({
          co2e: totalco2e,
          co2e_unit: response.data.results[0].co2e_unit,
          owner: req.user._id,
          fooditemsList: [],
        });

        let reqQ = {};
        const promises = [];
        activity.forEach(async (em) => {
          try {
            if (activityLoc.has(em.id)) {
              let idx = activityLoc.get(em.id);
              console.log(idx);
              reqQ.fooditem = activity[idx].name;
              reqQ.quantity = activity[idx].quantity;
              reqQ.quantity_unit = activity[idx].quantity_unit;
              reqQ.co2e = response.data.results[idx].co2e;

              reqQ.co2e_unit = response.data.results[idx].co2e_unit;
              reqQ.owner = req.user._id;
              console.log(reqQ);
              // const itemInfo = new FoodItem(reqQ);
              // console.log(itemInfo);
              // await itemInfo.save();

              const itemInfo = new FoodItem(reqQ);
              promises.push(
                itemInfo
                  .save()
                  .then((saved) => food.fooditemsList.push(saved._id))
              );
            }
          } catch (err) {
            console.warn(
              `⚠️ Failed to save item for activity ID ${em.id}:`,
              err.message
            );
            res.status(500).json({ error: "Internal Server Error" });
          }
        });

        try {
          const results = await Promise.all(promises);
          console.log(results);
        } catch (error) {
          console.error("One of the promises failed:", error);
        }

        await food.save();

        res.json(response.data);
      })
      .catch((error) => {
        console.error(
          "❌ Error calculating batch emissions:",
          error.response?.data || error.message
        );
        res.status(500).json({ error: "Failed to calculate batch emissions" });
      });
  }

  // Create a batch of emission factors

  function createBatch(ingredientArray) {
    const params = [];
    ingredientArray.forEach((value) => {
      let parameters = {};
      if (
        value.weight_unit === "g" ||
        value.weight_unit === "kg" ||
        value.weight_unit === "mg"
      ) {
        parameters.weight = value.weight;
        parameters.weight_unit = value.weight_unit;
      } else if (value.volume_unit === "ml" || value.volume_unit === "l") {
        parameters.volume = value.volume;
        parameters.volume_unit = value.volume_unit;
      }
      params.push({
        emission_factor: {
          activity_id: value.activityId,
          data_version: "^21",
        },
        parameters: parameters,
      });
    });
    return params;
  }
  // console.log(recipe.length);
  for (let i = 0; i < recipe.length; i++) {
    // console.log(i);
    await searchEmissionFactor(recipe[i]);
  }
  // console.log(activity);

  const ingredientMap = new Map();
  let i = 0,
    j = 0;
  for (i = 0; i < recipe.length; i++) {
    if (j < activity.length && recipe[i].name === activity[j].name) {
      let quan = {};
      if (
        recipe[i].unit == "g" ||
        recipe[i].unit == "kg" ||
        recipe[i].unit == "mg"
      ) {
        quan.weight = recipe[i].quantity;
        quan.weight_unit = recipe[i].unit;
        quan.unit_type = "weight";
      } else if (recipe[i].unit == "ml" || recipe[i].unit == "l") {
        quan.volume = recipe[i].quantity;
        quan.volume_unit = recipe[i].unit;
        quan.unit_type = "volume";
      }
      ingredientMap.set(recipe[i].name, {
        activityId: activity[j].id,
        ...quan,
      });
      j++;
    }
  }

  let params = createBatch(Array.from(ingredientMap.values())); // Convert Map to array
  console.log("📦 Batch parameters:", params);
  await estimateEmissions(params);
  console.log("📝 Emission factors:", ingredientMap);
});

// travel emission

app.post(
  "/api/travel-emission/distances",
  verifyAuthorization,
  async (req, res) => {
    const { vehicleType, fuelType, passenger, weight, weight_unit, distance } =
      req.body;
    console.log(req.body);
    let response;
    if (fuelType === "Diesel" || fuelType === "Petrol") {
      const data = qs.stringify({
        vehicle_type: vehicleType || "Car-Size-Small",
        distance_value: distance,
        distance_unit: "km",
        fuel_type: fuelType || "Unknown",
      });
      console.log(data);
      const config = {
        method: "post",
        url: "https://carbonsutra1.p.rapidapi.com/vehicle_estimate_by_type",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: process.env.Rapid_API_Key,
          "X-RapidAPI-Key":
            "6f4317c8cbmsh727d2274c4f79b8p10e79fjsnf8fdfa8b4258",
          "X-RapidAPI-Host": "carbonsutra1.p.rapidapi.com",
        },
        data: data,
      };

      await axios
        .request(config)
        .then(async (result) => {
          console.log("Estimated CO₂e:", result.data.data);
          let aboutVehicle = await vehicleInfo.findOne({
            type: result.data.data.vehicle_type,
            fuel: result.data.data.fuel_type,
            owner: req.user._id,
          });
          if (aboutVehicle) {
            aboutVehicle.count += 1;
            await aboutVehicle.save();
          } else {
            aboutVehicle = new vehicleInfo({
              type: result.data.data.vehicle_type,
              fuel: result.data.data.fuel_type,
              count: 1,
              owner: req.user._id,
            });
            await aboutVehicle.save();
          }
          const recordEmission = new RoadTransportEmi({
            distance: result.data.data.distance_value,
            distance_unit: result.data.data.distance_unit,
            co2e: result.data.data.co2e_kg,
            co2e_unit: "kg",
            aboutVehi: aboutVehicle,
            owner: req.user._id,
          });
          await recordEmission.save();
          res.json({
            vehicle_type: result.data.data.vehicle_type,
            distance_value: result.data.data.distance_value,
            distance_unit: result.data.data.distance_unit,
            fuel_type: result.data.data.fuel_type,
            co2e_gm: result.data.data.co2e_gm,
            co2e_kg: result.data.data.co2e_kg,
          });
        })
        .catch((error) => {
          console.error("API Error:", error?.data || error.message);
        });
    } else if (weight) {
      response = await axios.post(
        "https://api.climatiq.io/data/v1/estimate",
        {
          emission_factor: {
            activity_id: vehicleType,
            source: "GLEC",
            region: "ASIA_AFRICA",
            year: 2019,
            source_lca_activity: "well_to_tank",
            data_version: "^26",
          },
          parameters: {
            weight: parseInt(weight),
            weight_unit: "t",
            distance: parseInt(distance),
            distance_unit: "km",
          },
        },
        {
          headers: {
            Authorization: CLIMATIQ_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } else {
      console.log("here");
      response = await axios.post(
        "https://api.climatiq.io/data/v1/estimate",
        {
          emission_factor: {
            activity_id: vehicleType,
            source: "UBA",
            // region: "ASIA_AFRICA",
            // year: 2019,
            // source_lca_activity: "well_to_tank",
            data_version: "^27",
          },
          parameters: {
            passengers: parseInt(passenger) || 1,
            distance: parseInt(distance),
            distance_unit: "km",
          },
        },
        {
          headers: {
            Authorization: CLIMATIQ_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    }
    let aboutVehicle = await vehicleInfo.findOne({
      type: vehicleType,
      fuel: fuelType,
      owner: req.user._id,
    });
    if (aboutVehicle) {
      aboutVehicle.count += 1;
      await aboutVehicle.save();
    } else {
      aboutVehicle = new vehicleInfo({
        type: vehicleType,
        fuel: fuelType,
        count: 1,
        owner: req.user._id,
      });
      await aboutVehicle.save();
    }
    const recordEmission = new RoadTransportEmi({
      distance: distance,
      distance_unit: "km",
      co2e: response.data.co2e,
      co2e_unit: "kg",
      aboutVehi: aboutVehicle,
      owner: req.user._id,
    });
    await recordEmission.save();
    res.json({
      vehicle_type: vehicleType,
      distance_value: distance,
      distance_unit: "km",
      fuel_type: fuelType,
      co2e_kg: response.data.co2e,
      co2e_gm: response.data.co2e * 1000,
    });
  }
);

app.post(
  "/api/travel-emission/distances/database",
  verifyAuthorization,
  async (req, res) => {
    const { distance, co2e_kg, vehicleType, fuel_type } = req.body;

    const roadTrans = new RoadTransportEmi({
      distance: distance,
      co2e_kg: co2e_kg,
      // vehicle_type: vehicleType || "Car-Size-Small",
      co2e_unit: "kg",
      owner: req.user._id,
    });

    const vehicle = new vehicleInfo({
      vehicle_type: vehicleType || "Car-Size-Small",
      fuel_type: fuel_type || "Petrol",
      owner: req.user._id,
    });

    try {
      await vehicle.save();
      roadTrans.aboutVehi = vehicle._id;
      await roadTrans.save();
      res.status(201).json(roadTrans);
    } catch (error) {
      console.error("Error saving to database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.post("/api/travel-emission/fuel", async (req, res) => {
  let { fuelUsage, fuelType, fuleValue } = req.body;
  const data = qs.stringify({
    fuel_usage: fuelUsage,
    fuel_name: fuelType,
    fuel_value: fuleValue,
  });
  axios
    .post("https://carbonsutra1.p.rapidapi.com/fuel_estimate", data, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: process.env.Rapid_API_Key,
        "X-RapidAPI-Key": "6f4317c8cbmsh727d2274c4f79b8p10e79fjsnf8fdfa8b4258",
        "X-RapidAPI-Host": "carbonsutra1.p.rapidapi.com",
      },
    })
    .then((response) => {
      res.json({
        fuel_usage: response.data.data.fuel_usage,
        fuel_type: response.data.data.fuel_name,
        fuel_value: response.data.data.fuel_value,
        fuel_unit: response.data.data.fuel_unit,
        co2e_gm: response.data.data.co2e_gm,
        co2e_kg: response.data.data.co2e_kg,
      });
      console.log("Estimated CO₂e:", response.data.data);
    })
    .catch((error) => {
      console.error("API Error:", error.response?.data || error.message);
    });
});

app.post(
  "/api/travel-emission/flight",
  verifyAuthorization,
  async (req, res) => {
    const {
      iata_from,
      iata_to,
      flight_class,
      round_trip,
      add_rf,
      include_wttt,
      passengers,
    } = req.body;
    const data = qs.stringify({
      iata_airport_from: iata_from,
      iata_airport_to: iata_to,
      flight_class: flight_class,
      round_trip: round_trip,
      add_rf: add_rf,
      include_wtt: include_wttt,
      number_of_passengers: passengers,
    });

    const config = {
      method: "post",
      url: " https://carbonsutra1.p.rapidapi.com/flight_estimate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: process.env.Rapid_API_Key,
        "X-RapidAPI-Key": "6f4317c8cbmsh727d2274c4f79b8p10e79fjsnf8fdfa8b4258",
        "X-RapidAPI-Host": "carbonsutra1.p.rapidapi.com",
      },
      data: data,
    };

    axios
      .request(config)
      .then(async (response) => {
        let info = {
          From: response.data.data.iata_airport_from,
          To: response.data.data.iata_airport_to,
          co2e_gm: response.data.data.co2e_gm,
          co2e_kg: response.data.data.co2e_kg,
        };
        console.log(info);
        let existing = await FlightInfo.findOne({
          From: response.data.data.iata_airport_from,
          To: response.data.data.iata_airport_to,
          owner: req.user._id,
        });
        if (existing) {
          existing.count += 1;
          await existing.save();
        } else {
          existing = new FlightInfo({
            From: response.data.data.iata_airport_from,
            To: response.data.data.iata_airport_to,
            owner: req.user._id,
            count: 1,
          });
          await existing.save();
        }
        const flightEmissionco2 = new FlightEmissions({
          co2e: response.data.data.co2e_kg,
          co2e_unit: "gm",
          aboutFlight: existing,
          owner: req.user._id,
        });
        await flightEmissionco2.save();
        res.json(response.data.data);
        console.log("Estimated CO₂e:", response.data.data);
      })
      .catch((error) => {
        console.error("API Error:", error.response?.data || error.message);
      });
  }
);

app.post("/api/travel-emission", async (req, res) => {
  const response = await axios.post(
    "https://api.climatiq.io/data/v1/estimate",
    {
      emission_factor: {
        activity_id: "transport_services-type_railway_transportation_services",
        source: "EXIOBASE",
        region: "IN",
        year: 2019,
        source_lca_activity: "unknown",
        data_version: "^24",
      },
      parameters: {
        money: 500,
        money_unit: "inr",
      },
    },
    {
      headers: {
        Authorization: CLIMATIQ_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  res.json(response.data);
});
app.post("/api/travel-emission/RailDis", async (req, res) => {
  const response = await axios.post(
    "https://api.climatiq.io/data/v1/estimate",
    {
      emission_factor: {
        activity_id:
          "passenger_train-route_type_long_distance-fuel_source_electricity",
        source: "UBA",
        region: "DE",
        year: 2020,
        source_lca_activity: "upstream-electricity_consumption",
        data_version: "^24",
      },
      parameters: {
        passengers: 4,
        distance: 100,
        distance_unit: "km",
      },
    },
    {
      headers: {
        Authorization: CLIMATIQ_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  res.json(response.data);
});
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
