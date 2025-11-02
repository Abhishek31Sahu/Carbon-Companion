// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          minWidth: 235,
          backgroundColor: "#ffffff",
          "& .MuiOutlinedInput-root": {
            borderRadius: 8, // MUI spacing scale * 4
          },
          "& .MuiInputLabel-root": {
            color: "#388e3c",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#a5d6a7",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#66bb6a",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#388e3c",
          },
        },
      },
    },
  },
});

export default theme;
