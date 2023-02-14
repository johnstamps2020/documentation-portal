import Grid from "@mui/material/Unstable_Grid2";
import LandingPageCategory from "./LandingPageCategory";
import LandingPageSelector from "../LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar";
import { Page } from "server/dist/model/entity/Page";
import elysianBackgroundImage from "../../../images/background-elysian.svg";
import dobsonBackgroundImage from "../../../images/background-dobson.svg";
import gradientBackgroundImage from "../../../images/background-gradient.svg";
import Stack from "@mui/material/Stack";
import SelfManagedLink from "../SelfManagedLink";
import Paper from "@mui/material/Paper";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

export default function CategoryLayout(pageData: Page) {
  function getBackgroundImage() {
    if (pageData?.component?.includes("dobsonBackground")) {
      return {
        sm: `url(${dobsonBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`,
      };
    } else if (pageData.component?.includes("elysianBackground")) {
      return {
        sm: `url(${elysianBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`,
      };
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
      <Grid gap="2rem">
        <Stack spacing={1} direction="column" width="100%">
          <SelfManagedLink
            pagePath={pageData.path}
            backgroundImage={backgroundProps.backgroundImage}
          />
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
        {pageData.path.includes("cloudProducts/elysian") && (
          <Paper
            sx={{
              maxWidth: { md: "932px", sm: "100%" },
              marginTop: "32px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <Link
              component={RouterLink}
              to="/cloudProducts/elysian/whatsnew"
              sx={{
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "hsl(196, 100%, 31%);",
              }}
            >
              What's new in Elysian
            </Link>
          </Paper>
        )}
      </Grid>
      <Grid container maxWidth="1330px" width="100%" gap={6}>
        <Grid
          container
          xs={9}
          gap={2}
          sx={{ width: { xs: "100%", sm: "fit-content" } }}
        >
          {pageData.categories?.map((category) => (
            <LandingPageCategory {...category} key={category.id} />
          ))}
        </Grid>
        {pageData.sidebar && <LandingPageSidebar {...pageData.sidebar} />}
      </Grid>
    </Grid>
  );
}
