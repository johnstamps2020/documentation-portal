import { Doc, Release } from '@doctools/server';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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

export function getReleaseRegex(releases: Release[]) {
  return {
    releaseNameRegex: new RegExp(
      `(${releases.map((release) => release.name.toLowerCase()).join('|')})`
    ),
    releaseNumberRegex: new RegExp(/((\/|_)\d+\.\d+\.\d+|\/\d+\.\d+|\/\d+)/),
  };
}

export function removeDuplicates(docs: Doc[], releases: Release[]) {
  const { releaseNumberRegex, releaseNameRegex } = getReleaseRegex(releases);
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

function filterDocs(docs: Doc[], productName: string) {
  return docs.filter((doc) =>
    doc.platformProductVersions?.some((ppv) => ppv.product.name === productName)
  );
}

export default function DeltaDocUpperPanel() {
  const [canSubmit, setCanSubmit] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc>();
  const [selectedDocSet, setSelectedDocSet] = useState<Doc[]>([]);
  const [leftDoc, setLeftDoc] = useState<Doc>();
  const [rightDoc, setRightDoc] = useState<Doc>();
  const [tmpFirstRelease, setTmpFirstRelease] = useState<Release>();
  const [tmpFirstReleaseSet, setTmpFirstReleaseSet] = useState<Release[]>([]);
  const [tmpSecondRelease, setTmpSecondRelease] = useState<Release>();
  const [tmpSecondReleaseSet, setTmpSecondReleaseSet] = useState<Release[]>([]);
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
  const {
    setFormState,
    batchComparison,
    setBatchProduct,
    setReleaseA,
    setReleaseB,
    setFirstDoc,
    setSecondDoc,
    batchProduct,
    isLoading: isLoadingResults,
  } = useDeltaDocContext();
  const [productName, setProductName] = useState<string>(batchProduct);
  useEffect(() => {
    setCanSubmit(!!selectedDoc && !!tmpFirstRelease && !!tmpSecondRelease);
  }, [
    selectedDoc,
    tmpFirstRelease,
    tmpSecondRelease,
    productName,
    batchComparison,
  ]);

  useEffect(() => {
    resetReleases();
  }, [batchComparison]);

  useEffect(() => {
    const getReleases = (doc: Doc | undefined) => doc?.releases || [];

    setTmpFirstReleaseSet(getReleases(leftDoc));
    setTmpSecondReleaseSet(getReleases(rightDoc));

    const findDocByRelease = (release: Release | undefined) =>
      selectedDocSet.find((doc) =>
        doc.releases?.some((r) => r.name === release?.name)
      );

    setLeftDoc(findDocByRelease(tmpFirstRelease));
    setRightDoc(findDocByRelease(tmpSecondRelease));
  }, [tmpFirstRelease, tmpSecondRelease, leftDoc, rightDoc, selectedDocSet]);

  useEffect(() => {
    if (selectedDoc && productName === '') {
      setProductName(selectedDoc.platformProductVersions[0].product.name);
    }
    if (selectedDoc && docs && releases) {
      const docsFilteredByTitle = filterDocs(docs, productName).filter(
        (doc) => doc.title === selectedDoc.title
      );
      setSelectedDocSet(docsFilteredByTitle);
    }
  }, [selectedDoc, productName, docs, releases]);

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
    setFormState({
      firstDocId: leftDoc?.id || '',
      secondDocId: rightDoc?.id || '',
    });
    setReleaseA(leftDoc?.releases?.map((r) => r.name) || []);
    setReleaseB(rightDoc?.releases?.map((r) => r.name) || []);
    setFirstDoc(leftDoc);
    setSecondDoc(rightDoc);
    setCanSubmit(false);
    setBatchProduct(productName);
  }

  const filteredDocs = filterDocs(docs, productName);

  const filteredReleases = releases.filter((release) => {
    return selectedDocSet.some((doc) =>
      doc.releases?.some((r) => r.name === release.name)
    );
  });

  const docsNoDuplicates = removeDuplicates(filteredDocs, releases);

  const docsAvailableToCompare = selectedDocSet.filter(
    (doc) => doc.releases && doc.releases.length > 0
  ).length;

  const disabledReleases =
    filteredReleases.length === 0 ||
    docsAvailableToCompare < 2 ||
    isLoadingResults;

  const disabledDocument = !!productName && docsNoDuplicates.length === 0;

  const docOptions = productName
    ? docsNoDuplicates
    : removeDuplicates(docs, releases);

  function resetReleases() {
    setTmpFirstRelease(undefined);
    setTmpSecondRelease(undefined);
    setTmpFirstReleaseSet([]);
    setTmpSecondReleaseSet([]);
  }

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
              options={products.sort((a, b) => a.name.localeCompare(b.name))}
              getOptionLabel={(option) => option.name}
              value={
                products.find((p) => p.name === productName) ??
                selectedDoc?.platformProductVersions[0]?.product ??
                null
              }
              onChange={(event, newValue) => {
                setProductName(newValue?.name ?? '');
                setSelectedDoc(undefined);
                resetReleases();
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              renderInput={(params) => (
                <TextField {...params} label="Product" />
              )}
              sx={{ width: '300px' }}
              disabled={isLoadingResults}
            />
            <FormHelperText> </FormHelperText>
          </FormControl>
          <FormControl>
            <Autocomplete
              options={docOptions.sort((a, b) =>
                a.title.localeCompare(b.title)
              )}
              getOptionLabel={(option) =>
                `${option.title} (${option.url
                  .replace(
                    getReleaseRegex(releases).releaseNameRegex,
                    '<release>'
                  )
                  .replace(
                    getReleaseRegex(releases).releaseNumberRegex,
                    '/<release>'
                  )})`
              }
              value={selectedDoc || null}
              onChange={(event, newValue) => {
                setSelectedDocSet(
                  newValue
                    ? filteredDocs.filter((doc) => doc.title === newValue.title)
                    : []
                );
                setSelectedDoc(newValue ? newValue : undefined);
                resetReleases();
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {`${option.title} (${option.url
                    .replace(
                      getReleaseRegex(releases).releaseNameRegex,
                      '<release>'
                    )
                    .replace(
                      getReleaseRegex(releases).releaseNumberRegex,
                      '/<release>'
                    )})`}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Document" />
              )}
              sx={{ width: '300px' }}
              disabled={disabledDocument || isLoadingResults}
            />
            <FormHelperText>
              {disabledDocument
                ? 'There are no documents in this product.'
                : selectedDoc && docsAvailableToCompare < 2
                ? "This document doesn't exist in at least two releases."
                : ' '}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Autocomplete
              options={sortedReleases}
              getOptionLabel={(option) => option.name}
              value={tmpFirstRelease || null}
              onChange={(event, newValue) => {
                setTmpFirstRelease(newValue ? newValue : undefined);
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              renderOption={(props, option) => {
                const isDisabled =
                  option === tmpSecondRelease ||
                  !filteredReleases.includes(option) ||
                  (rightDoc?.releases?.includes(option) ?? false) ||
                  tmpSecondReleaseSet.some(
                    (release) => release.name === option.name
                  );

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
              disabled={disabledReleases}
            />
            <FormHelperText> </FormHelperText>
          </FormControl>
          <FormControl>
            <Autocomplete
              options={sortedReleases}
              getOptionLabel={(option) => option.name}
              value={tmpSecondRelease || null}
              onChange={(event, newValue) => {
                setTmpSecondRelease(newValue ? newValue : undefined);
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              renderOption={(props, option) => {
                const isDisabled =
                  option === tmpFirstRelease ||
                  !filteredReleases.includes(option) ||
                  (leftDoc?.releases?.includes(option) ?? false) ||
                  (tmpFirstReleaseSet?.some(
                    (release) => release.name === option.name
                  ) ??
                    false);

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
              disabled={disabledReleases}
            />
            <FormHelperText> </FormHelperText>
          </FormControl>
        </Stack>
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
