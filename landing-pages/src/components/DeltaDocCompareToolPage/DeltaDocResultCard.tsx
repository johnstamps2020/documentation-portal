import {
  DeltaDocResultType,
  DeltaLevenshteinReturnType,
} from '@doctools/server';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useDeltaDocContext } from './DeltaDocContext';
import { fileDoesNotExistText } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';

export default function DeltaDocResultCard({
  result,
}: {
  result: DeltaLevenshteinReturnType;
}) {
  const { releaseA, releaseB, url } = useDeltaDocContext();

  function Info({ text, colorInfo }: { text: string; colorInfo: string }) {
    return <Typography sx={{ color: colorInfo }}>{text}</Typography>;
  }

  return (
    <Paper
      sx={{
        minHeight: '50px',
        width: '340px',
        p: 3,
        margin: '10px 20px',
      }}
    >
      <Link
        sx={{
          wordWrap: 'break-word',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
        href={
          result.URL.includes('cloud')
            ? result.URL
            : url.slice(0, -1) + result.URL
        }
        target="_blank"
      >
        {result.URL.includes('cloud')
          ? result.URL
          : url.slice(0, -1) + result.URL}
      </Link>
      {result.docATitle === result.docBTitle ? (
        <>
          <Typography>Title in both releases: {result.docATitle}</Typography>{' '}
        </>
      ) : (
        <>
          <Typography>
            Title in {releaseA}: {result.docATitle}
          </Typography>{' '}
          <Typography>
            Title in {releaseB}: {result.docBTitle}
          </Typography>
        </>
      )}
      <Typography sx={{ color: 'red' }}>
        Number of changes: {result.changes}
      </Typography>
      {result.percentage >= 100 &&
      (result.docATitle === fileDoesNotExistText ||
        result.docBTitle === fileDoesNotExistText) ? (
        <>
          {releaseA > releaseB ? (
            result.docATitle === fileDoesNotExistText ? (
              <Info text={`Deleted in ${releaseA}`} colorInfo="red" />
            ) : (
              <Info text={`Added in ${releaseA}`} colorInfo="green" />
            )
          ) : result.docBTitle === fileDoesNotExistText ? (
            <Info text={`Deleted in ${releaseB}`} colorInfo="red" />
          ) : (
            <Info text={`Added in ${releaseB}`} colorInfo="green" />
          )}
        </>
      ) : (
        <Typography sx={{ color: 'red' }}>
          Percentage: {result.percentage}%
        </Typography>
      )}
    </Paper>
  );
}
