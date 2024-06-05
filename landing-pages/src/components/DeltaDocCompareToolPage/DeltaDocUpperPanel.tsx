import { Doc, Release } from '@doctools/server';
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
import FormHelperText from '@mui/material/FormHelperText';

export const releaseNumberRegex = new RegExp(
  /(\/\d+\.\d+\.\d+|\/\d+\.\d+|\/\d+)/
);

export function getReleaseNameRegex(releases: Release[]) {
  return new RegExp(
    '(' + releases.map((release) => release.name.toLowerCase()).join('|') + ')'
  );
}

export function removeDuplicates(
  docs: Doc[],
  releaseNumberRegex: RegExp,
  releaseNameRegex: RegExp
) {
  return docs.filter(
    (doc, i, arr) =>
      arr.findIndex(
        (d) =>
          d.url
            .replace(releaseNumberRegex, '')
            .replace(releaseNameRegex, '') ===
            doc.url
              .replace(releaseNumberRegex, '')
              .replace(releaseNameRegex, '') && d.title === doc.title
      ) === i
  );
}
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
  }, [
    docUrl,
    firstRelease,
    secondRelease,
    productName,
    setCanSubmit,
    batchComparison,
  ]);

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
  const releaseNameRegex = getReleaseNameRegex(releases);
  const docsNoDuplicates = removeDuplicates(
    filteredDocs,
    releaseNumberRegex,
    releaseNameRegex
  );

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
                <FormHelperText> </FormHelperText>
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
                  disabled={!!productName && docsNoDuplicates.length === 0}
                >
                  {(productName ? docsNoDuplicates : docs)
                    .sort((a, b) => {
                      return a.title > b.title ? 1 : b.title > a.title ? -1 : 0;
                    })
                    .map((d) => (
                      <MenuItem value={d.url} key={d.id}>
                        {d.title} (
                        {d.url
                          .replace(releaseNameRegex, '<release>')
                          .replace(releaseNumberRegex, '/<release>')}
                        )
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>
                  {!!productName && docsNoDuplicates.length === 0
                    ? 'There are no documents in this product.'
                    : ' '}
                </FormHelperText>
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
                <FormHelperText> </FormHelperText>
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
                <FormHelperText> </FormHelperText>
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
