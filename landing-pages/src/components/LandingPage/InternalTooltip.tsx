import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import internalLogo from 'images/internal_document_icon.svg';
import { translate } from '@doctools/core';

export default function InternalTooltip() {
  return (
    <Tooltip
      title={
        <Typography>
          {translate({
            id: 'internal.item.tooltip',
            message: 'Guidewire internal content',
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
