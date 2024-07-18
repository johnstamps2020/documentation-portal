import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import ApplicationLinkList, { TabPanelProps } from './ApplicationTabLinkList';
import ApplicationTabIcon, {
  ApplicationTabIconProps,
} from './ApplicationTabIcon';
import indicator from './indicator.svg';

function a11yProps(index: number) {
  return {
    'aria-controls': `doc-tabpanel-${index}`,
  };
}

export type ApplicationTabItemProps = {
  id: string;
  title: string;
  items: TabPanelProps['items'];
} & ApplicationTabIconProps;

type ApplicationTabsProps = { tabs: ApplicationTabItemProps[] };

export default function ApplicationTabs({ tabs }: ApplicationTabsProps) {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const triangleSize = 15;

  const tabHeight = '42px';

  return (
    <Box sx={{ width: '100%', my: { xs: '40px', sm: '40px', md: '75px' } }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '.MuiTabs-root': {
            minHeight: tabHeight,
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Available docs"
          orientation={isSmallScreen ? 'vertical' : 'horizontal'}
          sx={{
            width: isSmallScreen ? 'fit-content' : undefined,
            margin: isSmallScreen ? '0 auto' : undefined,
          }}
          TabIndicatorProps={{
            sx: {
              backgroundColor: 'transparent',
              ':after': isSmallScreen
                ? undefined
                : {
                    content: `url("${indicator}")`,
                    position: 'absolute',
                    left: `calc(50% - ${triangleSize}px)`,
                    bottom: -30,
                  },
            },
          }}
          centered
        >
          {tabs.map(({ icon, title, id }, index) => (
            <Tab
              key={index}
              id={id}
              label={title}
              {...a11yProps(index)}
              icon={<ApplicationTabIcon icon={icon} />}
              iconPosition="start"
              disableRipple
              sx={{
                minHeight: tabHeight,
                height: tabHeight,
                minWidth: '180px',
                width: isSmallScreen ? '100%' : undefined,
                fontSize: 21,
                fontWeight: 400,
                px: 2,
                backgroundColor: 'paleBackground.main',
                color: 'paleBackground.contrastText',
                textTransform: 'none',
                mx: '3px',
                gap: 1,
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                alignSelf: 'flex-end',
                '&.Mui-selected': {
                  color: 'primary.contrastText',
                  backgroundColor: 'primary.main',
                  border: 'solid',
                  borderWidth: '0.5px',
                  borderColor: '#385583',
                  minWidth: '188px',
                  minHeight: '47px',
                  fontSize: '24px',
                  fontWeight: 600,
                  '& img': {
                    filter: 'invert(100%)',
                  },
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab, index) => (
        <ApplicationLinkList
          value={value}
          index={index}
          key={index}
          items={tab.items}
        />
      ))}
    </Box>
  );
}
