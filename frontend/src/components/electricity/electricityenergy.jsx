import { useState, useEffect } from "react";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import TopHeading from "../byDist-TravelEmission/heading";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import Footer from "../byDist-TravelEmission/footer";
import DecideResult from "../byDist-TravelEmission/DecideResult";
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
    { key: "IN-JH", value: "Jharkhand" },
    { key: "IN-KA", value: "Karnataka" },
    { key: "IN-KL", value: "Kerala" },
    { key: "IN-MP", value: "Madhya Pradesh" },
    { key: "IN-MH", value: "Maharashtra" },
    { key: "IN-MN", value: "Manipur" },
    { key: "IN-ML", value: "Meghalaya" },
    { key: "IN-MZ", value: "Mizoram" },
    { key: "IN-NL", value: "Nagaland" },
    { key: "IN-OR", value: "Odisha" },
    { key: "IN-PB", value: "Punjab" },
    { key: "IN-RJ", value: "Rajasthan" },
    { key: "IN-SK", value: "Sikkim" },
    { key: "IN-TN", value: "Tamil Nadu" },
    { key: "IN-TG", value: "Telangana" },
    { key: "IN-TR", value: "Tripura" },
    { key: "IN-UP", value: "Uttar Pradesh" },
    { key: "IN-UK", value: "Uttarakhand" },
    { key: "IN-WB", value: "West Bengal" },
    { key: "IN-AN", value: "Andaman and Nicobar Islands" },
    { key: "IN-CH", value: "Chandigarh" },
    { key: "IN-DL", value: "Delhi" },
    { key: "IN-DN", value: "Dadra and Nagar Haveli and Daman and Diu" },
    { key: "IN-JK", value: "Jammu and Kashmir" },
    { key: "IN-LA", value: "Ladakh" },
    { key: "IN-LD", value: "Lakshadweep" },
    { key: "IN-PY", value: "Puducherry" },
  ];
  const [defaultProvider, setDefaultProvider] = useState();
  const [defaultRegion, setDefaultRegion] = useState();
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("/api/travel-emission/distances");

  // Fetch default provider and region on component mount
  useEffect(() => {
    const getDefault = async () => {
      try {
        const result = await axios.post(
          "http://localhost:5000/api/provider-default",
          {}, // empty body
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-type": "application/json",
            },
            // withCredentials: true, // if using cookies/sessions
          }
        );
        // console.log("Default provider:", result.data.provider);
        setDefaultProvider(result.data.provider);
        setDefaultRegion(result.data.region);
        // console.log("Default provider:", result.data);
        // setState(result.data) if needed
      } catch (err) {
        console.error("Error fetching default provider:", err);
      } finally {
        setLoading(false);
      }
    };

    getDefault();
  }, []);

  const [usage, setUsage] = useState("");
  const [selectedState, setSelectedState] = useState(defaultRegion);
  const [providerName, setProviderName] = useState(defaultProvider);
  const [providerList, setProviderList] = useState([]);
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
    <div className="main">
      <TopHeading />
      <div className="flex-col">
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: 4,
            boxShadow: 3,
            border: "1px solid #d0e8d0",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            p: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ margin: 1, marginBottom: 3 }}>
            <span style={{ fontSize: "30px" }}>🧮</span>
            Travel Details
          </Typography>
          <form onSubmit={handleSumbit}>
            <TextField
              type="number"
              step="0.1"
              label="Electricity Usage in kWh"
              variant="outlined"
              sx={{ m: 1, minWidth: 550 }}
              value={usage}
              onChange={handleChange}
              placeholder="e.g. 12.5"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"> 🌍</InputAdornment>
                ),
              }}
            />

            <br />
            <br />
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 550 }}>
              <Autocomplete
                options={indianStates}
                getOptionLabel={(option) => option.value}
                value={defaultRegion}
                onChange={handelState}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Place"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          // sx={{ marginRight: 0 }}
                        >
                          ⛽
                        </InputAdornment>
                      ),
                    }}
                  />
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
                  <TextField
                    {...params}
                    label="Select Provider"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          // sx={{ marginRight: 0 }}
                        >
                          ⛽
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                sx={{ m: 1, minWidth: 211 }}
              />
            </FormControl>
            <br></br>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </form>
        </Box>
        {/* <Container maxWidth="sm" sx={{ width: 500 }}> */}

        <DecideResult id={id} />
      </div>
      {/* Footer */}

      <Footer />
    </div>
  );
}

export default ElectricityUses;
