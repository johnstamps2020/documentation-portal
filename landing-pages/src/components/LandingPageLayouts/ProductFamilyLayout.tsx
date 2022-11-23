import Grid from "@mui/material/Unstable_Grid2";
import LandingPageItem from "../LandingPageItems/LandingPageItem";
import LandingPageCategory from "../LandingPageContainers/LandingPageCategory";
import LandingPageSubject from "../LandingPageContainers/LandingPageSubject";
import LandingPageSelector from "../LandingPageSelector/LandingPageSelector";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { landingPageTheme } from "../../themes/landingPageTheme";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LandingPageSidebar from "../LandingPageSidebar/LandingPageSidebar";
import { Page } from "@documentation-portal/dist/model/entity/Page";

export default function CategoryLayout(pageData: Page) {
    return (
    <Grid {...landingPageTheme.components?.MuiGrid?.defaultProps}>
        <Grid xs={12} sx={{ textAlign: "left", width: "100%" }}>
          <Container>
            <Breadcrumbs pagePath={pageData.path} />
          </Container>
          <Typography variant="h1">{pageData.title}</Typography>
          {pageData.pageSelector && (
            <LandingPageSelector
              {...pageData.pageSelector}
              key={pageData.pageSelector.id}
            />
          )}
        </Grid>
        <Grid container marginBottom={10} maxWidth={"1000px"}>
          {pageData.categories?.map((category) => (
            <LandingPageCategory {...category} key={category.id} />
          ))}
          {pageData.subjects?.map((subject) => (
            <LandingPageSubject {...subject} key={subject.id} />
          ))}
          {pageData.productFamilyItems?.map((item) => (
            <LandingPageItem {...item} key={item.id} />
          ))}
        </Grid>
        <LandingPageSidebar {...pageData.sidebar} />
      </Grid>
      )
}