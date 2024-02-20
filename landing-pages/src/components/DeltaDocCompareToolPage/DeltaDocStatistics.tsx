import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocStatistics() {
  const {
    releaseA,
    releaseB,
    unchangedFiles,
    docBaseFileChanges,
    docBaseFilePercentageChanges,
    totalFilesScanned,
    releaseALength,
    releaseBLength,
  } = useDeltaDocContext();

  const statistics = [
    { text: `Files scanned: ${totalFilesScanned}`, value: totalFilesScanned },
    { text: `Identical entries: ${unchangedFiles}`, value: unchangedFiles },
    {
      text: `${releaseA} file count: ${releaseALength}`,
      value: releaseALength,
    },
    {
      text: `${releaseB} file count: ${releaseBLength}`,
      value: releaseBLength,
    },
    {
      text: `Percentage of files in the doc base that were edited: ${docBaseFileChanges}%`,
      value: docBaseFileChanges,
    },
    {
      text: `Percentage that the doc base changed by between the two releases: ${docBaseFilePercentageChanges}%`,
      value: docBaseFilePercentageChanges,
    },
  ];
  return (
    <Stack direction="column" sx={{ marginTop: '30px' }}>
      {statistics.map((line) => {
        if (line.value !== undefined) {
          return <Typography variant="h3">{line.text}</Typography>;
        }
        return <></>
      })}
    </Stack>
  );
}
