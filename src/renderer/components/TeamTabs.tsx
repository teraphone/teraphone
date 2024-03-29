/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Stack,
  useTheme,
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
          icon={
            <Avatar variant="rounded" src={teamAvatars[id]}>
              {displayName[0]}
            </Avatar>
          }
          key={id}
          sx={{ minWidth: 0 }}
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
      <Stack sx={{ flexShrink: 0, overflow: 'hidden', width: 78 }}>
        <Box
          sx={{
            backgroundColor: theme.custom.palette.background.secondary,
            borderBottomColor: 'divider',
            borderBottomStyle: 'solid',
            borderBottomWidth: 1,
            borderColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: 1,
            boxShadow: theme.custom.shadows.header,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            height: theme.custom.spacing.header.height,
            justifyContent: 'center',
            px: 2,
            py: 1,
            zIndex: 1,
          }}
        >
          <Typography
            sx={{ color: 'text.secondary', flexShrink: 0, fontWeight: 500 }}
            variant="body2"
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
            backgroundColor: theme.palette.grey[200],
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
