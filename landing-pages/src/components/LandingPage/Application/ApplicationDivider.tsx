import Box from '@mui/material/Box';

type ApplicationDividerProps = {
  color?: string;
};

export default function ApplicationDivider({ color }: ApplicationDividerProps) {
  return (
    <Box
      sx={{
        borderBottom: `1px solid ${color || '#7D91AC'}`,
        width: '100%',
        mx: 'auto',
      }}
    />
  );
}
