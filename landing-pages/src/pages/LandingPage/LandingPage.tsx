import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Page } from "server/dist/model/entity/Page";
import { useEffect, useState } from "react";
import { Theme } from "@mui/material";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CategoryLayout from "../../components/LandingPage/Category/CategoryLayout";
import CategoryLayout2 from "../../components/LandingPage/Category/CategoryLayout2";
import SectionLayout from "../../components/LandingPage/Section/SectionLayout";
import ProductFamilyLayout from "../../components/LandingPage/ProductFamily/ProductFamilyLayout";
import garmischBackgroundImage from "../../images/background-garmisch.png";
import flaineBackgroundImage from "../../images/background-flaine.svg";
import elysianBackgroundImage from "../../images/background-elysian.svg";
import dobsonBackgroundImage from "../../images/background-dobson.svg";
import cortinaBackgroundImage from "../../images/background-cortina.svg";
import banffBackgroundImage from "../../images/background-banff.svg";
import gradientBackgroundImage from "../../images/background-gradient.svg";

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
        const requestedPath =
          pagePathFromRouter === "/"
            ? pagePathFromRouter
            : `/landing/${pagePathFromRouter}`;
        if (response.status === 401) {
          return navigate(`/gw-login?redirectTo=${requestedPath}`);
        }
        if (response.status === 403) {
          return navigate(`/internal?restricted=${requestedPath}`);
        }
        if (response.status !== 200) {
          return navigate(`/404?notFound=${requestedPath}`);
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
        if (jsonData?.component?.includes("redirect")) {
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
  }, [pagePathFromRouter, navigate]);

  if (!pageData) {
    return null;
  }

  function getBackgroundImage() {
    if (pageData?.component?.includes("garmischBackground")) {
      return {
        xs: `url(${gradientBackgroundImage})`,
        sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)), 
      url(${garmischBackgroundImage}), 
      linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
      };
    }
    if (pageData?.component?.includes("flaineBackground")) {
      return {
        xs: `url(${gradientBackgroundImage})`,
        sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),
       url(${flaineBackgroundImage}), 
       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`,
      };
    }
    if (pageData?.component?.includes("elysianBackground")) {
      return {
        sm: `url(${elysianBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`,
      };
    }
    if (pageData?.component?.includes("dobsonBackground")) {
      return {
        sm: `url(${dobsonBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`,
      };
    }
    if (pageData?.component?.includes("cortinaBackground")) {
      return {
        sm: `url(${cortinaBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`,
      };
    }
    if (pageData?.component?.includes("banffBackground")) {
      return {
        sm: `url(${banffBackgroundImage}), url(${gradientBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`,
      };
    }
    if (pageData?.component?.includes("aspenBackground")) {
      return `url(${gradientBackgroundImage})`;
    }
    return "";
  }

  const backgroundProps = {
    backgroundImage: getBackgroundImage(),
    backgroundAttachment: "fixed",
    backgroundPosition: "bottom-right",
    backgroundSize: "cover",
    minHeight: "100vh",
  };

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
        {pageData &&
          pageData.categories.length !== 0 &&
          (pageData.component?.includes("pageCategory2") ? (
            <CategoryLayout2
              pageData={pageData}
              backgroundProps={backgroundProps}
            />
          ) : (
            <CategoryLayout
              pageData={pageData}
              backgroundProps={backgroundProps}
            />
          ))}

        {pageData && pageData.sections.length !== 0 && (
          <SectionLayout {...pageData} />
        )}
        {pageData && pageData.productFamilyItems.length !== 0 && (
          <ProductFamilyLayout
            pageData={pageData}
            backgroundProps={backgroundProps}
          />
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
