/* eslint-disable no-console */
import Box from '@mui/material/Box';
import * as React from 'react';
import * as models from '../models/models';
import TeamRooms from './TeamRooms';
import TeamMenu from './TeamMenu';
import BottomControls from './BottomControls';
import CurrentRoomControls from './CurrentRoomControls';
import TeamContacts from './TeamContacts';
import ScreenShareBanners from './ScreenShareBanners';

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

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box sx={{ width: 310 }}>
            <Box>
              <TeamMenu teamInfo={teamInfo} />
            </Box>
            <Box>
              <TeamRooms teamInfo={teamInfo} />
            </Box>
            <Box
              sx={{
                position: 'fixed',
                bottom: '0',
                width: '310px',
                backgroundColor: 'background.paper',
              }}
            >
              <ScreenShareBanners />
              <CurrentRoomControls />
              <BottomControls />
            </Box>
          </Box>
          <TeamContacts teamInfo={teamInfo} />
        </Box>
      )}
    </div>
  );
}

export default React.memo(TeamTabPanel);
