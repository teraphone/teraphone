/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as models from '../models/models';

interface GroupTabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
  groupinfo: models.GroupInfo;
}

function GroupTabPanel(props: GroupTabPanelProps) {
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
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

export default GroupTabPanel;
