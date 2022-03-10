/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import * as models from '../models/models';
import GroupTabPanel from './GroupTabPanel';

interface GroupTabsProps {
  groupsInfo: models.GroupsInfo;
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
    if (newValue < groupsInfo.length) {
      setValue(newValue);
    }
  };

  function addGroupTab() {
    const handleClick = () => {
      console.log('Clicked "Add a Group"');
    };

    return (
      <Tooltip title="Add a Group" key="add-group" placement="right" arrow>
        <span>
          <Tab
            onClick={handleClick}
            icon={
              <Avatar>
                <AddIcon />
              </Avatar>
            }
            key="add-group"
            aria-controls="vertical-tabpanel-add-group"
            disabled
          />
        </span>
      </Tooltip>
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

  function GroupTabPanels() {
    const tabPanels = groupsInfo.map((groupInfo: models.GroupInfo, index) => {
      const { id } = groupInfo.group;
      return (
        <GroupTabPanel
          key={id}
          value={value}
          index={index}
          groupinfo={groupInfo}
        />
      );
    });
    return <>{tabPanels}</>;
  }

  return (
    <>
      <Stack>
        <Box
          sx={{
            // center the text vertically and horizontally
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 42,
            backgroundColor: 'background.paper',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            Groups
          </Typography>
        </Box>

        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: 1,
            borderColor: 'divider',
          }}
        >
          {handleTabs()}
        </Tabs>
      </Stack>
      <GroupTabPanels />
    </>
  );
}
