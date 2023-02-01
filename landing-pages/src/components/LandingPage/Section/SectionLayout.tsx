import Grid from "@mui/material/Unstable_Grid2";
import LandingPageSection from "./LandingPageSection";
import LandingPageSelector from "../LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar";
import { Page } from "server/dist/model/entity/Page";
import Stack from "@mui/material/Stack";

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
        <Stack spacing={2} direction="column" width="100%">
          <Container style={{ padding: 0, margin: "30px 0 0 0" }}>
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
          {pageData.pageSelector && (
            <LandingPageSelector
              pageSelector={pageData.pageSelector}
              labelColor="black"
              key={pageData.pageSelector.id}
            />
          )}
        </Stack>
      </Grid>
      <Grid container alignItems="baseline" gap={5} maxWidth="1100px">
        {pageData.sections?.map(section => (
          <LandingPageSection {...section} key={section.id} />
        ))}
      </Grid>
      {pageData && pageData.sidebar && (
        <LandingPageSidebar {...pageData.sidebar} />
      )}
    </Grid>
  );
}
