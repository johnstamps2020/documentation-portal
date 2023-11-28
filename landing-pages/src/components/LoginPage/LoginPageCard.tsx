import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoginButton from './LoginButton';
import { LoginButtonConfig } from './loginOptionConfigs';

type LoginPageCardProps = {
  label: string;
  description: string;
  buttons: LoginButtonConfig[];
};
export default function LoginPageCard({
  label,
  description,
  buttons,
}: LoginPageCardProps) {
  return (
    <Paper
      key={label}
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '2rem 1rem',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography component="h2" sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography>{description}</Typography>
      <Stack direction="row" spacing={1}>
        {buttons.map((button, idx) => (
          <LoginButton {...button} key={idx} />
        ))}
      </Stack>
    </Paper>
  );
}
