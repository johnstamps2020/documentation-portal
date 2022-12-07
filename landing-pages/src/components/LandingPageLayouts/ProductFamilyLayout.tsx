import Grid from "@mui/material/Unstable_Grid2";
import LandingPageCategory from "../LandingPageContainers/LandingPageCategory";
import LandingPageSubject from "../LandingPageContainers/LandingPageSubject";
import LandingPageSelector from "../LandingPageSelector/LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { landingPageTheme } from "../../themes/landingPageTheme";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar/LandingPageSidebar";
import { Page } from "@documentation-portal/dist/model/entity/Page";
import { Paper } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function ProductFamilyLayout(pageData: Page) {
  let className = "cortina";

  if (pageData.path.includes("banff")) {
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
        <Container>
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
      <Grid className="family-product-content">
        {pageData.categories?.map((category) => (
          <LandingPageCategory {...category} key={category.id} />
        ))}
        {pageData.subjects?.map((subject) => (
          <LandingPageSubject {...subject} key={subject.id} />
        ))}
        {pageData.productFamilyItems?.map((item) => (
          <Paper className="product-family-paper">
            <NavLink
              to={item.link || item.pagePath || item.doc?.url}
              style={{
                textDecoration: "none",
                paddingBottom: "10px",
                color: "hsl(196, 100%, 31%)",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              {item.label}
            </NavLink>
          </Paper>
        ))}
      </Grid>
      {pageData.sidebar && <LandingPageSidebar {...pageData.sidebar} />}
    </Grid>
  );
}
