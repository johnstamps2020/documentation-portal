import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import ApplicationTabIcon, {
  ApplicationTabIconProps,
} from './ApplicationTabIcon';
import ApplicationLinkList from './ApplicationLinkList';
import indicator from './indicator.svg';

function a11yProps(index: number) {
  return {
    id: `doc-tab-${index}`,
    'aria-controls': `doc-tabpanel-${index}`,
  };
}

export type LinkSectionProps = {
  title: string;
  url: string;
  description: JSX.Element | string;
};

export type ApplicationTabItemProps = {
  title: string;
  items: LinkSectionProps[];
} & ApplicationTabIconProps;

type ApplicationTabsProps = { tabs: ApplicationTabItemProps[] };

export default function ApplicationTabs({ tabs }: ApplicationTabsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const triangleSize = 15;

  const tabHeight = '42px';

  return (
    <Box sx={{ width: '100%' }}>
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
          TabIndicatorProps={{
            sx: {
              backgroundColor: 'transparent',
              ':after': {
                content: `url("${indicator}")`,
                position: 'absolute',
                left: `calc(50% - ${triangleSize}px)`,
                bottom: -30,
              },
            },
          }}
          centered
        >
          {tabs.map(({ icon, title }, index) => (
            <Tab
              key={index}
              label={title}
              {...a11yProps(index)}
              icon={<ApplicationTabIcon icon={icon} />}
              iconPosition="start"
              disableRipple
              sx={{
                minHeight: tabHeight,
                height: tabHeight,
                minWidth: '180px',
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
