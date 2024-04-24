import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { Fragment } from 'react';
import { GwEmployeeLoginText } from './GwEmployeeLoginText';
import { LoginButtonForDrawer } from './LoginButtonForDrawer';
import { loginOptions, loginOptionsProd } from './loginOptionConfigs';
import { useAvatar } from './AvatarContext';

export function LoginButtonsInDrawer() {
  const { isProd } = useAvatar();
  const loginOptionsToRender =
    isProd === true ? loginOptionsProd : loginOptions;

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
                <LoginButtonForDrawer
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
