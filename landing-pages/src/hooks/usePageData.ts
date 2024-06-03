import { Page } from '@doctools/components';
import { RedirectResponseBody } from '@doctools/server';
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
    case 404:
      return new Redirect('internal', `/404?notFound=${requestedPath}`);
    case 406:
      return new Redirect('internal', `/404?notFound=${requestedPath}`);
    default:
      break;
  }
}

const pageGetter = async (pagePath: string) => {
  const redirectResponse = await fetch(`/redirect?cameFrom=${pagePath}`);

  if (redirectResponse.ok) {
    const redirectResponseBody: RedirectResponseBody =
      await redirectResponse.json();
    if (redirectResponseBody.redirectUrl) {
      throw new PageError(
        redirectResponseBody.redirectStatusCode,
        'Redirect found on server',
        new Redirect('external', redirectResponseBody.redirectUrl)
      );
    }
  }
  const response = await fetch(`/safeConfig/entity/Page?path=${pagePath}`);
  const requestedPath = `/${pagePath}`;
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

export function usePageData(pagePath?: string) {
  const reactRouterParams = useParams();
  const currentPagePath = reactRouterParams['*'] || '/';
  const targetPagePath = pagePath || currentPagePath;
  const targetPagePathWithoutTrailingSlash = targetPagePath.replace(
    /(.)\/$/,
    '$1'
  );
  const { data, error, isLoading } = useSWR<Page, PageError>(
    targetPagePathWithoutTrailingSlash,
    pageGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    pageData: data,
    isLoading,
    isError: error,
  };
}
