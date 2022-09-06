/* eslint-disable no-console */
import * as React from 'react';
import { Box } from '@mui/material';
import * as models from '../models/models';
import BottomControls from './BottomControls';
import CurrentRoomControls from './CurrentRoomControls';
import ScreenShareBanners from './ScreenShareBanners';
import TeamContacts from './TeamContacts';
import TeamMenu from './TeamMenu';
import TeamRooms from './TeamRooms';
import VideoViews from './VideoViews';

interface TeamTabPanelProps {
  index: number;
  value: number;
  teamInfo: models.TeamInfo;
}

function TeamTabPanel(props: TeamTabPanelProps) {
  const { index, value, teamInfo } = props;

  React.useEffect(() => {
    console.log('TeamTabPanel', index, 'Rendered');
    return () => console.log('TeamTabPanel', index, 'Unmounted');
  }, [index]);

  return value !== index ? null : (
    <Box
      aria-labelledby={`vertical-tab-${index}`}
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      role="tabpanel"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        flexShrink: 1,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          flexShrink: 1,
          overflow: 'hidden',
        }}
      >
        <TeamMenu teamInfo={teamInfo} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
              overflow: 'hidden',
              width: 240,
            }}
          >
            <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
              <TeamRooms teamInfo={teamInfo} />
            </Box>
            <Box
              sx={{
                backgroundColor: '#f8f8f8',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ScreenShareBanners />
              <CurrentRoomControls />
              <BottomControls />
            </Box>
          </Box>
          <VideoViews />
        </Box>
      </Box>
      <TeamContacts teamInfo={teamInfo} />
    </Box>
  );
}

export default React.memo(TeamTabPanel);
