import Grid from "@mui/material/Unstable_Grid2";
import LandingPageSelector from "../LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar";
import { Page } from "server/dist/model/entity/Page";
import Stack from "@mui/material/Stack";
import cortinaBackgroundImage from "../../../images/background-cortina.svg";
import banffBackgroundImage from "../../../images/background-banff.svg";
import gradientBackground from "../../../images/background-gradient.svg";
import LandingPageProductFamily from "./LandingPageProductFamily";
import SelfManagedLink from "../SelfManagedLink";

export default function ProductFamilyLayout(pageData: Page) {
  function getBackgroundImage() {
    if (pageData.component?.includes("aspenBackground")) {
      return `url(${gradientBackground})`;
    } else if (pageData.component?.includes("banffBackground")) {
      return {
        sm: `url(${banffBackgroundImage}), url(${gradientBackground})`,
        xs: `url(${gradientBackground})`,
      };
    } else if (pageData.component?.includes("cortinaBackground")) {
      return {
        sm: `url(${cortinaBackgroundImage})`,
        xs: `url(${gradientBackground})`,
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
      <Grid>
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
              labelColor="white"
              key={pageData.pageSelector.id}
            />
          )}
        </Stack>
      </Grid>
      <Grid container width="100%" maxWidth="1330px" gap={2}>
        <Grid container sm={12} md={9} gap={2}>
          {pageData.productFamilyItems?.map((productFamilyItem) => (
            <LandingPageProductFamily
              {...productFamilyItem}
              key={productFamilyItem.id}
            />
          ))}
        </Grid>
        {pageData.sidebar && <LandingPageSidebar {...pageData.sidebar} />}
      </Grid>
    </Grid>
  );
}
