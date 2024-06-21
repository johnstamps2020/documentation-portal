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

export function getReleaseRegex(releases: Release[]) {
  return {
    releaseNameRegex: new RegExp(
      '(' +
        releases.map((release) => release.name.toLowerCase()).join('|') +
        ')'
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
export default function DeltaDocUpperPanel() {
  const [canSubmit, setCanSubmit] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc>();
  const [selectedDocSet, setSelectedDocSet] = useState<Doc[]>([]);
  const [leftDoc, setLeftDoc] = useState<Doc>();
  const [rightDoc, setRightDoc] = useState<Doc>();
  const [tmpFirstRelease, setTmpFirstRelease] = useState<Release>();
  const [tmpFirstReleaseSet, setTmpFirstReleaseSet] = useState<Release[]>();
  const [tmpSecondRelease, setTmpSecondRelease] = useState<Release>();
  const [tmpSecondReleaseSet, setTmpSecondReleaseSet] = useState<Release[]>();
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
  } = useDeltaDocContext();
  const [productName, setProductName] = useState<string>(batchProduct);
  useEffect(() => {
    setCanSubmit(!!selectedDoc && !!tmpFirstRelease && !!tmpSecondRelease);
  }, [
    selectedDoc,
    tmpFirstRelease,
    tmpSecondRelease,
    productName,
    setCanSubmit,
    batchComparison,
  ]);

  useEffect(() => {
    setTmpFirstReleaseSet(leftDoc && leftDoc.releases ? leftDoc.releases : []);
    setTmpSecondReleaseSet(
      rightDoc && rightDoc.releases ? rightDoc.releases : []
    );
    setLeftDoc(
      selectedDocSet.find((doc) => {
        if (doc.releases && doc.releases.length > 0) {
          return doc.releases.some((r) => r.name === tmpFirstRelease?.name);
        } else return false;
      })
    );
    setRightDoc(
      selectedDocSet.find((doc) => {
        if (doc.releases && doc.releases.length > 0) {
          return doc.releases.some((r) => r.name === tmpSecondRelease?.name);
        } else return false;
      })
    );
  }, [
    tmpFirstRelease,
    tmpSecondRelease,
    leftDoc,
    rightDoc,
    setTmpFirstReleaseSet,
    setTmpSecondReleaseSet,
    selectedDocSet,
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
    setFormState({
      firstDocId: leftDoc ? leftDoc.id : '',
      secondDocId: rightDoc ? rightDoc.id : '',
    });
    setReleaseA(
      leftDoc && leftDoc.releases ? leftDoc.releases.map((r) => r.name) : []
    );
    setReleaseB(
      rightDoc && rightDoc.releases ? rightDoc.releases.map((r) => r.name) : []
    );
    setFirstDoc(leftDoc);
    setSecondDoc(rightDoc);
    setCanSubmit(false);
    setBatchProduct(productName);
  }
  const filteredDocs = docs.filter((doc) => {
    return doc.platformProductVersions?.find((ppv) => {
      return ppv.product.name === productName;
    });
  });

  const allCorrespondingDocs = filteredDocs.filter(
    (doc) => doc.title === selectedDoc?.title
  );

  const filteredReleases = releases.filter((release) => {
    return allCorrespondingDocs.some((doc) =>
      doc.releases?.some((r) => r.name === release.name)
    );
  });

  const docsNoDuplicates = removeDuplicates(filteredDocs, releases);

  const docsAvailableToCompare = allCorrespondingDocs.filter(
    (doc) => doc.releases && doc.releases.length > 0
  ).length;

  const disabledReleases =
    filteredReleases.length === 0 || docsAvailableToCompare < 2;

  const disabledDocument = !!productName && docsNoDuplicates.length === 0;

  function resetReleases() {
    setTmpFirstRelease(undefined);
    setTmpSecondRelease(undefined);
    setTmpFirstReleaseSet([]);
    setTmpSecondReleaseSet([]);
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
                    setSelectedDoc(undefined);
                    resetReleases();
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
                  value={selectedDoc ? selectedDoc : ''}
                  onChange={(event) => {
                    setSelectedDocSet(
                      filteredDocs.filter(
                        (doc) => doc.title === (event.target.value as Doc).title
                      )
                    );
                    setSelectedDoc(event.target.value as Doc);
                    resetReleases();
                  }}
                  sx={{ width: '300px' }}
                  disabled={disabledDocument}
                >
                  {(productName ? docsNoDuplicates : docs)
                    .sort((a, b) => {
                      return a.title > b.title ? 1 : b.title > a.title ? -1 : 0;
                    })
                    .map((d) => (
                      //@ts-ignore - necessary to load object into value
                      <MenuItem value={d} key={d.id}>
                        {d.title} (
                        {d.url
                          .replace(
                            getReleaseRegex(releases).releaseNameRegex,
                            '<release>'
                          )
                          .replace(
                            getReleaseRegex(releases).releaseNumberRegex,
                            '/<release>'
                          )}
                        )
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>
                  {disabledDocument
                    ? 'There are no documents in this product.'
                    : selectedDoc && docsAvailableToCompare < 2
                    ? "This document doesn't exist in at least two releases."
                    : ' '}
                </FormHelperText>
              </FormControl>
            </Stack>
            <Stack padding={1}>
              <FormControl>
                <InputLabel>First release</InputLabel>
                <Select
                  label="First release"
                  value={tmpFirstRelease ? tmpFirstRelease : ''}
                  onChange={(event) => {
                    setTmpFirstRelease(event.target.value as Release);
                  }}
                  sx={{ width: '300px' }}
                  disabled={disabledReleases}
                >
                  {sortedReleases.map((r) => (
                    //@ts-ignore - necessary to load object into value
                    <MenuItem
                      value={r}
                      disabled={
                        r === tmpSecondRelease ||
                        !filteredReleases.includes(r) ||
                        rightDoc?.releases?.includes(r) ||
                        tmpSecondReleaseSet?.some(
                          (release) => release.name === r.name
                        )
                      }
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
                  value={tmpSecondRelease ? tmpSecondRelease : ''}
                  onChange={(event) => {
                    setTmpSecondRelease(event.target.value as Release);
                  }}
                  sx={{ width: '300px' }}
                  disabled={disabledReleases}
                >
                  {sortedReleases.map((r) => (
                    //@ts-ignore - necessary to load object into value
                    <MenuItem
                      value={r}
                      disabled={
                        r === tmpFirstRelease ||
                        !filteredReleases.includes(r) ||
                        leftDoc?.releases?.includes(r) ||
                        tmpFirstReleaseSet?.some(
                          (release) => release.name === r.name
                        )
                      }
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
