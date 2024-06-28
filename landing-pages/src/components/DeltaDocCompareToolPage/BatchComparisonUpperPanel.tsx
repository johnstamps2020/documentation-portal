import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {
  useProductsNoRevalidation,
  useReleasesNoRevalidation,
} from 'hooks/useApi';
import { useDocsByProduct } from 'hooks/useDeltaDocData';
import { useEffect, useState } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocLoading from './DeltaDocLoading';
import { removeDuplicates } from './DeltaDocUpperPanel';
import { DeltaDocInputType, Release } from '@doctools/server';

export default function BatchComparisonUpperPanel() {
  const {
    setBatchFormState,
    setBatchProduct,
    setFormState,
    batchProduct,
    releaseA,
    releaseB,
    setReleaseA,
    setReleaseB,
    isBatchLoading,
  } = useDeltaDocContext();
  const [productName, setProductName] = useState<string>(batchProduct);
  const [canSubmit, setCanSubmit] = useState(false);
  const [batchError, setBatchError] = useState(false);
  const { products, isLoading, isError } = useProductsNoRevalidation();
  const {
    docs,
    isLoading: isLoadingDocs,
    isError: isErrorDocs,
  } = useDocsByProduct(productName);
  const {
    releases,
    isLoading: isLoadingReleases,
    isError: isErrorReleases,
  } = useReleasesNoRevalidation();
  const [tmpFirstRelease, setTmpFirstRelease] = useState<Release | undefined>(
    () =>
      releases?.find(
        (r) => r.name === releaseA.sort((a, b) => b.localeCompare(a))[0]
      )
  );
  const [tmpSecondRelease, setTmpSecondRelease] = useState<Release | undefined>(
    () =>
      releases?.find(
        (r) => r.name === releaseB.sort((a, b) => b.localeCompare(a))[0]
      )
  );
  const filteredDocs =
    docs && releases ? removeDuplicates(docs, releases) : docs;

  useEffect(() => {
    if (productName && tmpFirstRelease && tmpSecondRelease) {
      if (isErrorDocs || isErrorReleases || isError || batchError) {
        setCanSubmit(false);
      } else {
        setCanSubmit(true);
      }
    }
  }, [
    productName,
    tmpFirstRelease,
    tmpSecondRelease,
    docs,
    isErrorDocs,
    isErrorReleases,
    isError,
    filteredDocs?.length,
    batchError,
  ]);

  if (
    (!releases || !products) &&
    (isLoading || isLoadingReleases || isLoadingDocs)
  ) {
    return <DeltaDocLoading />;
  }

  if (!releases || !products) {
    return <></>;
  }

  function handleSubmit() {
    if (
      !docs ||
      !filteredDocs ||
      !tmpFirstRelease ||
      !tmpSecondRelease ||
      !releases
    ) {
      return;
    }

    const batch: DeltaDocInputType[] = filteredDocs.reduce(
      (acc: DeltaDocInputType[], doc) => {
        const firstDoc = docs.find(
          (d) =>
            d.title === doc.title &&
            d.releases?.some(
              (r) =>
                tmpFirstRelease.name === r.name &&
                tmpSecondRelease.name !== r.name
            )
        );
        const secondDoc = docs.find(
          (d) =>
            d.title === doc.title &&
            d.releases?.some(
              (r) =>
                tmpSecondRelease.name === r.name &&
                tmpFirstRelease.name !== r.name
            )
        );

        if (firstDoc && secondDoc) {
          acc.push({
            firstDocId: firstDoc.id,
            secondDocId: secondDoc.id,
          });
        }

        return acc;
      },
      []
    );
    setFormState({
      firstDocId: '',
      secondDocId: '',
    });
    if (batch.length > 0) {
      setReleaseA([tmpFirstRelease.name]);
      setReleaseB([tmpSecondRelease.name]);
      setBatchFormState(batch);
      setBatchProduct(productName);
      setCanSubmit(false);
    } else setBatchError(true);
  }

  const selectedProduct = productName
    ? products.find((p) => p.name === productName)
    : batchProduct
    ? products.find((p) => p.name === batchProduct)
    : null;

  return (
    <Container>
      <Stack spacing={2} sx={{ py: '2rem', alignItems: 'center' }}>
        <Stack
          direction="row"
          sx={{
            height: 'auto',
            alignItems: 'center',
            alignSelf: 'center',
          }}
          spacing={1}
        >
          <FormControl>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.name}
              value={selectedProduct}
              onChange={(event, newValue) => {
                setProductName(newValue ? newValue.name : batchProduct || '');
                setBatchError(false);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Product" />
              )}
              sx={{ width: '300px' }}
              disabled={isBatchLoading}
            />
            <FormHelperText> </FormHelperText>
          </FormControl>
          <FormControl>
            <Autocomplete
              options={releases}
              getOptionLabel={(option) => option.name}
              value={tmpFirstRelease || null}
              onChange={(event, newValue) => {
                setTmpFirstRelease(newValue ? newValue : undefined);
                setBatchError(false);
              }}
              renderOption={(props, option) => {
                const isDisabled = option.name === tmpSecondRelease?.name;
                return (
                  <li
                    {...props}
                    key={option.name}
                    style={{
                      pointerEvents: isDisabled ? 'none' : 'auto',
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                  >
                    {option.name}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="First release" />
              )}
              sx={{ width: '300px' }}
              disabled={isBatchLoading}
            />
            <FormHelperText> </FormHelperText>
          </FormControl>
          <FormControl>
            <Autocomplete
              options={releases}
              getOptionLabel={(option) => option.name}
              value={tmpSecondRelease || null}
              onChange={(event, newValue) => {
                setTmpSecondRelease(newValue ? newValue : undefined);
                setBatchError(false);
              }}
              renderOption={(props, option) => {
                const isDisabled = option.name === tmpFirstRelease?.name;
                return (
                  <li
                    {...props}
                    key={option.name}
                    style={{
                      pointerEvents: isDisabled ? 'none' : 'auto',
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                  >
                    {option.name}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Second release" />
              )}
              sx={{ width: '300px' }}
              disabled={isBatchLoading}
            />
            <FormHelperText> </FormHelperText>
          </FormControl>
        </Stack>
        {(isErrorDocs || isErrorReleases || isError || batchError) && (
          <Alert
            severity="error"
            variant="outlined"
            sx={{ m: 'auto', width: 'fit-content' }}
          >
            A problem occurred
            {isErrorDocs && ' while getting one of the docs'}
            {isError && ' with this product'}
            {isErrorReleases && ' with one of the releases'}
            {batchError && ': there are no documents available for comparing'}.
            Choose different value.
          </Alert>
        )}
        <Button
          variant="contained"
          sx={{ width: '250px' }}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Compare
        </Button>
      </Stack>
    </Container>
  );
}
