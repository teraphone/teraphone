/* eslint-disable react/jsx-props-no-spreading */
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import * as React from 'react';
import * as models from '../models/models';
import GroupInviteDialog from './GroupInviteDialog';

function GroupMenu(props: { groupInfo: models.GroupInfo }) {
  const { groupInfo } = props;
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);

  const handleInviteDialogClickOpen = () => {
    setInviteDialogOpen(true);
  };

  const handleInviteDialogClose = () => {
    setInviteDialogOpen(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <List
        component="nav"
        aria-label="group-menu"
        sx={{ height: '100%', p: 0 }}
      >
        <PopupState variant="popover" popupId="group-popup-menu">
          {(popupState) => (
            <>
              <ListItem
                button
                divider
                secondaryAction={
                  <KeyboardArrowDownIcon
                    sx={{
                      color: 'text.secondary',
                      fontSize: 20,
                      marginTop: 0.5,
                    }}
                  />
                }
                {...bindTrigger(popupState)}
              >
                <ListItemText disableTypography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {groupInfo.group.name}
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
                  onClick={() => {
                    handleInviteDialogClickOpen();
                    popupState.close();
                  }}
                  sx={{ width: 290 }}
                  dense
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
      <GroupInviteDialog
        groupInfo={groupInfo}
        open={inviteDialogOpen}
        onClose={handleInviteDialogClose}
      />
    </Box>
  );
}

export default React.memo(GroupMenu);
