import { ExternalLink } from 'server/dist/model/entity/ExternalLink';
import { Source } from 'server/dist/model/entity/Source';
import useSWR from 'swr';

export class Error {
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
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useExternalLinkData(externalLinkUrl?: string) {
  const { data, error, isLoading } = useSWR<ExternalLink, Error>(
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

const sourceGetter = async (sourceId: string) => {
  const response = await fetch(
    `/safeConfig/entity/Source?id=${sourceId}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useSourceData(sourceId?: string) {
  const { data, error, isLoading } = useSWR<Source, Error>(
    sourceId,
    sourceGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    sourceData: data,
    isLoading,
    isError: error,
  };
}
