import Grid from "@mui/material/Unstable_Grid2";
import LandingPageCategory from "./LandingPageCategory";
import LandingPageSelector from "../LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar";
import { Page } from "server/dist/model/entity/Page";
import flaineBackgroundImage from "../../../images/background-flaine.svg";
import Stack from "@mui/material/Stack";
import SelfManagedLink from "../SelfManagedLink";

export default function CategoryLayout(pageData: Page) {
  function getBackgroundImage() {
    if (pageData.component.includes("flaineBackground")) {
      return `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),
       url(${flaineBackgroundImage}), 
       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`;
    } else if (pageData.component.includes("garmischBackground")) {
      return `linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`;
    } else {
      return "";
    }
  }

  const backgroundProps = {
    backgroundImage: getBackgroundImage(),
    backgroundAttachment: "fixed",
    backgroundPosition: "bottom-right",
    backgroundSize: "cover",
    minHeight: "100vh",
  };
  // zamiast 2 gridow jeden pod drugim musza byc dwa obok siebie - po lewej
  // whats new costam selector a po prawej content i tytul strony u gory
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
        <Stack spacing={1} direction="column" width="100%">
          <Container style={{ padding: 0, margin: "5px 0 0 0" }}>
            <Breadcrumbs pagePath={pageData.path} />
          </Container>
          <Typography
            variant="h1"
            sx={
              backgroundProps.backgroundImage
                ? { color: "white" }
                : { color: "black" }
            }
          >
            {pageData.title}
          </Typography>
          {pageData.pageSelector && (
            <LandingPageSelector
              pageSelector={pageData.pageSelector}
              labelColor={backgroundProps.backgroundImage ? "white" : "black"}
              key={pageData.pageSelector.id}
            />
          )}
        </Stack>
        <SelfManagedLink
          pagePath={pageData.path}
          backgroundImage={backgroundProps.backgroundImage}
        />
      </Grid>
      <Grid container maxWidth="1330px" width="100%">
        <Grid container xs={9} gap={2}>
          {pageData.categories?.map((category) => (
            <LandingPageCategory {...category} key={category.id} />
          ))}
        </Grid>
        {pageData.sidebar && <LandingPageSidebar {...pageData.sidebar} />}
      </Grid>
    </Grid>
  );
}
