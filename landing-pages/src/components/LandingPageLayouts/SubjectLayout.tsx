import Grid from "@mui/material/Unstable_Grid2";
import LandingPageSubject from "../LandingPageContainers/LandingPageSubject";
import LandingPageSelector from "../LandingPageSelector/LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar/LandingPageSidebar";
import { Page } from "@documentation-portal/dist/model/entity/Page";
import { twoColumnsTheme } from "../../themes/twoColumnsTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";

export default function SubjectLayout(pageData: Page) {
  return (
    <ThemeProvider theme={twoColumnsTheme}>
      <CssBaseline enableColorScheme />
      <Grid {...twoColumnsTheme.components?.MuiGrid2?.defaultProps}>
        <Grid
          xs={12}
          sx={{ textAlign: "left", width: "100%", marginTop: "100px" }}
        >
          <Container sx={{ p: 0, ml: 0, mr: "auto" }}>
            <Breadcrumbs pagePath={pageData.path} />
          </Container>
          <Typography variant="h1">{pageData.title}</Typography>
          {pageData.pageSelector && (
            <LandingPageSelector
              {...pageData.pageSelector}
              {...twoColumnsTheme}
              key={pageData.pageSelector.id}
            />
          )}
        </Grid>
        <Grid
          container
          marginBottom={10}
          marginTop={"32px"}
          maxWidth={"1100px"}
        >
          {pageData.subjects?.map((subject) => (
            <LandingPageSubject {...subject} key={subject.id} />
          ))}
        </Grid>
        {pageData && pageData.sidebar && (
          <LandingPageSidebar {...pageData.sidebar} />
        )}
      </Grid>
    </ThemeProvider>
  );
}
