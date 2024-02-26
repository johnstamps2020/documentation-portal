import { DeltaLevenshteinReturnType } from '@doctools/server';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { fileDoesNotExistText } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import DeltaDocCardText from './DeltaDocCardText';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocResultCard({
  result,
}: {
  result: DeltaLevenshteinReturnType;
}) {
  const { releaseA, releaseB, url } = useDeltaDocContext();

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
          <DeltaDocCardText result={result} />
        </>
      ) : (
        <Typography sx={{ color: 'red' }}>
          Percentage: {result.percentage}%
        </Typography>
      )}
    </Paper>
  );
}
