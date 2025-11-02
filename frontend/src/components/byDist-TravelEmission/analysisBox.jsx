import { Box, Typography, Button } from "@mui/material";
import "./dis.css";
import InsightsIcon from "@mui/icons-material/Insights";

import { motion } from "framer-motion";
const AnalysisBox = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {/* Icon */}

      <motion.div
        className="w-32 h-32 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* <Calculator className="w-16 h-16 text-emerald-600" /> */}
        <InsightsIcon className="icon" />
      </motion.div>
      {/* Heading */}
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Ready for Advanced Analysis?
      </Typography>

      {/* Description */}
      <Typography variant="body1" sx={{ color: "#555", maxWidth: 400 }}>
        Fill in your travel details to get a comprehensive carbon footprint
        analysis with personalized recommendations.
      </Typography>

      {/* Action Button */}
      <Button
        variant="contained"
        sx={{
          background: "linear-gradient(to right, #A8E6CF, #A0E7E5)",
          color: "#fff",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: 3,
          "&:hover": {
            background: "linear-gradient(to right, #81C784, #4DD0E1)",
          },
        }}
      >
        Calculate Carbon Footprint
      </Button>
    </Box>
  );
};

export default AnalysisBox;
