import { Page } from "server/dist/model/entity/Page";
import { useParams } from "react-router-dom";
import useSWR from "swr";

export class PageError {
  status: number;
  message: string;
  redirectUrl?: string;
  constructor(status: number, message: string, redirectUrl?: string) {
    this.status = status;
    this.message = message;
    this.redirectUrl = redirectUrl;
  }
}

function getRedirectUrl(requestedPath: string, status: number) {
  switch (status) {
    case 401:
      return `/gw-login?redirectTo=${requestedPath}`;
    case 403:
      return `/internal?restricted=${requestedPath}`;
    case 404:
      return `/404?notFound=${requestedPath}`;
    default:
      break;
  }
}

const pageGetter = async (pagePath: string) => {
  const response = await fetch(`/safeConfig/entity/Page?path=${pagePath}`);
  const requestedPath = pagePath === "/" ? pagePath : `/landing/${pagePath}`;
  const { status } = response;
  const jsonData = await response.json();
  if (!response.ok) {
    throw new PageError(
      status,
      jsonData.message,
      getRedirectUrl(requestedPath, status)
    );
  }

  if (jsonData.path !== pagePath) {
    throw new PageError(
      500,
      `Fetched page data path (${jsonData.path} is different from the page path from router (${pagePath})`
    );
  }

  return jsonData;
};

export function usePagePath() {
  const params = useParams();
  const pagePath: string =
    params["*"] && params["*"] !== "" ? params["*"] : "/";

  return pagePath;
}

export function usePageData() {
  const pagePath = usePagePath();
  const { data, error, isLoading } = useSWR<Page, PageError>(
    pagePath,
    pageGetter
  );

  return {
    pageData: data,
    isLoading,
    isError: error
  };
}
