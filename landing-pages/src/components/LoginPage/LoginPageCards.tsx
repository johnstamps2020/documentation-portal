import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useEnvInfo } from 'hooks/useApi';
import LoginPageCard from './LoginPageCard';
import {
  gwEmployeeLoginOption,
  loginOptions,
  loginOptionsProd,
} from './loginOptionConfigs';
import LoginButton from './LoginButton';

export default function LoginPageCards() {
  const {
    envInfo,
    isLoading: isEnvInfoLoading,
    isError: isEnvInfoError,
  } = useEnvInfo();

  if (isEnvInfoLoading || isEnvInfoError) {
    return null;
  }

  const loginPageCardsToRender =
    envInfo?.name === 'omega2-andromeda' ? loginOptionsProd : loginOptions;

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
        <LoginButton
          {...gwEmployeeLoginOption.buttons[0]}
          label={gwEmployeeLoginOption.label}
        />
      </Box>
    </Stack>
  );
}
