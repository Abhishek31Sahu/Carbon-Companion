import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Box, Button } from "@mui/material";
import React from "react";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
function PhoneField({ flag, getOTP }) {
  const [number, setNumber] = React.useState(null);
  //   console.log(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!number) {
      handleError("Enter the phoneNumber");
      return;
    }
    getOTP(number);
    console.log(number);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: !flag ? "flex" : "none",
        flexDirection: "column",
        width: "100%",
        gap: 2,
      }}
    >
      <PhoneInput
        defaultCountry="IN"
        value={number}
        onChange={setNumber}
        placeholder="Enter Phone Number"
      />
      <div id="recaptcha-container"></div>
      <Button type="submit" fullWidth variant="contained">
        Send OTP
      </Button>
      <ToastContainer />
    </Box>
  );
}

export default PhoneField;
