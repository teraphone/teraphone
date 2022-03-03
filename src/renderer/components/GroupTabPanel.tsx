/* eslint-disable react/jsx-props-no-spreading */
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as models from '../models/models';
import GroupRooms from './GroupRooms';

interface GroupTabPanelProps {
  index: number;
  value: number;
  groupinfo: models.GroupInfo;
}

function GroupTabPanel(props: GroupTabPanelProps) {
  const { index, value, groupinfo } = props;
  const { group } = groupinfo;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && (
        <>
          <Box
            sx={{
              // center the text vertically and horizontally
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 42,
              width: 200,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              {group.name}
            </Typography>
          </Box>
          <Box>
            <GroupRooms groupinfo={groupinfo} />
          </Box>
        </>
      )}
    </div>
  );
}

export default GroupTabPanel;
