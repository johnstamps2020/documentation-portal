import Stack from "@mui/material/Stack";
import LandingPageItem2 from "./LandingPageItem2";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

export default function LandingPageSidebar(sidebar: {}) {
  return (
    <Paper
      sx={{
        height: "fit-content",
        minHeight: "180px",
        minWidth: "270px",
        width: {
          sm: "fit-content",
          xs: "100%"
        },
        padding: "24px"
      }}
    >
      <Typography variant="h2" sx={{ fontSize: "1.25rem", fontWeight: "600" }}>
        Dummy label
      </Typography>
      <Divider />
      <Stack
        spacing={1}
        sx={{ spacing: 1, fontSize: "0.875rem", color: "black" }}
      ></Stack>
    </Paper>
  );
}
