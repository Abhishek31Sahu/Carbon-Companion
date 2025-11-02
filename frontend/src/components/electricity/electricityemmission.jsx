import calculateElectricityEmission from "./electricity";
import axios from "axios";
import ElectricityUses from "./electricityenergy";

function Electricityemmission() {
  // Function to handle the emission data submission
  // This function will be called when the user submits their electricity usage
  const emmissiondata = async ({
    energy,
    activity_id,
    region,
    name,
    state,
  }) => {
    const result = await calculateElectricityEmission({
      energy,
      activity_id,
      region,
    });

    await axios.post(
      "http://localhost:5000/api/log-electricity",
      {
        provider: {
          key: activity_id,
          value: name,
        },
        energyKWH: energy,
        region: {
          key: region,
          value: state,
        },
        co2e: result.co2e,
        co2e_unit: result.co2e_unit,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
  };

  return (
    <div className="App">
      <h1>Electricity Emission Calculator</h1>
      <p>Enter your daily electricity usage to calculate CO₂ emissions.</p>
      <ElectricityUses onSumbit={emmissiondata} />
    </div>
  );
}

export default Electricityemmission;
