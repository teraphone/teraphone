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
import { selectUserAvatars } from '../redux/AvatarSlice';

export interface TeamContactsProps {
  teamInfo: models.TeamInfo;
}

function GroupContacts(props: TeamContactsProps) {
  const { teamInfo } = props;
  const { users, team } = teamInfo;
  const { tenantUser } = useAppSelector(selectAppUser);
  const online = useAppSelector(selectOnline);
  const onlineTeam = online[team.id];
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [usersObj, setUsersObj] = React.useState<{
    [oid: string]: models.TenantUser;
  }>(users.reduce((acc, user) => ({ ...acc, [user.oid]: user }), {}));

  const [onlineOpen, setOnlineOpen] = React.useState(true);
  const [offlineOpen, setOfflineOpen] = React.useState(false);
  const userAvatars = useAppSelector(selectUserAvatars);

  const handleOnlineClick = React.useCallback(() => {
    setOnlineOpen(!onlineOpen);
  }, [onlineOpen]);

  const handleOfflineClick = React.useCallback(() => {
    setOfflineOpen(!offlineOpen);
  }, [offlineOpen]);

  React.useEffect(() => {
    setUsersObj(
      users.reduce((acc, user) => ({ ...acc, [user.oid]: user }), {})
    );
  }, [users]);

  React.useEffect(() => {
    if (onlineTeam) {
      Object.entries(onlineTeam).forEach(([userId]) => {
        if (!usersObj[userId]) {
          dispatch(
            unknownParticipant({
              client: axiosPrivate,
              teamId: team.id,
              userId,
            })
          );
        }
      });
    }
  }, [axiosPrivate, dispatch, onlineTeam, team.id, usersObj]);

  // let thisUser = {} as models.TenantUser;
  const onlineUsers = [] as models.TenantUser[];
  const offlineUsers = [] as models.TenantUser[];

  [...users]
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .forEach((user) => {
      if (user.oid === tenantUser.oid) {
        // thisUser = user;
      } else if (onlineTeam && onlineTeam[user.oid]) {
        onlineUsers.push(user);
      } else {
        offlineUsers.push(user);
      }
    });

  // const thisContact = (
  //   <ListItemButton dense component="li" key={thisUser.oid}>
  //     <ListItemIcon>
  //       <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>
  //         {thisUser.name[0]}
  //       </Avatar>
  //     </ListItemIcon>
  //     <ListItemText
  //       primary={thisUser.name}
  //       primaryTypographyProps={{
  //         variant: 'body2',
  //         noWrap: true,
  //       }}
  //     />
  //   </ListItemButton>
  // );

  const onlineContacts = onlineUsers.map((user) => {
    const { oid: userId, name } = user;
    return (
      <ListItemButton dense component="li" key={userId}>
        <ListItemIcon>
          <Avatar
            src={userAvatars[user.oid]}
            sx={{ width: 20, height: 20, fontSize: 14 }}
          >
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
    const { oid: userId, name } = user;
    return (
      <ListItemButton dense component="li" key={userId}>
        <ListItemIcon>
          <Avatar
            src={userAvatars[user.oid]}
            sx={{ width: 20, height: 20, fontSize: 14 }}
          >
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
        borderColor: 'divider',
        borderLeftStyle: 'solid',
        borderLeftWidth: 1,
        width: '200px',
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
          Team Contacts
        </Typography>
      </Box>
      <List disablePadding>
        <ListItemButton onClick={handleOnlineClick}>
          <ListItemText primary="Online" />
          {onlineOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={onlineOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {/* {thisContact} */}
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
