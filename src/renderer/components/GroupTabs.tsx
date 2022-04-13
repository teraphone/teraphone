/* eslint-disable no-alert */
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
import { useAppSelector } from '../redux/hooks';
import { selectGroups } from '../redux/WorldSlice';

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function GroupTabs() {
  const [value, setValue] = React.useState(0);

  const groupsInfo = useAppSelector(selectGroups);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue < groupsInfo.length) {
      setValue(newValue);
    }
  };

  function addGroupTab() {
    const handleClick = () => {
      alert('Not implemented yet.');
    };

    return (
      <Tooltip title="Add a Group" key="add-group" placement="right" arrow>
        <Tab
          onClick={handleClick}
          icon={
            <Avatar>
              <AddIcon />
            </Avatar>
          }
          key="add-group"
          aria-controls="vertical-tabpanel-add-group"
        />
      </Tooltip>
    );
  }

  const tabs = groupsInfo.map((groupInfo: models.GroupInfo, index) => {
    const { id, name } = groupInfo.group;

    return (
      <Tooltip title={name} key={id} placement="right" arrow>
        <Tab icon={<Avatar>{name[0]}</Avatar>} key={id} {...a11yProps(index)} />
      </Tooltip>
    );
  });
  tabs.push(addGroupTab());

  const tabPanels = groupsInfo.map((groupInfo: models.GroupInfo, index) => {
    const { id } = groupInfo.group;
    return (
      <GroupTabPanel
        key={id}
        value={value}
        index={index}
        groupInfo={groupInfo}
      />
    );
  });

  return (
    <>
      <Stack sx={{ width: 90 }}>
        <Box
          sx={{
            // center the text vertically and horizontally
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 48,
            backgroundColor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
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
          aria-label="group-tabs"
          sx={{
            height: '100%',
            borderRight: 1,
            borderColor: 'divider',
            '.MuiTabs-indicator': {
              left: 0,
            },
          }}
        >
          {tabs}
        </Tabs>
      </Stack>
      {tabPanels}
    </>
  );
}
