import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { lazy, Suspense } from "react";
import { Theme } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import flaineBackgroundImage from "../../images/background-flaine.svg";
import elysianBackgroundImage from "../../images/background-elysian.svg";
import dobsonBackgroundImage from "../../images/background-dobson.svg";
import cortinaBackgroundImage from "../../images/background-cortina.svg";
import banffBackgroundImage from "../../images/background-banff.svg";
import gradientBackgroundImage from "../../images/background-gradient.svg";
import { LandingPageProps } from "../landing";
import { LandingPageSelectorProps } from "../../components/LandingPage/LandingPageSelector";
import { usePageData } from "../../hooks/usePageData";
import { SidebarProps } from "../../components/LandingPage/LandingPageSidebar2";

export type LandingPageLayoutProps = {
  backgroundProps: {
    backgroundImage: any;
    backgroundAttachment: string;
    backgroundPosition: string;
    backgroundSize: string;
    minHeight: string;
  };
  pageSelector?: LandingPageSelectorProps;
  sidebar?: SidebarProps;
};

export type LandingPageItem = {
  label?: string;
  docId?: string;
  pagePath?: string;
  url?: string;
};

type LazyPageComponent = React.LazyExoticComponent<
  React.ComponentType<LandingPageProps>
>;

export default function LandingPage() {
  const navigate = useNavigate();
  const { pageData, isError, isLoading } = usePageData();

  if (isError?.redirectUrl) {
    navigate(isError.redirectUrl);
  }

  if (pageData?.component?.includes("redirect")) {
    navigate(`/${pageData.component.split(" ")[1]}`);
  }

  if (!pageData) {
    return <></>;
  }

  const PageComponent = lazy(() =>
    import(`../landing/${pageData.path}`)
  ) as LazyPageComponent;

  function getBackgroundImage() {
    if (pageData?.component?.includes("flaineBackground")) {
      return {
        xs: `url(${gradientBackgroundImage})`,
        sm: `linear-gradient(hsla(200, 6%, 10%, .68), hsla(200, 6%, 10%, .68)),
       url(${flaineBackgroundImage}), 
       linear-gradient(152.93deg, #57709B 7.82%, #1E2B43 86.61%)`
      };
    }
    if (pageData?.component?.includes("elysianBackground")) {
      return {
        sm: `url(${elysianBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`
      };
    }
    if (pageData?.component?.includes("dobsonBackground")) {
      return {
        sm: `url(${dobsonBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`
      };
    }
    if (pageData?.component?.includes("cortinaBackground")) {
      return {
        sm: `url(${cortinaBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`
      };
    }
    if (pageData?.component?.includes("banffBackground")) {
      return {
        sm: `url(${banffBackgroundImage}), url(${gradientBackgroundImage})`,
        xs: `url(${gradientBackgroundImage})`
      };
    }
    if (pageData?.component?.includes("aspenBackground")) {
      return `url(${gradientBackgroundImage})`;
    }
    return "";
  }

  return (
    <Layout
      title={pageData.title}
      headerOptions={{ searchFilters: pageData.searchFilters }}
      path={pageData.path}
    >
      <>
        {isError && (
          <Alert severity="error" variant="filled">
            {isError.message}
          </Alert>
        )}
      </>
      <Suspense
        fallback={<Skeleton variant="rounded" width="100%" height="100vh" />}
      >
        <PageComponent title={pageData.title} />
      </Suspense>
      <Backdrop
        open={isLoading}
        sx={{
          color: "#fff",
          zIndex: (theme: Theme) => theme.zIndex.drawer + 1
        }}
      />
    </Layout>
  );
}
