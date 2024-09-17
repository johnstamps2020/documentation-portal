import {
  GwEmployeeLoginText,
  loginOptions,
  loginOptionsProd,
  useEnvStore,
} from '@doctools/core';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LoginPageCard from './LoginPageCard';

export default function LoginPageCards() {
  const envName = useEnvStore((state) => state.envName);

  const loginPageCardsToRender =
    envName === 'omega2-andromeda' ? loginOptionsProd : loginOptions;

  return (
    <Stack gap={2}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { md: 'repeat(3, 1fr)', sm: '1fr' },
          gap: 1,
          px: 2,
        }}
      >
        {loginPageCardsToRender.map((loginPageCard) => (
          <LoginPageCard
            label={loginPageCard.label}
            description={loginPageCard.description}
            key={loginPageCard.label}
            buttons={loginPageCard.buttons.map(({ href, label, region }) => ({
              href,
              label,
              region,
            }))}
          />
        ))}
      </Box>
      <Box>
        <GwEmployeeLoginText />
      </Box>
    </Stack>
  );
}
