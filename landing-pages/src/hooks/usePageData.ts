import { Page } from 'server/dist/model/entity/Page';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

export class PageError {
  status: number;
  message: string;
  redirect?: Redirect;

  constructor(status: number, message: string, redirect?: Redirect) {
    this.status = status;
    this.message = message;
    this.redirect = redirect;
  }
}

class Redirect {
  type: string;
  url: string;

  constructor(type: 'external' | 'internal', url: string) {
    this.type = type;
    this.url = url;
  }
}

function getRedirectUrl(
  requestedPath: string,
  status: number
): Redirect | undefined {
  switch (status) {
    case 401:
      return new Redirect('internal', `/gw-login?redirectTo=${requestedPath}`);
    case 403:
      return new Redirect('internal', `/internal?restricted=${requestedPath}`);
    case 404 || 406:
      return new Redirect('external', `/redirect?cameFrom=${requestedPath}`);
    default:
      break;
  }
}

const pageGetter = async (pagePath: string) => {
  const response = await fetch(`/safeConfig/entity/Page?path=${pagePath}`);
  const requestedPath = pagePath === '/' ? pagePath : `/${pagePath}`;
  const { status } = response;
  const jsonData = await response.json();
  if (!response.ok) {
    const redirectUrl = getRedirectUrl(requestedPath, status);
    throw new PageError(status, jsonData.message, redirectUrl);
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
    params['*'] && params['*'] !== '' ? params['*'] : '/';

  return pagePath;
}

export function usePageData(pagePath?: string) {
  const currentPagePath = usePagePath();
  const targetPagePath = pagePath ? pagePath : currentPagePath;
  const { data, error, isLoading } = useSWR<Page, PageError>(
    targetPagePath,
    pageGetter
  );

  return {
    pageData: data,
    isLoading,
    isError: error,
  };
}
