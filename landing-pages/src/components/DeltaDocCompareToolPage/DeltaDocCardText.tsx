import { DeltaLevenshteinReturnType } from '@doctools/server';
import Alert, { AlertProps } from '@mui/material/Alert';
import Badge, { BadgeProps } from '@mui/material/Badge';
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

  function CustomBadge({
    content,
    color,
    percentage,
  }: {
    content: string;
    color: BadgeProps['color'];
    percentage: number;
  }) {
    return (
      <Badge badgeContent={content} color={color}>
        <div style={{ padding: '10px' }}>{percentage}%</div>
      </Badge>
    );
  }

  return releaseA > releaseB ? (
    result.docATitle === fileDoesNotExistText ? (
      <CustomBadge
        content="Deleted"
        color="error"
        percentage={result.percentage}
      />
    ) : (
      <CustomBadge
        content="Added"
        color="success"
        percentage={result.percentage}
      />
    )
  ) : result.docBTitle === fileDoesNotExistText ? (
    <CustomBadge
      content="Deleted"
      color="error"
      percentage={result.percentage}
    />
  ) : (
    <CustomBadge
      content="Added"
      color="success"
      percentage={result.percentage}
    />
  );
}
