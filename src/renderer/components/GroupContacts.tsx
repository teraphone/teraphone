import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import * as models from '../models/models';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectAppUser } from '../redux/AppUserSlice';
import { selectOnline, unknownParticipant } from '../redux/ArtySlice';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export interface GroupContactsProps {
  groupInfo: models.GroupInfo;
}

function GroupContacts(props: GroupContactsProps) {
  const { groupInfo } = props;
  const { users, group } = groupInfo;
  const { appUser } = useAppSelector(selectAppUser);
  const online = useAppSelector(selectOnline);
  const onlineGroup = online[group.id];
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [usersObj, setUsersObj] = React.useState(
    {} as { [id: number]: models.GroupUserInfo }
  );
  const [onlineOpen, setOnlineOpen] = React.useState(true);
  const [offlineOpen, setOfflineOpen] = React.useState(false);

  const handleOnlineClick = React.useCallback(() => {
    setOnlineOpen(!onlineOpen);
  }, [onlineOpen]);

  const handleOfflineClick = React.useCallback(() => {
    setOfflineOpen(!offlineOpen);
  }, [offlineOpen]);

  React.useEffect(() => {
    setUsersObj(
      users.reduce((acc, user) => ({ ...acc, [user.user_id]: user }), {})
    );
  }, [users]);

  React.useEffect(() => {
    if (onlineGroup) {
      Object.entries(onlineGroup).forEach(([userId]) => {
        if (!usersObj[+userId]) {
          dispatch(
            unknownParticipant({
              client: axiosPrivate,
              groupId: group.id,
              userId: +userId,
            })
          );
        }
      });
    }
  }, [axiosPrivate, dispatch, group.id, onlineGroup, usersObj]);

  let thisUser = {} as models.GroupUserInfo;
  const onlineUsers = [] as models.GroupUserInfo[];
  const offlineUsers = [] as models.GroupUserInfo[];

  [...users]
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .forEach((user) => {
      if (user.user_id === appUser.id) {
        thisUser = user;
      } else if (onlineGroup && onlineGroup[user.user_id]) {
        onlineUsers.push(user);
      } else {
        offlineUsers.push(user);
      }
    });

  const thisContact = (
    <ListItemButton dense component="li" key={thisUser.user_id}>
      <ListItemIcon>
        <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>
          {thisUser.name[0]}
        </Avatar>
      </ListItemIcon>
      <ListItemText
        primary={thisUser.name}
        primaryTypographyProps={{
          variant: 'body2',
          noWrap: true,
        }}
      />
    </ListItemButton>
  );

  const onlineContacts = onlineUsers.map((user) => {
    const { user_id: userId, name } = user;
    return (
      <ListItemButton dense component="li" key={userId}>
        <ListItemIcon>
          <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>
            {name[0]}
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            variant: 'body2',
            noWrap: true,
          }}
        />
      </ListItemButton>
    );
  });

  const offlineContacts = offlineUsers.map((user) => {
    const { user_id: userId, name } = user;
    return (
      <ListItemButton dense component="li" key={userId}>
        <ListItemIcon>
          <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>
            {name[0]}
          </Avatar>
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            variant: 'body2',
            noWrap: true,
          }}
        />
      </ListItemButton>
    );
  });

  return (
    <Box
      sx={{
        width: '200px',
        borderLeft: 1,
        borderColor: 'divider',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 48,
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Group Contacts
        </Typography>
      </Box>
      <List disablePadding>
        <ListItemButton onClick={handleOnlineClick}>
          <ListItemText primary="Online" />
          {onlineOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={onlineOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {thisContact}
            {onlineContacts}
          </List>
        </Collapse>
      </List>
      <List disablePadding>
        <ListItemButton onClick={handleOfflineClick}>
          <ListItemText primary="Offline" />
          {offlineOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={offlineOpen} timeout="auto" unmountOnExit>
          <List disablePadding>{offlineContacts}</List>
        </Collapse>
      </List>
    </Box>
  );
}

export default GroupContacts;
