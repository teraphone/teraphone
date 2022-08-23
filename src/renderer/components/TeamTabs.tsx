/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Stack,
} from '@mui/material';
import * as models from '../models/models';
import TeamTabPanel from './TeamTabPanel';
import { useAppSelector } from '../redux/hooks';
import { selectTeams } from '../redux/WorldSlice';
import { selectTeamAvatars } from '../redux/AvatarSlice';

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function TeamTabs() {
  const [value, setValue] = React.useState(0);
  const teamsInfo = useAppSelector(selectTeams);
  const teamAvatars = useAppSelector(selectTeamAvatars);
  const theme = useTheme();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue < teamsInfo.length) {
      setValue(newValue);
    }
  };

  const tabs = teamsInfo.map((teamInfo: models.TeamInfo, index) => {
    const { id, displayName } = teamInfo.team;

    return (
      <Tooltip title={displayName} key={id} placement="right" arrow>
        <Tab
          icon={<Avatar src={teamAvatars[id]}>{displayName[0]}</Avatar>}
          key={id}
          {...a11yProps(index)}
        />
      </Tooltip>
    );
  });

  const tabPanels = teamsInfo.map((teamInfo: models.TeamInfo, index) => {
    const { id } = teamInfo.team;
    return (
      <TeamTabPanel key={id} value={value} index={index} teamInfo={teamInfo} />
    );
  });

  return (
    <>
      <Stack sx={{ width: 90 }}>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: theme.custom.palette.background.secondary,
            borderColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: 1,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            height: theme.custom.spacing.header.height,
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', flexShrink: 0 }}
          >
            Teams
          </Typography>
        </Box>

        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="group-tabs"
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            '.MuiTabs-indicator': {
              left: 0,
            },
            flexGrow: 1,
          }}
        >
          {tabs}
        </Tabs>
      </Stack>
      {tabPanels}
    </>
  );
}

export default React.memo(TeamTabs);
