import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import {
  useProductsNoRevalidation,
  useReleasesNoRevalidation,
} from 'hooks/useApi';
import { useDocsByProduct } from 'hooks/useDeltaDocData';
import { useEffect, useState } from 'react';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocLoading from './DeltaDocLoading';
import Alert from '@mui/material/Alert';
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
  } = useDeltaDocContext();
  const [productName, setProductName] = useState<string>(batchProduct);
  const [canSubmit, setCanSubmit] = useState(false);
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
      if (isErrorDocs || isErrorReleases || isError) {
        setCanSubmit(false);
      } else {
        setCanSubmit(true);
      }
    }
  }, [
    productName,
    tmpFirstRelease,
    tmpSecondRelease,
    setProductName,
    docs,
    isErrorDocs,
    isErrorReleases,
    isError,
    setCanSubmit,
    filteredDocs?.length,
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
    setReleaseA([tmpFirstRelease.name]);
    setReleaseB([tmpSecondRelease.name]);
    setBatchFormState(batch);
    setBatchProduct(productName);
    setCanSubmit(false);
  }

  return (
    <Container>
      <Stack spacing={2} sx={{ py: '1rem' }}>
        <FormControl sx={{ alignItems: 'center' }}>
          <Stack
            direction="row"
            height="200px"
            alignItems="center"
            alignSelf="center"
            spacing={3}
            padding={3}
          >
            <Stack padding={3}>
              <FormControl>
                <InputLabel>Product</InputLabel>
                <Select
                  label="Product"
                  value={productName ? productName : batchProduct}
                  onChange={(event) => setProductName(event.target.value)}
                  sx={{ width: '300px' }}
                >
                  {products.map((p) => (
                    <MenuItem value={p.name} key={p.name}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText> </FormHelperText>
              </FormControl>
            </Stack>
            <Stack padding={3}>
              <FormControl>
                <InputLabel>First release</InputLabel>
                <Select
                  label="First release"
                  value={tmpFirstRelease ? tmpFirstRelease : ''}
                  onChange={(event) =>
                    setTmpFirstRelease(event.target.value as Release)
                  }
                  sx={{ width: '300px' }}
                >
                  {releases.map((r) => (
                    //@ts-ignore - necessary to load object into value
                    <MenuItem
                      value={r}
                      disabled={r === tmpSecondRelease}
                      key={r.name}
                    >
                      {r.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText> </FormHelperText>
                {/* essential to have consistent layout (otherwise selectors will be lower then the first one)*/}
              </FormControl>
            </Stack>
            <Stack padding={3}>
              <FormControl>
                <InputLabel>Second release</InputLabel>
                <Select
                  label="Second release"
                  value={tmpSecondRelease ? tmpSecondRelease : ''}
                  onChange={(event) =>
                    setTmpSecondRelease(event.target.value as Release)
                  }
                  sx={{ width: '300px' }}
                >
                  {releases.map((r) => (
                    //@ts-ignore - necessary to load object into value
                    <MenuItem
                      value={r}
                      disabled={r === tmpFirstRelease}
                      key={r.name}
                    >
                      {r.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText> </FormHelperText>
              </FormControl>
            </Stack>
          </Stack>
          {(isErrorDocs || isErrorReleases || isError) && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{ m: 'auto', width: 'fit-content' }}
            >
              A problem occurred{' '}
              {isErrorDocs && 'while getting one of the docs'}
              {isError && 'with this product'}
              {isErrorReleases && 'with one of the releases'}. Choose different
              value.
            </Alert>
          )}
          <Button
            variant="contained"
            sx={{ mt: '12px', width: '250px' }}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Compare
          </Button>
        </FormControl>
      </Stack>
    </Container>
  );
}
