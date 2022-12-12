import Grid from "@mui/material/Unstable_Grid2";
import LandingPageSelector from "../LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar";
import { Page } from "@documentation-portal/dist/model/entity/Page";
import Stack from "@mui/material/Stack";
import cortinaBackgroundImage from "../../../images/background-cortina.svg";
import banffBackgroundImage from "../../../images/background-banff.svg";
import gradientBackground from "../../../images/background-gradient.svg";
import LandingPageProductFamily from "./LandingPageProductFamily";

export default function ProductFamilyLayout(pageData: Page) {
  function getBackgroundImage() {
    if (pageData.component.includes("aspenBackground")) {
      return `url(${gradientBackground})`;
    } else if (pageData.component.includes("banffBackground")) {
      return `url(${banffBackgroundImage}), url(${gradientBackground})`;
    } else if (pageData.component.includes("cortinaBackground")) {
      return `url(${cortinaBackgroundImage})`;
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
          <Container>
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
      <Grid container maxWidth="1330px" gap={2}>
        <Grid container xs={9} gap={2}>
          {pageData.productFamilyItems?.map(productFamilyItem => (
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
