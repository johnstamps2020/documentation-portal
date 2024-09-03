import { DeltaLevenshteinReturnType } from '@doctools/server';
import Link from '@mui/material/Link';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';
import DeltaDocCardText from './DeltaDocCardText';
import { fileDoesNotExistText } from 'pages/delta-doc';

export default function DeltaDocResultTableRow({
  result,
  index,
  releases,
}: {
  result: DeltaLevenshteinReturnType;
  index: number;
  releases: {
    lowerRelease: { source: string; releases: string };
    higherRelease: { source: string; releases: string };
  };
}) {
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
      {releases.lowerRelease.source === 'A' ? (
        <ReleaseCells
          input={{
            firstLink: result.docAUrl,
            secondLink: result.docBUrl,
            firstTitle: result.docATitle,
            secondTitle: result.docBTitle,
          }}
        />
      ) : (
        <ReleaseCells
          input={{
            firstLink: result.docBUrl,
            secondLink: result.docAUrl,
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
