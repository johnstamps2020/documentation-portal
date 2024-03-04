import { DeltaLevenshteinReturnType } from '@doctools/server';
import Alert, { AlertProps } from '@mui/material/Alert';
import { fileDoesNotExistText } from 'pages/DeltaDocCompareToolPage/DeltaDocCompareToolPage';
import { useDeltaDocContext } from './DeltaDocContext';

function Info({
  text,
  severity,
}: {
  text: string;
  severity: AlertProps['severity'];
}) {
  return <Alert severity={severity}>{text}</Alert>;
}

export default function DeltaDocCardText({
  result,
}: {
  result: DeltaLevenshteinReturnType;
}) {
  const { releaseA, releaseB } = useDeltaDocContext();

  return releaseA > releaseB ? (
    result.docATitle === fileDoesNotExistText ? (
      <Info text={`Deleted in ${releaseA}`} severity="error" />
    ) : (
      <Info text={`Added in ${releaseA}`} severity="success" />
    )
  ) : result.docBTitle === fileDoesNotExistText ? (
    <Info text={`Deleted in ${releaseB}`} severity="error" />
  ) : (
    <Info text={`Added in ${releaseB}`} severity="success" />
  );
}
