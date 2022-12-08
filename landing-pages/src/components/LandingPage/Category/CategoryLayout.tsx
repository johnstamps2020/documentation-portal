import Grid from "@mui/material/Unstable_Grid2";
import LandingPageCategory from "./LandingPageCategory";
import LandingPageSelector from "../LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar";
import { Page } from "@documentation-portal/dist/model/entity/Page";
import elysianBackgroundImage from "../../../images/background-elysian.svg";
import dobsonBackgroundImage from "../../../images/background-dobson.svg";
import Stack from "@mui/material/Stack";

export default function CategoryLayout(pageData: Page) {
  function getBackgroundImage() {
    if (pageData.component.includes("dobsonBackground")) {
      return `url(${dobsonBackgroundImage})`;
    } else if (pageData.component.includes("elysianBackground")) {
      return `url(${elysianBackgroundImage})`;
    } else {
      return "";
    }
  }

  const backgroundProps = {
    backgroundImage: getBackgroundImage(),
    backgroundAttachment: "fixed",
    backgroundPosition: "bottom-right",
    backgroundSize: "cover",
    minHeight: "100vh"
  };

  return (
    <Grid
      sx={{ ...backgroundProps }}
      container
      flexDirection="column"
      margin="auto"
      padding="0 20px 64px 20px"
      gap={5}
      alignContent="center"
    >
      <Grid>
        <Stack spacing={2} direction="column" width="100%">
          <Container style={{ padding: 0, margin: "30px 0 0 0" }}>
            <Breadcrumbs pagePath={pageData.path} />
          </Container>
          <Typography variant="h1">{pageData.title}</Typography>
          {pageData.pageSelector && (
            <LandingPageSelector
              pageSelector={pageData.pageSelector}
              labelColor="white"
              key={pageData.pageSelector.id}
            />
          )}
        </Stack>
      </Grid>
      <Grid container maxWidth="1330px">
        <Grid container xs={9} gap={2}>
          {pageData.categories?.map(category => (
            <LandingPageCategory {...category} key={category.id} />
          ))}
        </Grid>
        {pageData.sidebar && <LandingPageSidebar {...pageData.sidebar} />}
      </Grid>
    </Grid>
  );
}
