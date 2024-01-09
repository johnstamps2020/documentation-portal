import { ExternalLink } from 'server/dist/model/entity/ExternalLink';
import { Language } from 'server/dist/model/entity/Language';
import { Platform } from 'server/dist/model/entity/Platform';
import { Product } from 'server/dist/model/entity/Product';
import { Release } from 'server/dist/model/entity/Release';
import { Resource } from 'server/dist/model/entity/Resource';
import { Source } from 'server/dist/model/entity/Source';
import { Subject } from 'server/dist/model/entity/Subject';
import { Version } from 'server/dist/model/entity/Version';
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
  const response = await fetch(`/safeConfig/entity/Source?id=${sourceId}`);
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

const resourceGetter = async (resourceId: string) => {
  const response = await fetch(
    `/safeConfig/entity/Resource/relations?id=${resourceId}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useResourceData(resourceId?: string) {
  const { data, error, isLoading } = useSWR<Resource, Error>(
    resourceId,
    resourceGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    resourceData: data,
    isLoading,
    isError: error,
  };
}

const releaseGetter = async (releaseName: string) => {
  const response = await fetch(
    `/safeConfig/entity/Release?name=${releaseName}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useReleaseData(releaseName?: string) {
  const { data, error, isLoading } = useSWR<Release, Error>(
    releaseName,
    releaseGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    releaseData: data,
    isLoading,
    isError: error,
  };
}

const subjectGetter = async (subjectName: string) => {
  const response = await fetch(
    `/safeConfig/entity/Subject?name=${subjectName}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useSubjectData(subjectName?: string) {
  const { data, error, isLoading } = useSWR<Subject, Error>(
    subjectName,
    subjectGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    subjectData: data,
    isLoading,
    isError: error,
  };
}

const languageGetter = async (languageCode: string) => {
  const response = await fetch(
    `/safeConfig/entity/Language?code=${languageCode}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useLanguageData(languageCode?: string) {
  const { data, error, isLoading } = useSWR<Language, Error>(
    languageCode,
    languageGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    languageData: data,
    isLoading,
    isError: error,
  };
}


const productGetter = async (productName: string) => {
  const response = await fetch(
    `/safeConfig/entity/Product?name=${productName}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useProductData(productName?: string) {
  const { data, error, isLoading } = useSWR<Product, Error>(
    productName,
    productGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    productData: data,
    isLoading,
    isError: error,
  };
}


const platformGetter = async (platformName: string) => {
  const response = await fetch(
    `/safeConfig/entity/Platform?name=${platformName}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function usePlatformData(platformName?: string) {
  const { data, error, isLoading } = useSWR<Platform, Error>(
    platformName,
    platformGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    platformData: data,
    isLoading,
    isError: error,
  };
}


const versionGetter = async (versionName: string) => {
  const response = await fetch(
    `/safeConfig/entity/Version?name=${versionName}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useVersionData(versionName?: string) {
  const { data, error, isLoading } = useSWR<Version, Error>(
    versionName,
    versionGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    versionData: data,
    isLoading,
    isError: error,
  };
}