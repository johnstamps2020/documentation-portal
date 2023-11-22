import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEnvInfo } from 'hooks/useApi';
import React, { Fragment } from 'react';
import LoginButton from './LoginButton';
import { loginOptions, loginOptionsProd } from './loginOptionConfigs';
import GwEmployeeLoginText from './GwEmployeeLoginText';

export default function LoginButtonsInDrawer() {
  const {
    envInfo,
    isLoading: isEnvInfoLoading,
    isError: isEnvInfoError,
  } = useEnvInfo();

  if (isEnvInfoLoading || isEnvInfoError) {
    return null;
  }

  const loginOptionsToRender =
    envInfo?.name === 'omega2-andromeda' ? loginOptionsProd : loginOptions;

  return (
    <Stack gap={2}>
      {loginOptionsToRender.map((loginOption) => (
        <Fragment key={loginOption.label}>
          {loginOption.buttons.map(({ href, label, region }, idx) => (
            <Tooltip
              key={idx}
              title={<Typography>{loginOption.description}</Typography>}
              placement="left"
              arrow
            >
              <Box sx={{ display: 'flex' }}>
                <LoginButton
                  href={href}
                  label={[loginOption.label, label].join(' ')}
                  region={region}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Tooltip>
          ))}
        </Fragment>
      ))}
      <GwEmployeeLoginText />
    </Stack>
  );
}
