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

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Available docs"
          TabIndicatorProps={{
            sx: {
              '&.MuiTabs-indicator': {
                backgroundColor: 'transparent',
                ':after': {
                  content: `url("${indicator}")`,
                  position: 'absolute',
                  left: `calc(50% - ${triangleSize}px)`,
                  bottom: -25,
                },
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
              sx={{
                height: '49px',
                fontSize: 21,
                fontWeight: 600,
                px: 2,
                backgroundColor: 'paleBlue.main',
                color: 'paleBlue.contrastText',
                textTransform: 'none',
                border: 0.5,
                borderColor: 'divider',
                mx: 0.25,
                gap: 1,
                '&.Mui-selected': {
                  color: 'darkBlue.contrastText',
                  backgroundColor: 'darkBlue.main',
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
