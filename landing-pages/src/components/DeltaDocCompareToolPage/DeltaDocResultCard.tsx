import { DeltaLevenshteinReturnType } from '@doctools/server';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { fileDoesNotExistText } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import DeltaDocCardText from './DeltaDocCardText';
import { useDeltaDocContext } from './DeltaDocContext';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

type TitlesProps = {
  docATitle: string;
  docBTitle: string;
};

function Titles({ docATitle, docBTitle }: TitlesProps) {
  const { releaseA, releaseB } = useDeltaDocContext();
  if (docATitle === docBTitle) {
    return <Typography>Title in both releases: {docATitle}</Typography>;
  }

  return (
    <>
      <Typography>
        Title in {releaseA}: {docATitle}
      </Typography>
      <Typography>
        Title in {releaseB}: {docBTitle}
      </Typography>
    </>
  );
}

type NumericProps = {
  label: string;
  value: number;
  suffix?: string;
};

function Numeric({ label, value, suffix }: NumericProps) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
      <Typography>{label}:</Typography>
      <Chip label={`${value}${suffix ? suffix : ''}`} />
    </Stack>
  );
}

export default function DeltaDocResultCard({
  result,
}: {
  result: DeltaLevenshteinReturnType;
}) {
  const { url } = useDeltaDocContext();

  return (
    <Paper
      sx={{
        minHeight: '50px',
        width: '340px',
        p: 3,
        margin: '10px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
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
      <Box sx={{ flex: 1 }}>
        <Titles docATitle={result.docATitle} docBTitle={result.docBTitle} />
      </Box>
      <Stack sx={{ flex: 1, gap: '1rem' }}>
        <Numeric label="Number of changes" value={result.changes} />
        {result.percentage >= 100 &&
        (result.docATitle === fileDoesNotExistText ||
          result.docBTitle === fileDoesNotExistText) ? (
          <DeltaDocCardText result={result} />
        ) : (
          <Numeric
            label="Percentage of the file changed"
            value={result.percentage}
            suffix="%"
          />
        )}
      </Stack>
    </Paper>
  );
}
