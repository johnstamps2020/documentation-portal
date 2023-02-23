import Grid from "@mui/material/Unstable_Grid2";
import LandingPageSection from "./LandingPageSection";
import LandingPageSelector from "../LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar";
import { Page } from "server/dist/model/entity/Page";
import Stack from "@mui/material/Stack";
import SelfManagedLink from "../SelfManagedLink";

export default function SectionLayout(pageData: Page) {
  return (
    <Grid
      container
      flexDirection="column"
      margin="auto"
      padding="0 20px 64px 20px"
      gap={5}
      alignContent="center"
      sx={{
        minHeight: "100vh"
      }}
    >
      <Grid>
        <Stack spacing={1} direction="column" width="100%">
          <SelfManagedLink pagePath={pageData.path} backgroundImage="" />
          <Container style={{ padding: 0, margin: "5px 0 0 0" }}>
            <Breadcrumbs pagePath={pageData.path} />
          </Container>
          <Typography
            sx={{
              fontSize: "2em",
              textAlign: "left",
              color: "black",
              fontWeight: 600,
              marginTop: 0
            }}
          >
            {pageData.title}
          </Typography>
        </Stack>
      </Grid>
      <Grid container alignItems="baseline" gap={5} maxWidth="1100px"></Grid>
    </Grid>
  );
}
