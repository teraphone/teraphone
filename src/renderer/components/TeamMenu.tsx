/* eslint-disable react/jsx-props-no-spreading */
import { useTheme } from '@mui/material/styles';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PopupState, {
  // bindTrigger,
  bindMenu,
} from 'material-ui-popup-state';
import * as React from 'react';
import * as models from '../models/models';

function TeamMenu(props: { teamInfo: models.TeamInfo }) {
  const { teamInfo } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.custom.palette.background.secondary,
        height: theme.custom.spacing.header.height,
        width: '100%',
      }}
    >
      <List
        component="nav"
        aria-label="team-menu"
        sx={{ height: '100%', p: 0 }}
      >
        <PopupState variant="popover" popupId="team-popup-menu">
          {(popupState) => (
            <>
              <ListItem
                sx={{ height: '100%' }}
                // button
                // secondaryAction={
                //   <KeyboardArrowDownIcon
                //     sx={{
                //       color: 'text.secondary',
                //       fontSize: 20,
                //       marginTop: 0.5,
                //     }}
                //   />
                // }
                // {...bindTrigger(popupState)}
              >
                <ListItemText disableTypography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {teamInfo.team.displayName}
                  </Typography>
                </ListItemText>
              </ListItem>

              <Menu
                {...bindMenu(popupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                marginThreshold={0}
                elevation={0}
                PaperProps={{
                  sx: { my: 1 },
                  variant: 'outlined',
                  square: true,
                }}
              >
                <MenuItem
                  onClick={popupState.close}
                  disabled
                  dense
                  sx={{ width: 290 }}
                >
                  <ListItemText>Invite People</ListItemText>
                  <PersonAddIcon sx={{ fontSize: 20 }} />
                </MenuItem>
                <MenuItem onClick={popupState.close} disabled dense>
                  <ListItemText>Edit Group Profile</ListItemText>
                  <EditIcon sx={{ fontSize: 20 }} />
                </MenuItem>
                <MenuItem onClick={popupState.close} disabled dense>
                  <ListItemText>Add New Room</ListItemText>
                  <PlaylistAddIcon sx={{ fontSize: 20 }} />
                </MenuItem>
                <MenuItem onClick={popupState.close} disabled dense>
                  <ListItemText>Leave Group</ListItemText>
                  <DeleteForeverIcon sx={{ fontSize: 20 }} />
                </MenuItem>
              </Menu>
            </>
          )}
        </PopupState>
      </List>
    </Box>
  );
}

export default React.memo(TeamMenu);
