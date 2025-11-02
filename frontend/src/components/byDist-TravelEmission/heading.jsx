import { Typography, Box, Chip } from "@mui/material";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import "./dis.css";
const TopHeading = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 4, marginBottom: 5 }}>
      {/* Icon + Intro Text */}

      <Box className="flex-col">
        <EnergySavingsLeafIcon className="leaf" /> {/* Main Heading */}
        <Typography variant="h3">
          <Box
            component="span"
            sx={{ color: "#009688", fontWeight: 500, fontSize: 35 }}
          >
            IN{" "}
          </Box>

          <Box component="span" sx={{ color: "#00796B", fontWeight: 700 }}>
            India Travel{" "}
          </Box>
          <Box component="span" sx={{ color: "#388E3C", fontWeight: 700 }}>
            Carbon Calculator
          </Box>
          {/* Feature Chips */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Chip
              label="Advanced Analytics"
              color="success"
              variant="outlined"
              sx={{ scale: 0.75, backgroundColor: "lightgreen" }}
            />
            <Chip
              label="Real-time Calculations"
              color="info"
              variant="outlined"
              sx={{ scale: 0.75, backgroundColor: "lightblue" }}
            />
          </Box>
        </Typography>
      </Box>
      {/* Subheading */}
      <Typography variant="body1" sx={{ mt: 2, color: "#555" }}>
        Calculate your travel’s environmental impact with precision. Get
        detailed insights and<br></br> actionable recommendations to reduce your
        carbon footprint.
      </Typography>
    </Box>
  );
};

export default TopHeading;
