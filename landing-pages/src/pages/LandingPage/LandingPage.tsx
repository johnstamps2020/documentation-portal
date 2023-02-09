import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Page } from "server/dist/model/entity/Page";
import { useEffect, useState } from "react";
import { Theme } from "@mui/material";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CategoryLayout from "../../components/LandingPage/Category/CategoryLayout";
import SectionLayout from "../../components/LandingPage/Section/SectionLayout";
import ProductFamilyLayout from "../../components/LandingPage/ProductFamily/ProductFamilyLayout";

export default function LandingPage() {
  const navigate = useNavigate();
  const params = useParams();
  const pagePathFromRouter = params["*"] !== "" ? params["*"] : "/";
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
          `/safeConfig/entity/page/data?path=${pagePathFromRouter}`
        );
        if (response.status === 401) {
          return navigate(
            `/gw-login?redirectTo=/landing/${pagePathFromRouter}`
          );
        }
        if (response.status === 403) {
          return navigate(
            `/forbidden?unauthorized=/landing/${pagePathFromRouter}`
          );
        }
        if (response.status !== 200) {
          return navigate(`/404?notFound=/landing/${pagePathFromRouter}`);
        }
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
        if (jsonData.component.includes("redirect")) {
          console.log("redirect", `/${jsonData.component.split(" ")[1]}`);
          return navigate(`/${jsonData.component.split(" ")[1]}`);
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
      headerOptions={{ searchFilters: pageData.searchFilters }}
      path={pageData.path}
    >
      <>
        {loadingError && (
          <Alert severity="error" variant="filled">
            {loadingError}
          </Alert>
        )}
        {pageData && pageData.categories.length !== 0 && (
          <CategoryLayout {...pageData} />
        )}
        {pageData && pageData.sections.length !== 0 && (
          <SectionLayout {...pageData} />
        )}
        {pageData && pageData.productFamilyItems.length !== 0 && (
          <ProductFamilyLayout {...pageData} />
        )}
      </>
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
