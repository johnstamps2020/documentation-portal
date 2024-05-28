import { DeltaLevenshteinReturnType, Doc } from '@doctools/server';
import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useDeltaDocContext } from './DeltaDocContext';
import { fileDoesNotExistText } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { Typography } from '@mui/material';
import DeltaDocCardText from './DeltaDocCardText';
import { useDocsNoRevalidation } from 'hooks/useApi';

export default function DeltaDocResultTableRow({
  result,
  index,
  releases,
}: {
  result: DeltaLevenshteinReturnType;
  index: number;
  releases: { lowerRelease: string; higherRelease: string };
}) {
  const { rootUrl, releaseA } = useDeltaDocContext();
  const { docs, isLoading, isError } = useDocsNoRevalidation();

  if (!docs || isError || isLoading) {
    return null;
  }

  const isReleaseALower = releases.lowerRelease === releaseA;

  function getUrlValue(
    title: string,
    rootUrl: string,
    docs: Doc[],
    releaseName: string
  ) {
    if (title !== fileDoesNotExistText) {
      const docObject = docs.find(
        (doc) =>
          doc.url.replace(/\d+.+\d/, '') === rootUrl.replace(/\d+.+\d/, '') &&
          doc.releases?.some((release) => release.name === releaseName)
      );
      if (docObject) {
        return `${docObject.url}${result.URL}`;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
  const lowerReleaseUrl = getUrlValue(
    result.docATitle,
    rootUrl,
    docs,
    isReleaseALower ? releases.lowerRelease : releases.higherRelease
  );
  const higherReleaseUrl = getUrlValue(
    result.docBTitle,
    rootUrl,
    docs,
    isReleaseALower ? releases.higherRelease : releases.lowerRelease
  );

  function getLink(url: string) {
    return url ? (
      <Link sx={{ wordWrap: 'break-word' }} target="_blank" href={url}>
        {url}
      </Link>
    ) : (
      <Typography align="center" fontSize="14px">
        -
      </Typography>
    );
  }

  function ReleaseCells({
    input,
  }: {
    input: {
      firstLink: string;
      secondLink: string;
      firstTitle: string;
      secondTitle: string;
    };
  }) {
    return (
      <>
        <TableCell sx={{ maxWidth: '200px' }}>
          {getLink(input.firstLink)}
        </TableCell>
        <TableCell sx={{ maxWidth: '200px' }}>
          {getLink(input.secondLink)}
        </TableCell>
        <TableCell
          align="center"
          sx={{ maxWidth: '200px', wordWrap: 'break-word' }}
        >
          {input.firstTitle === fileDoesNotExistText ? '-' : input.firstTitle}
        </TableCell>
        <TableCell
          align="center"
          sx={{ maxWidth: '200px', wordWrap: 'break-word' }}
        >
          {input.secondTitle === fileDoesNotExistText ? '-' : input.secondTitle}
        </TableCell>
      </>
    );
  }

  return (
    <TableRow>
      <TableCell align="center">{index}</TableCell>
      {isReleaseALower ? (
        <ReleaseCells
          input={{
            firstLink: lowerReleaseUrl,
            secondLink: higherReleaseUrl,
            firstTitle: result.docATitle,
            secondTitle: result.docBTitle,
          }}
        />
      ) : (
        <ReleaseCells
          input={{
            firstLink: higherReleaseUrl,
            secondLink: lowerReleaseUrl,
            firstTitle: result.docBTitle,
            secondTitle: result.docATitle,
          }}
        />
      )}
      <TableCell align="center">{result.changes}</TableCell>
      <TableCell align="center">
        {result.percentage >= 100 &&
        (result.docATitle === fileDoesNotExistText ||
          result.docBTitle === fileDoesNotExistText) ? (
          <DeltaDocCardText result={result} />
        ) : (
          `${result.percentage}%`
        )}
      </TableCell>
    </TableRow>
  );
}
