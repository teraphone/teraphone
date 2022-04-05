import Box from '@mui/material/Box';
import * as models from '../models/models';
import GroupRooms from './GroupRooms';
import GroupMenu from './GroupMenu';
import BottomControls from './BottomControls';
import CurrentRoomControls from './CurrentRoomControls';

interface GroupTabPanelProps {
  index: number;
  value: number;
  groupInfo: models.GroupInfo;
}

function GroupTabPanel(props: GroupTabPanelProps) {
  const { index, value, groupInfo } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ width: 310 }}>
          <Box>
            <GroupMenu groupInfo={groupInfo} />
          </Box>
          <Box>
            <GroupRooms groupInfo={groupInfo} />
          </Box>
          <Box
            sx={{
              position: 'fixed',
              bottom: '0',
              width: '100%',
              backgroundColor: 'background.paper',
            }}
          >
            <CurrentRoomControls />
            <BottomControls />
          </Box>
        </Box>
      )}
    </div>
  );
}

export default GroupTabPanel;
