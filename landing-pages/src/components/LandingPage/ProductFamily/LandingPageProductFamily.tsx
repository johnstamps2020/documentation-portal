import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { Link as RouterLink } from "react-router-dom";

export default function LandingPageProductFamily(productFamilyItem: {}) {
  return (
    <Paper
      sx={{
        height: "100px",
        width: { xs: "100%", sm: "300px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    ></Paper>
  );
}
