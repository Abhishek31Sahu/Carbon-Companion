import axios from "axios";

const apiKey = process.env.REACT_APP_CLIMATIQ_API_KEY;

const FetchSuggestion = async (foodType) => {
  try {
    const response = await axios.post(
      "https://preview.api.climatiq.io/autopilot/v1-preview3/suggest",
      {
        suggest: {
          domain: "general",
          text: foodType,
          region: "IN",
          region_fallback: true,
        },
        max_suggestions: 2,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching suggestions:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch suggestions");
  }
};

export default FetchSuggestion;
