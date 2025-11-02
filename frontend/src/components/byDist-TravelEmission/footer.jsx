import { motion } from "framer-motion";
import { Box } from "@mui/material";
function Footer() {
  return (
    <Box
      sx={{
        margin: 2.5,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        backgroundColor: "#ffff",
        padding: 2,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0.5, 0.5, 0.5, 0.5)",
        border: "1px solid #e5ece5ff",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <div className="p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              <span className="text-3xl">🌍</span>
              Sustainable Travel Initiative
            </h3>
          </div>
          <p className="text-gray-600 mb-4 text-lg">
            Every conscious decision towards sustainable travel creates a
            positive ripple effect for our planet's future.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>🔬 Scientific emission factors</span>
            <span>📊 Real-time calculations</span>
            <span>🌱 Actionable insights</span>
          </div>
        </div>
      </motion.div>
    </Box>
  );
}

export default Footer;
