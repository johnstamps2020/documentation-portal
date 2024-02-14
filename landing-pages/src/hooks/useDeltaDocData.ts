import useSWR from 'swr';
import { Error } from './useEntitiesData';
import { DeltaDocResultType, DeltaDocInputType } from '@doctools/server';

const deltaDocDataGetter = async ({
  releaseA,
  releaseB,
  url,
}: DeltaDocInputType) => {
  const response = await fetch(
    `/delta/results?releaseA=${releaseA}&releaseB=${releaseB}&url=${url}`
  );
  const { status } = response;
  const jsonData = await response.json();

  if (!response.ok) {
    throw new Error(status, jsonData.message);
  }

  return jsonData;
};

export function useDeltaDocData({
  releaseA,
  releaseB,
  url,
}: DeltaDocInputType) {
  const { data, error, isLoading } = useSWR<DeltaDocResultType[][], Error>(
    { releaseA, releaseB, url },
    deltaDocDataGetter,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    deltaDocData: data,
    isLoading,
    isError: error,
  };
}
