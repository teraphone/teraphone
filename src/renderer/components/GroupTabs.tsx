/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import * as models from '../models/models';

interface GroupTabsProps {
  groupsInfo: models.GroupsInfo;
}

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
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
  const { groupsInfo } = props;

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function addGroupTab() {
    return (
      <Tooltip title="Add a Group" key="add-group" placement="right" arrow>
        <Tab
          icon={
            <Avatar>
              <AddIcon />
            </Avatar>
          }
          key="add-group"
          {...a11yProps(groupsInfo.length)}
        />
      </Tooltip>
    );
  }

  function addGroupTabPanel() {
    return (
      <TabPanel key="add-group" value={value} index={groupsInfo.length}>
        Add a Group
      </TabPanel>
    );
  }

  function handleTabs() {
    const tabs = groupsInfo.map((groupInfo: models.GroupInfo, index) => {
      const { id, name } = groupInfo.group;

      return (
        <Tooltip title={name} key={id} placement="right" arrow>
          <Tab
            icon={<Avatar>{name[0]}</Avatar>}
            key={id}
            {...a11yProps(index)}
          />
        </Tooltip>
      );
    });
    tabs.push(addGroupTab());
    return tabs;
  }

  function handleTabPanels() {
    const tabPanels = groupsInfo.map((groupInfo: models.GroupInfo, index) => {
      const { id, name } = groupInfo.group;
      return (
        <TabPanel key={id} value={value} index={index}>
          {name}
        </TabPanel>
      );
    });
    tabPanels.push(addGroupTabPanel());
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
        {handleTabs()}
      </Tabs>
      {handleTabPanels()}
    </Box>
  );
}
