import { DeltaLevenshteinReturnType } from '@doctools/server';
import Typography from '@mui/material/Typography';
import { fileDoesNotExistText } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useDeltaDocContext } from './DeltaDocContext';

export default function DeltaDocCardText({
  result,
}: {
  result: DeltaLevenshteinReturnType;
}) {
  const { releaseA, releaseB } = useDeltaDocContext();
  function Info({ text, colorInfo }: { text: string; colorInfo: string }) {
    return <Typography sx={{ color: colorInfo }}>{text}</Typography>;
  }
  return releaseA > releaseB ? (
    result.docATitle === fileDoesNotExistText ? (
      <Info text={`Deleted in ${releaseA}`} colorInfo="red" />
    ) : (
      <Info text={`Added in ${releaseA}`} colorInfo="green" />
    )
  ) : result.docBTitle === fileDoesNotExistText ? (
    <Info text={`Deleted in ${releaseB}`} colorInfo="red" />
  ) : (
    <Info text={`Added in ${releaseB}`} colorInfo="green" />
  );
}
