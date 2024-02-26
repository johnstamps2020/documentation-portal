import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { statistics } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocStatistics() {
  const { releaseA, releaseB, deltaDocData } = useDeltaDocContext();

  if (!deltaDocData) {
    return <></>;
  }

  const {
    unchangedFiles,
    docBaseFileChanges,
    docBaseFilePercentageChanges,
    totalFilesScanned,
    releaseALength,
    releaseBLength,
  } = deltaDocData;

  const statValues = [
    totalFilesScanned,
    unchangedFiles,
    releaseALength,
    releaseBLength,
    docBaseFileChanges,
    docBaseFilePercentageChanges,
  ];

  return (
    <Stack direction="column" sx={{ marginTop: '30px' }}>
      {statistics.map((stat, index, key) => {
        if (statValues[index] !== undefined) {
          stat.value = statValues[index]!;
          return (
            <Typography key={`${stat.value}_${stat.text}_${key}`} variant="h3">
              {stat.text.includes('ReleaseA') || stat.text.includes('ReleaseB')
                ? stat.text
                    .replace('ReleaseA', releaseA)
                    .replace('ReleaseB', releaseB)
                : stat.text}
              {stat.value}
              {typeof stat.value == 'string' ? '%' : ''}
            </Typography>
          );
        }

        return <></>;
      })}
    </Stack>
  );
}
