import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import { usePageData } from '../../hooks/usePageData';

export default function InternalBadge() {
  const { pageData, isLoading, isError } = usePageData();
  const intl = useIntl();

  if (isError || isLoading || !pageData?.internal) {
    return null;
  }
  return (
    <Tooltip
      title={
        <Typography>
          {intl.formatMessage({
            id: 'internal.page.badge.tooltip',
            defaultMessage:
              'This page is available only to people with a Guidewire email. Do not share the link with external stakeholders because they will not be able to see the contents.',
          })}
        </Typography>
      }
      placement="right"
      arrow
    >
      <Chip
        label="internal page"
        sx={{
          fontWeight: 600,
          fontColor: '#28333f',
          backgroundColor: 'rgb(255, 186, 0)',
          borderRadius: '4px',
        }}
        variant="filled"
      ></Chip>
    </Tooltip>
  );
}
