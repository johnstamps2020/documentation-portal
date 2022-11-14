import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Page } from "@documentation-portal/dist/model/entity/Page";
import Grid from "@mui/material/Unstable_Grid2";
import LandingPageItem from "../../components/LandingPageItems/LandingPageItem";
import { useEffect, useState } from "react";
import LandingPageCategory from "../../components/LandingPageContainers/LandingPageCategory";
import LandingPageSubject from "../../components/LandingPageContainers/LandingPageSubject";
import LandingPageSelector from "../../components/LandingPageSelector/LandingPageSelector";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { landingPageTheme } from "../../themes/landingPageTheme";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";

export default function LandingPage() {
  const params = useParams();
  const pagePathFromRouter = params["*"];
  const [pageData, setPageData] = useState<Page>();
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    async function getPageData() {
      try {
        setLoading(true);
        const response = await fetch(
          `/safeConfig/entity/Page?path=${pagePathFromRouter}`
        );
        if (!response.ok) {
          const errorJson = await response.json();
          const { status } = response;
          const { message } = errorJson;
          throw new Error(
            `Cannot fetch page data for ${pagePathFromRouter}, status: ${status}, message: ${message}`
          );
        }
        const jsonData: Page = await response.json();
        if (jsonData.path !== pagePathFromRouter) {
          throw new Error(
            `Fetched page data path (${jsonData.path} is different from the page path from router (${pagePathFromRouter})`
          );
        }
        setPageData(jsonData);
      } catch (err) {
        setLoadingError(`Error loading page: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    getPageData().catch(console.error);
  }, [pagePathFromRouter]);

  if (!pageData) {
    return null;
  }

  return (
    <Layout title={pageData.title} searchFilters={pageData.searchFilters}>
      <ThemeProvider theme={landingPageTheme}>
        <CssBaseline enableColorScheme />
        {loadingError && (
          <Alert severity="error" variant="filled">
            {loadingError}
          </Alert>
        )}
        {pageData && (
          <Grid {...landingPageTheme.components?.MuiGrid?.defaultProps}>
            <Grid container marginLeft={30} marginBottom={10}>
              {pageData.pageSelector && (
                <LandingPageSelector
                  {...pageData.pageSelector}
                  key={pageData.pageSelector.id}
                />
              )}
              <Grid xs={12}>
                <Breadcrumbs pagePath={pageData.path} />
                <Typography variant="h1">{pageData.title}</Typography>
              </Grid>
              {pageData.categories?.map(category => (
                <LandingPageCategory {...category} key={category.id} />
              ))}
              {pageData.subjects?.map(subject => (
                <LandingPageSubject {...subject} key={subject.id} />
              ))}
              {pageData.productFamilyItems?.map(item => (
                <LandingPageItem {...item} key={item.id} />
              ))}
            </Grid>
          </Grid>
        )}
      </ThemeProvider>
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
      />
    </Layout>
  );
}
