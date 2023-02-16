import Grid from "@mui/material/Unstable_Grid2";
import LandingPageCategory2 from "./LandingPageCategory2";
import LandingPageSelector from "../LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar2 from "../LandingPageSidebar2";
import { Page } from "server/dist/model/entity/Page";
import Stack from "@mui/material/Stack";
import SelfManagedLink from "../SelfManagedLink";
import WhatsNew from "../WhatsNew";

type Category2Props = {
  pageData: Page;
  getBackgroundImage: () =>
    | string
    | {
        sm: string;
        xs: string;
      };
};
export default function CategoryLayout2({
  pageData,
  getBackgroundImage,
}: Category2Props) {
  const backgroundProps = {
    backgroundImage: getBackgroundImage(),
    backgroundAttachment: "fixed",
    backgroundPosition: "bottom-right",
    backgroundSize: "cover",
    minHeight: "100vh",
    flexWrap: { breakpointsTheme: "wrap", sm: "nowrap" },
  };

  return (
    <Grid
      sx={{
        ...backgroundProps,
      }}
      container
      alignContent="center"
      flexDirection="row"
      margin="auto"
      padding="40px 32px"
      gap="56px"
      flexWrap="nowrap"
    >
      <Grid
        container
        flexWrap="wrap"
        height="fit-content"
        width="300px"
        minWidth="300px"
        margin={{ sm: "-30px 0 0 auto", xs: "auto" }}
      >
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
      <Grid
        container
        direction="column"
        marginRight="auto"
        gap="2rem"
        flexWrap="wrap"
      >
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
          >
            {pageData.categories?.map((category) => (
              <LandingPageCategory2 {...category} key={category.id} />
            ))}
          </Grid>
          <Grid>
            {pageData.sidebar ? (
              <LandingPageSidebar2 {...pageData.sidebar} />
            ) : (
              <div
                style={{ minHeight: 180, minWidth: 280, padding: "24px" }}
              ></div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
