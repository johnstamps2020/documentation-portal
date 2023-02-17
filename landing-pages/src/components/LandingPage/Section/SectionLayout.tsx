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
  function calcSectionHeightInPx() {
    const sectionItemHeight = 32;
    const sectionTitleHeight = 46;
    const gapHeight = 32;
    const additionalPxJustInCase = 20;
    let sum = 0;
    pageData.sections.map((section) => {
      const numberOfSections = section.sectionItems.length;
      sum +=
        numberOfSections * sectionItemHeight +
        sectionTitleHeight +
        gapHeight +
        additionalPxJustInCase;
    });
    return sum / 2;
  }
  const contentHeight = calcSectionHeightInPx();
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
      <Grid minWidth="1332px">
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
          {pageData.pageSelector && (
            <LandingPageSelector
              pageSelector={pageData.pageSelector}
              labelColor="black"
              key={pageData.pageSelector.id}
            />
          )}
        </Stack>
      </Grid>
      <Grid
        container
        direction="column"
        gap="32px"
        alignContent="start"
        maxWidth="950px"
        sx={{ maxHeight: `${contentHeight}px` }}
      >
        {pageData.sections?.map((section) => (
          <LandingPageSection {...section} key={section.id} />
        ))}
      </Grid>
      {pageData && pageData.sidebar && (
        <LandingPageSidebar {...pageData.sidebar} />
      )}
    </Grid>
  );
}
