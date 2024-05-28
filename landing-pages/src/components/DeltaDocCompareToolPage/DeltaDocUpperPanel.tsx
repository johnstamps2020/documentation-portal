import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import {
  useDocsNoRevalidation,
  useProductsNoRevalidation,
  useReleasesNoRevalidation,
} from 'hooks/useApi';
import { useEffect, useState } from 'react';
import BatchComparisonUpperPanel from './BatchComparisonUpperPanel';
import { useDeltaDocContext } from './DeltaDocContext';
import DeltaDocLoading from './DeltaDocLoading';

export default function DeltaDocUpperPanel() {
  const [canSubmit, setCanSubmit] = useState(false);
  const [docUrl, setDocUrl] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [firstRelease, setFirstRelease] = useState<string>('');
  const [secondRelease, setSecondRelease] = useState<string>('');
  const { docs, isLoading, isError } = useDocsNoRevalidation();
  const {
    releases,
    isLoading: isLoadingReleases,
    isError: isErrorReleases,
  } = useReleasesNoRevalidation();
  const {
    products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useProductsNoRevalidation();
  const { setFormState, batchComparison, setRootUrl, setBatchProduct } =
    useDeltaDocContext();

  useEffect(() => {
    setCanSubmit(docUrl !== '' && firstRelease !== '' && secondRelease !== '');
  }, [docUrl, firstRelease, secondRelease, productName, setCanSubmit]);

  if (batchComparison) {
    return <BatchComparisonUpperPanel />;
  }

  if (
    (!docs || !releases || !products) &&
    (isLoading || isLoadingReleases || isLoadingProducts)
  ) {
    return <DeltaDocLoading />;
  }

  if (
    !docs ||
    !releases ||
    !products ||
    isError ||
    isErrorReleases ||
    isErrorProducts
  ) {
    return <></>;
  }

  const sortedReleases = releases.sort(function (a, b) {
    return a.name < b.name ? 1 : b.name < a.name ? -1 : 0;
  });

  function handleSubmit() {
    setRootUrl(docUrl);
    setFormState({
      releaseA: firstRelease,
      releaseB: secondRelease,
      url: `/${docUrl}/`,
    });
    setCanSubmit(false);
    setBatchProduct(productName);
  }

  const filteredDocs = docs.filter((doc) => {
    return doc.platformProductVersions?.find((ppv) => {
      return ppv.product.name === productName;
    });
  });

  return (
    <Container>
      <Stack spacing={2} sx={{ py: '1rem' }}>
        <FormControl sx={{ alignItems: 'center' }}>
          <Stack
            direction="row"
            height="200px"
            alignItems="center"
            alignSelf="center"
            spacing={1}
          >
            <Stack padding={1}>
              <FormControl>
                <InputLabel>Product</InputLabel>
                <Select
                  label="Product"
                  value={productName}
                  onChange={(event) => {
                    setProductName(event.target.value);
                    setDocUrl('');
                  }}
                  sx={{ width: '300px' }}
                >
                  {products
                    .sort(function (a, b) {
                      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
                    })
                    .map((p) => (
                      <MenuItem value={p.name} key={p.name}>
                        {p.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack padding={1}>
              <FormControl>
                <InputLabel>Document</InputLabel>
                <Select
                  label="Document"
                  value={docUrl}
                  onChange={(event) => setDocUrl(event.target.value)}
                  sx={{ width: '300px' }}
                >
                  {(productName ? filteredDocs : docs)
                    .sort((a, b) => {
                      return a.title > b.title ? 1 : b.title > a.title ? -1 : 0;
                    })
                    .map((d) => (
                      <MenuItem value={d.url} key={d.id}>
                        {d.title} ({d.url})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack padding={1}>
              <FormControl>
                <InputLabel>First release</InputLabel>
                <Select
                  label="First release"
                  value={firstRelease}
                  onChange={(event) => setFirstRelease(event.target.value)}
                  sx={{ width: '300px' }}
                >
                  {sortedReleases.map((r) => (
                    <MenuItem
                      value={r.name}
                      disabled={r.name === secondRelease}
                      key={r.name}
                    >
                      {r.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack padding={1}>
              <FormControl>
                <InputLabel>Second release</InputLabel>
                <Select
                  label="Second release"
                  value={secondRelease}
                  onChange={(event) => setSecondRelease(event.target.value)}
                  sx={{ width: '300px' }}
                >
                  {sortedReleases.map((r) => (
                    <MenuItem
                      value={r.name}
                      disabled={r.name === firstRelease}
                      key={r.name}
                    >
                      {r.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
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
