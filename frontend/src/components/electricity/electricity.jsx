import axios from "axios";
const apiKey = process.env.REACT_APP_CLIMATIQ_API_KEY;
const calculateElectricityEmission = async ({
  energy,
  activity_id,
  region,
}) => {
  if (typeof energy !== "number" || energy <= 0) {
    throw new Error("Invalid energy input. Please provide a positive number.");
  }
  try {
    const response = await axios.post(
      "https://api.climatiq.io/data/v1/estimate",
      {
        emission_factor: {
          activity_id: activity_id,
          data_version: "^21",
          region: region, // optional if not supported
        },
        parameters: {
          energy: energy,
          energy_unit: "kWh",
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

// Example usage
// calculateElectricityEmission(12.5); // Daily household usage
export default calculateElectricityEmission;
