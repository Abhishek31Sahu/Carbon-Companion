import { useState } from "react";
import { Stack, styled, Typography } from "@mui/material";
import MuiCard from "@mui/material/Card";
import OTPField from "./OTPField";
import PhoneField from "./PhoneField";
import ColorModeSelect from "./ColorModeSelect";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import setUpRecaptha from "../UserAuthContext";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));
const PhoneNumberLogin = () => {
  const [flag, setFlag] = useState(false);
  const [result, setResult] = useState(null);
  const getOTP = async (number) => {
    try {
      const result = await setUpRecaptha(number);
      setResult(result);
      handleSuccess("OTP Send Successfully");
      setFlag(true);
    } catch (err) {
      handleError(err.message);
    }
  };
  const verifyOTP = (otp) => {
    try {
      const res = result.confirm(otp);
      handleSuccess("User Logged in Successfully");
      console.log(res);
    } catch (err) {
      handleError(err.message);
    }
  };
  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign in with Phone Number
        </Typography>

        <PhoneField flag={flag} getOTP={getOTP} />
        
        <OTPField flag={flag} verifyOTP={verifyOTP} />
      </Card>
      <ToastContainer />
    </SignInContainer>
  );
};

export default PhoneNumberLogin;

// import { RecaptchaVerifier } from "firebase/auth";
// import {auth} from "../FireBase";

// auth.languageCode = 'it';
// // To apply the default browser preference instead of explicitly setting it.
// // auth.useDeviceLanguage();

// window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
