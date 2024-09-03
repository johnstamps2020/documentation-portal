import { DeltaLevenshteinReturnType } from '@doctools/server';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { useDeltaDocContext } from './DeltaDocContext';
import { fileDoesNotExistText } from 'pages/delta-doc';

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
