import LandingPageItem from "../LandingPageItems/LandingPageItem";
import { Subject } from "@documentation-portal/dist/model/entity/Subject";
import Stack from "@mui/material/Stack/Stack";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { landingPageTheme } from "../../themes/landingPageTheme";
import { ThemeProvider } from "@mui/material";

export default function LandingPageSubject(subject: Subject) {
  return (
    <ThemeProvider theme={landingPageTheme}>
      <CssBaseline enableColorScheme />
      <Typography variant="h2">{subject.label}</Typography>
      <Stack spacing={1}>
        {subject.subjectItems.map(subjectItem => (
          <LandingPageItem {...subjectItem} key={subjectItem.id} />
        ))}
      </Stack>
    </ThemeProvider>
  );
}
