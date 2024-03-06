import { DeltaLevenshteinReturnType } from '@doctools/server';
import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useDeltaDocContext } from './DeltaDocContext';
import { fileDoesNotExistText } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { Typography } from '@mui/material';
import DeltaDocCardText from './DeltaDocCardText';

export default function DeltaDocResultTableRow({
  result,
  index,
  releases,
}: {
  result: DeltaLevenshteinReturnType;
  index: number;
  releases: { lowerRelease: string; higherRelease: string };
}) {
  const { rootUrls, releaseA, releaseB } = useDeltaDocContext();

  const leftLinkUrl =
    result.docATitle !== fileDoesNotExistText
      ? result.URL.includes('cloud')
        ? result.URL
        : rootUrls.leftUrl.slice(0, -1) + result.URL
      : '';

  const rightLinkUrl =
    result.docBTitle !== fileDoesNotExistText
      ? result.URL.includes('cloud')
        ? result.URL
        : rootUrls.rightUrl.slice(0, -1) + result.URL
      : '';

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
        <TableCell align="center">
          {input.firstTitle === fileDoesNotExistText ? '-' : input.firstTitle}
        </TableCell>
        <TableCell align="center">
          {input.secondTitle === fileDoesNotExistText ? '-' : input.secondTitle}
        </TableCell>
      </>
    );
  }

  return (
    <TableRow>
      <TableCell align="center">{index}</TableCell>
      {releases.lowerRelease === releaseA ? (
        <ReleaseCells
          input={{
            firstLink: leftLinkUrl,
            secondLink: rightLinkUrl,
            firstTitle: result.docATitle,
            secondTitle: result.docBTitle,
          }}
        />
      ) : (
        <ReleaseCells
          input={{
            firstLink: rightLinkUrl,
            secondLink: leftLinkUrl,
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
