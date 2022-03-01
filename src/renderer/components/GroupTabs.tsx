/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as models from '../models/models';

interface GroupTabsProps {
  groupsInfo: models.GroupsInfo;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  groupInfo?: models.GroupInfo;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function GroupTabs(props: GroupTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function handleTabs(groupsInfo: models.GroupsInfo) {
    const tabs = groupsInfo.map((groupInfo: models.GroupInfo, index) => {
      const { id, name } = groupInfo.group;
      return <Tab key={id} label={name} {...a11yProps(index)} />;
    });
    return tabs;
  }

  function handleTabPanels(groupsInfo: models.GroupsInfo) {
    const tabPanels = groupsInfo.map((groupInfo: models.GroupInfo, index) => {
      const { id, name } = groupInfo.group;
      return (
        <TabPanel key={id} value={value} index={index}>
          {name}
        </TabPanel>
      );
    });
    return tabPanels;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.paper',
        display: 'flex',
        height: 224,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        {handleTabs(props.groupsInfo)}
      </Tabs>
      {handleTabPanels(props.groupsInfo)}
    </Box>
  );
}
