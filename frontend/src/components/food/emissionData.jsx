import axios from "axios";
// import FetchSuggestion from "./suggestionActiID";
import FoodTypeInput from "./userInputfood"; // Assuming you have a component to handle user input

function fetchEmissionData() {
  const fetchEmission = async (foodType, foodQuantity, foodUnit) => {
    try {
      const response = await axios.post(
        "https://api.climatiq.io/data/v1/estimate",
        {
          emission_factor: {
            activity_id: "food-supply_grid-source_coal_oil-station_anpara", // Example activity ID, replace with actual
            data_version: "^23",
            region: "IN",
          },
          parameters: {
            weight: 50,
            weight_unit: "kg",
          },
        },
        {
          headers: {
            Authorization: "Bearer NAEB0WGWN53MFFRTQ53D1WRX7C",
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `Estimated CO₂e: ${response.data.co2e} ${response.data.co2e_unit}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error calculating emissions:",
        error.response?.data || error.message
      );
      throw new Error("Failed to calculate emissions");
    }
  };

  return (
    <div>
      <h1>Food Emission Data</h1>
      <p>Enter your food type to get CO₂ emissions data.</p>
      {/* Assuming you have a component to handle user input */}
      <FoodTypeInput onFoodTypeChange={fetchEmission} />
    </div>
  );
}

export default fetchEmissionData;
