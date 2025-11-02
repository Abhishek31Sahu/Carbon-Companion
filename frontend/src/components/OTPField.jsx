import { TextField, Box, Button } from "@mui/material";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

function OTPField({ flag, verifyOTP }) {
  const [otp, setOtp] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      handleError("Enter the OTP");
      return;
    }
    verifyOTP(otp);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: flag ? "flex" : "none",
        flexDirection: "column",
        width: "100%",
        gap: 2,
      }}
    >
      <TextField
        type="number"
        label="Enter OTP"
        variant="outlined"
        onChange={(e) => setOtp(e.target.value)}
        fullWidth
      />
      <Button type="submit" fullWidth variant="contained">
        Confirm OTP
      </Button>
      <ToastContainer />
    </Box>
  );
}

export default OTPField;
