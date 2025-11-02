import { useState, useEffect } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import { Autocomplete, TextField, FormControl } from "@mui/material";

function ElectricityUses({ onSumbit }) {
  const indianStates = [
    { key: "IN-AP", value: "Andhra Pradesh" },
    { key: "IN-AR", value: "Arunachal Pradesh" },
    { key: "IN-AS", value: "Assam" },
    { key: "IN-BR", value: "Bihar" },
    { key: "IN-CT", value: "Chhattisgarh" },
    { key: "IN-GA", value: "Goa" },
    { key: "IN-GJ", value: "Gujarat" },
    { key: "IN-HR", value: "Haryana" },
    { key: "IN-HP", value: "Himachal Pradesh" },
 
  ];
//   const [defaultProvider, setDefaultProvider] = useState();
//   const [defaultRegion, setDefaultRegion] = useState();
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getDefault = async () => {
//       try {
//         const result = await axios.post(
//           "http://localhost:5000/api/provider-default",
//           {}, // empty body
//           {
//             headers: {
//               Authorization: localStorage.getItem("token"),
//               "Content-type": "application/json",
//             },
//             // withCredentials: true, // if using cookies/sessions
//           }
//         );
//         // console.log("Default provider:", result.data.provider);
//         setDefaultProvider(result.data.provider);
//         setDefaultRegion(result.data.region);
//         // console.log("Default provider:", result.data);
//         // setState(result.data) if needed
//       } catch (err) {
//         console.error("Error fetching default provider:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getDefault();
//   }, []);

  const [distance, setDistance] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleSize, setVehicleSize] = useState(defaultProvider);
  const [usage, setUsage] = useState([]);
  const handleChange = (event) => {
    setUsage(event.target.value);
  };
  const handelState = async (event, newValue) => {
    setSelectedState(newValue);
    console.log(selectedState);
    let state = newValue?.key;
    console.log(state);
    let result = await axios.post("/api/electricity/provider", { state });
    setProviderList(result.data);
  };

  const handleSumbit = (event) => {
    event.preventDefault();
    const energy = parseFloat(usage);
    if (!isNaN(energy)) {
      // const data = {
      //   energyKWH: parseFloat(usage),
      //   activity_id: providerName?.key,
      //   region: selectedState?.key,
      // };
      const activity_id = providerName?.key || defaultProvider?.key;
      const name = providerName?.value || defaultProvider?.value;
      const state = selectedState?.value || defaultRegion?.value;
      const region = selectedState?.key || defaultRegion?.key;
      onSumbit({ energy, activity_id, region, name, state });
      setUsage("");
    } else {
      alert("Please enter a valid number");
    }
  };
  if (loading) return <div>Loading...</div>;
  return (
    // <div>
    //   <h2>Electricity Usage</h2>
    <form onSubmit={handleSumbit}>
      <label>
        Daily Electricity Usage (kWh):
        <TextField
          type="number"
          step="0.1"
          value={usage}
          onChange={handleChange}
          placeholder="e.g. 12.5"
          required
        />
      </label>
      <br />
      <br />
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 550 }}>
        <Autocomplete
          options={indianStates}
          getOptionLabel={(option) => option.value}
          value={defaultRegion}
          onChange={handelState}
          renderInput={(params) => (
            <TextField {...params} label="Select Place" variant="outlined" />
          )}
          sx={{ m: 1, minWidth: 211 }}
        />
        <br />
        <br />
        <Autocomplete
          options={providerList}
          getOptionLabel={(option) => option.value}
          value={defaultProvider}
          onChange={(event, newValue) => {
            setProviderName(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Provider" variant="outlined" />
          )}
          sx={{ m: 1, minWidth: 211 }}
        />
      </FormControl>
      <br></br>
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </form>
    // </div>
  );
}

export default ElectricityUses;
