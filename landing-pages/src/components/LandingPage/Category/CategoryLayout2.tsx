import Grid from "@mui/material/Unstable_Grid2";
import LandingPageCategory from "./LandingPageCategory";
import LandingPageSelector from "../LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar";
import { Page } from "server/dist/model/entity/Page";
import flaineBackgroundImage from "../../../images/background-flaine.svg";
import garmischBackgroundImage from "../../../images/background-garmisch.png";
import Stack from "@mui/material/Stack";
import SelfManagedLink from "../SelfManagedLink";
import WhatsNew from "../WhatsNew";

export default function CategoryLayout(pageData: Page) {
  function getBackgroundImage() {
    if (pageData.component.includes("flaineBackground")) {
      return `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),
       url(${flaineBackgroundImage}), 
       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`;
    } else if (pageData.component.includes("garmischBackground")) {
      return `${garmischBackgroundImage}`;
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
      flexDirection="row"
      margin="auto"
      padding="40px 32px"
      gap="56px"
      alignContent="center"
    >
      <Grid minWidth="338px" marginTop="-27px" marginLeft="auto">
        <Stack spacing={1} direction="column" width="100%">
          <Container style={{ padding: 0, margin: "5px 0 0 0" }}>
            <Breadcrumbs pagePath={pageData.path} />
          </Container>
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
        <WhatsNew path={pageData.path} />
      </Grid>
      <Grid container direction="column" marginRight="auto" gap="2rem">
        <Grid marginBottom="16px">
          <Typography
            variant="h1"
            sx={
              backgroundProps.backgroundImage
                ? { color: "white" }
                : { color: "black" }
            }
            style={{ fontWeight: 600, fontSize: "2em" }}
          >
            Welcome to Guidewire Documentation
          </Typography>
          <Typography
            variant="h2"
            sx={
              backgroundProps.backgroundImage
                ? { color: "white" }
                : { color: "black" }
            }
            style={{ fontSize: "14px", marginTop: "8px" }}
          >
            Find guides, API references, tutorials, and more to help you
            implement, adopt, and use Guidewire applications and services.
          </Typography>
        </Grid>
        <Grid container direction="row" gap="56px">
          <Grid
            container
            maxWidth="600px"
            width="100%"
            xs={9}
            columnGap="24px"
            rowGap="32px"
            sx={{
              ".css-dxom85-MuiPaper-root": {
                width: "288px",
                padding: "24px",
              },
              ".css-4041zf-MuiTypography-root": {
                fontSize: "1.25rem",
                fontWeight: "600",
              },
              ".css-aapr8l-MuiDivider-root": {
                width: "100%",
              },
              ".css-1okj3ks-MuiStack-root": {
                spacing: 1,
                fontSize: "0.875rem",
                color: "black",
                "& .css-t4izw9-MuiTypography-root-MuiLink-root": {
                  color: "black",
                  fontWeight: 600,
                  padding: "4px 0px",
                },
              },
            }}
          >
            {pageData.categories?.map((category) => (
              <LandingPageCategory {...category} key={category.id} />
            ))}
          </Grid>
          <Grid
            display="block"
            sx={{
              ".css-4041zf-MuiTypography-root": {
                fontSize: "1.25rem",
                fontWeight: "600",
              },
              ".css-aapr8l-MuiDivider-root": {
                width: "100%",
              },
              ".css-1okj3ks-MuiStack-root": {
                spacing: 1,
                fontSize: "0.875rem",
                color: "black",
                "& .css-t4izw9-MuiTypography-root-MuiLink-root": {
                  color: "black",
                  fontWeight: 600,
                  padding: "4px 0px",
                },
              },
            }}
          >
            {pageData.sidebar && <LandingPageSidebar {...pageData.sidebar} />}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
