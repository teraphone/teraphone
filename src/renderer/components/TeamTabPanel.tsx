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
      {value === index && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              flexShrink: 1,
              minWidth: 200,
              overflow: 'hidden',
            }}
          >
            <TeamMenu teamInfo={teamInfo} />
            <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
              <TeamRooms teamInfo={teamInfo} />
            </Box>
            <Box
              sx={{
                backgroundColor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <ScreenShareBanners />
              <CurrentRoomControls />
              <BottomControls />
            </Box>
          </Box>
          <TeamContacts teamInfo={teamInfo} />
        </>
      )}
    </Box>
  );
}

export default React.memo(TeamTabPanel);
