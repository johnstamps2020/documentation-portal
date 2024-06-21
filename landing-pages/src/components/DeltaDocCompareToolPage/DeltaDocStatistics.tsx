import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { statistics } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocStatistics() {
  const { releaseA, releaseB, deltaDocData, batchComparison } =
    useDeltaDocContext();

  if (!deltaDocData) {
    return <></>;
  }

  if (batchComparison) {
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
      {deltaDocData.results.length !== 0 && (
        <>
          <Divider sx={{ m: '24px 0 24px 0', width: '100%' }} />
          {statistics.map((stat, index, key) => {
            if (statValues[index] !== undefined) {
              stat.value = statValues[index]!;
              return (
                <Typography
                  key={`${stat.value}_${stat.text}_${key}`}
                  variant="h3"
                >
                  {stat.text.includes('ReleaseA') ||
                  stat.text.includes('ReleaseB')
                    ? stat.text
                        .replace('ReleaseA', releaseA.join(', '))
                        .replace('ReleaseB', releaseB.join(', '))
                    : stat.text}
                  {stat.value}
                  {typeof stat.value == 'string' ? '%' : ''}
                </Typography>
              );
            }
            return <></>;
          })}
          <Divider sx={{ m: '8px 0 24px 0', width: '100%' }} />
        </>
      )}
    </Stack>
  );
}
