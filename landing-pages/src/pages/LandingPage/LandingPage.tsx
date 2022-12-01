import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Page } from "@documentation-portal/dist/model/entity/Page";
import { useEffect, useState } from "react";
import { landingPageTheme } from "../../themes/landingPageTheme";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CategoryLayout from "../../components/LandingPageLayouts/CategoryLayout";
import SubjectLayout from "../../components/LandingPageLayouts/SubjectLayout";
import ProductFamilyLayout from "../../components/LandingPageLayouts/ProductFamilyLayout";
import { Theme } from "@mui/material";

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
    <Layout
      title={pageData.title}
      searchBoxOptions={{ searchFilters: pageData.searchFilters }}
    >
      <ThemeProvider theme={landingPageTheme}>
        <CssBaseline enableColorScheme />
        {loadingError && (
          <Alert severity="error" variant="filled">
            {loadingError}
          </Alert>
        )}
        {pageData && pageData.categories.length !== 0 && (
          <CategoryLayout {...pageData} />
        )}
        {pageData && pageData.subjects.length !== 0 && (
          <SubjectLayout {...pageData} />
        )}
        {pageData && pageData.productFamilyItems.length !== 0 && (
          <ProductFamilyLayout {...pageData} />
        )}
      </ThemeProvider>
      <Backdrop
        open={loading}
        sx={{
          color: "#fff",
          zIndex: (theme: Theme) => theme.zIndex.drawer + 1
        }}
      />
    </Layout>
  );
}
