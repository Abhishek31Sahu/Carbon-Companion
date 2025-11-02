import axios from "axios";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
// import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
// import ForgotPassword from "./components/ForgotPassword";
// import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "./ColorModeSelect";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../utils";
// import {
//   GoogleIcon,
//   FacebookIcon,
//   SitemarkIcon,
// } from "./components/CustomIcons";

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

function SignUp(props) {
  let [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  let [errors, setErrors] = useState({ username: "", email: "", password: "" });

  const handleChange = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const validateInputs = () => {
    let isValid = true;
    let tempErrors = {};
    if (!formValues.username.trim()) {
      tempErrors.username = "Please enter a valid username";
      isValid = false;
    }
    if (!formValues.email || !/\S+@\S+\.\S+/.test(formValues.email)) {
      tempErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formValues.password || formValues.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;
    console.log(formValues);
    try {
      const result = await axios.post(
        "http://localhost:5000/api/register",
        formValues,
        {
          headers: { "Content-Type": "application/json" },
        },
        {
          withCredentials: true,
        }
      );

      const { success, message, jwtToken, name, error } = result.data;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
      } else if (error) {
        console.log(error);
        handleError(error);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      console.error(err);
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
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <TextField
              type="text"
              name="username"
              value={formValues.username}
              placeholder="@username"
              onChange={(e) => handleChange("username", e.target.value)}
              error={Boolean(errors.username)}
              helperText={errors.username}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              type="email"
              name="email"
              value={formValues.email}
              placeholder="yah@gyu.com"
              onChange={(e) => handleChange("email", e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={Boolean(errors.password)}
              helperText={errors.password}
              placeholder="••••••"
              type="password"
              name="password"
              onChange={(e) => handleChange("password", e.target.value)}
              // autoComplete="current-password"
              value={formValues.password}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
          <Button type="submit" fullWidth variant="contained">
            Sign up
          </Button>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ textAlign: "center" }}>
            you have an account?{" "}
            <Link
              href="http://localhost:3000/login"
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
      <ToastContainer />
    </SignInContainer>
  );
}
export default SignUp;
