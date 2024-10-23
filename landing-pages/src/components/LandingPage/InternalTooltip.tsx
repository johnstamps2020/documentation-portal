import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import internalLogo from 'images/internal_document_icon.svg';
import { useIntl } from 'react-intl';

export default function InternalTooltip() {
  const intl = useIntl();

  return (
    <Tooltip
      title={
        <Typography>
          {intl.formatMessage({
            id: 'internal.item.tooltip',
            defaultMessage: 'Guidewire internal content',
          })}
        </Typography>
      }
      placement="right"
      arrow
    >
      <img
        src={internalLogo}
        alt="internal-document"
        height="20px"
        width="20px"
        style={{
          backgroundColor: 'black',
          borderRadius: '50%',
        }}
      ></img>
    </Tooltip>
  );
}
