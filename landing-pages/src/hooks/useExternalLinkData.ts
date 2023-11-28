import { ExternalLink } from 'server/dist/model/entity/ExternalLink';
import useSWR from 'swr';

export class ExternalLinkError {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export const replaceAmpersandInUrl = (url: string) => {
  return url.replace(/&/g, '%26');
};

const externalLinkGetter = async (externalLinkUrl: string) => {
  const response = await fetch(
    `/safeConfig/entity/ExternalLink?url=${replaceAmpersandInUrl(
      externalLinkUrl
    )}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new ExternalLinkError(status, jsonData.message);
  }

  return jsonData;
};

export function useExternalLinkData(externalLinkUrl?: string) {
  const { data, error, isLoading } = useSWR<ExternalLink, ExternalLinkError>(
    externalLinkUrl,
    externalLinkGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    externalLinkData: data,
    isLoading,
    isError: error,
  };
}
