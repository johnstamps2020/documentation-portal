import Grid from "@mui/material/Unstable_Grid2";
import LandingPageCategory from "../../components/LandingPageContainers/LandingPageCategory";
import LandingPageSelector from "../../components/LandingPageSelector/LandingPageSelector";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { landingPageTheme } from "../../themes/landingPageTheme";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../../components/LandingPageSidebar/LandingPageSidebar";
import { Page } from "@documentation-portal/dist/model/entity/Page";

export default function CategoryLayout(pageData: Page) {
  let className = "elysian";
  if (pageData.path.includes("dobson")) {
    className = "dobson";
  } else if (pageData.path.includes("cortina")) {
    className = "cortina";
  } else if (pageData.path.includes("banff")) {
    className = "banff";
  } else if (pageData.path.includes("aspen")) {
    className = "aspen";
  }

  return (
    <Grid
      className={className}
      {...landingPageTheme.components?.MuiGrid2?.defaultProps}
    >
      <Grid className="page-title">
        <Container className="breadcrumbs" style={{ paddingLeft: 0 }}>
          <Breadcrumbs pagePath={pageData.path} />
        </Container>
        <Typography variant="h1">{pageData.title}</Typography>
        {pageData.pageSelector && (
          <LandingPageSelector
            {...pageData.pageSelector}
            {...landingPageTheme}
            key={pageData.pageSelector.id}
          />
        )}
      </Grid>
      <Grid
        className="category-content"
        {...landingPageTheme.components?.MuiGrid2?.defaultProps}
      >
        {pageData.categories?.map((category) => (
          <LandingPageCategory {...category} key={category.id} />
        ))}
      </Grid>
      {pageData.sidebar && <LandingPageSidebar {...pageData.sidebar} />}
    </Grid>
  );
}
