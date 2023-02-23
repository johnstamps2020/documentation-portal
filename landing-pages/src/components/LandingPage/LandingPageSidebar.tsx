import Stack from "@mui/material/Stack";
import LandingPageItem from "./LandingPageItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

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
      <Typography variant="h2">Dummy label</Typography>
      <Stack spacing={1}></Stack>
    </Paper>
  );
}
