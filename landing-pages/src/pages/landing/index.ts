import { Page } from "server/dist/model/entity/Page";

export type LandingPageProps = {
  pageData: Page;
};

export const baseBackgroundProps = {
  backgroundAttachment: "fixed",
  backgroundPosition: "bottom-right",
  backgroundSize: "cover",
  minHeight: "100vh",
};
