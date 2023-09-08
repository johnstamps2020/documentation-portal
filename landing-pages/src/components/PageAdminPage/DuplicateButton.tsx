import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type DuplicateButtonProps = {
  pagePath: string;
};

export default function DuplicateButton({
  pagePath,
}: DuplicateButtonProps): JSX.Element {
  return (
    <IconButton>
      <ContentCopyIcon color="primary" />
    </IconButton>
  );
}
