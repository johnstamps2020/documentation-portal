import Paper from '@mui/material/Paper';

type ProductFamilyCardProps = {
  children: JSX.Element | JSX.Element[] | undefined;
};

export default function ProductFamilyCard({
  children,
}: ProductFamilyCardProps) {
  return (
    <Paper
      sx={{
        height: '100px',
        width: { xs: '100%', sm: '300px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </Paper>
  );
}
