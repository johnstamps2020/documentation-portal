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
import {
  getReleaseNameRegex,
  releaseNumberRegex,
  removeDuplicates,
} from './DeltaDocUpperPanel';

export default function BatchComparisonUpperPanel() {
  const {
    setBatchFormState,
    setBatchProduct,
    setFormState,
    setNumberOfDocsInProduct,
    batchProduct,
    releaseA,
    releaseB,
  } = useDeltaDocContext();
  const [productName, setProductName] = useState<string>(batchProduct);
  const [firstRelease, setFirstRelease] = useState<string>(releaseA);
  const [secondRelease, setSecondRelease] = useState<string>(releaseB);
  const [canSubmit, setCanSubmit] = useState(false);
  const [tmpDocsLength, setTmpDocsLength] = useState<number>();
  const [tmpReleaseB, setTmpReleaseB] = useState('');
  const [tmpReleaseA, setTmpReleaseA] = useState('');
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

  const filteredDocs =
    docs && releases
      ? removeDuplicates(
          docs,
          releaseNumberRegex,
          getReleaseNameRegex(releases)
        )
      : docs;

  useEffect(() => {
    if (productName && firstRelease && secondRelease) {
      if (isErrorDocs || isErrorReleases || isError) {
        setCanSubmit(false);
      } else {
        setCanSubmit(true);
      }
    }
    setTmpDocsLength(filteredDocs?.length);
  }, [
    productName,
    firstRelease,
    secondRelease,
    setProductName,
    docs,
    isErrorDocs,
    isErrorReleases,
    isError,
    setCanSubmit,
    setNumberOfDocsInProduct,
    filteredDocs?.length,
  ]);

  useEffect(() => {
    setTmpReleaseA(firstRelease ? firstRelease : releaseA);
    setTmpReleaseB(secondRelease ? secondRelease : releaseB);
  }, [releaseA, firstRelease, releaseB, secondRelease]);

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
    if (!filteredDocs || !firstRelease || !secondRelease) {
      return;
    }
    const batch = filteredDocs.map((doc) => {
      return {
        url: `/${doc.url}/`,
        releaseA: firstRelease,
        releaseB: secondRelease,
      };
    });
    setFormState({
      releaseA: firstRelease,
      releaseB: secondRelease,
      url: '',
    });
    setBatchFormState(batch);
    setBatchProduct(productName);
    setNumberOfDocsInProduct(tmpDocsLength);
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
                <FormHelperText>
                  {productName && tmpDocsLength
                    ? `This product includes ${tmpDocsLength} 
                      ${tmpDocsLength === 1 ? 'doc' : 'docs'}.`
                    : ' '}
                </FormHelperText>
              </FormControl>
            </Stack>
            <Stack padding={3}>
              <FormControl>
                <InputLabel>First release</InputLabel>
                <Select
                  label="First release"
                  value={tmpReleaseA}
                  onChange={(event) => setFirstRelease(event.target.value)}
                  sx={{ width: '300px' }}
                >
                  {releases.map((r) => (
                    <MenuItem
                      value={r.name}
                      disabled={r.name === secondRelease}
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
                  value={tmpReleaseB}
                  onChange={(event) => setSecondRelease(event.target.value)}
                  sx={{ width: '300px' }}
                >
                  {releases.map((r) => (
                    <MenuItem
                      value={r.name}
                      disabled={r.name === firstRelease}
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
