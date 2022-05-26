import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as models from '../models/models';

export interface GroupContactsProps {
  groupInfo: models.GroupInfo;
}

function GroupContacts(props: GroupContactsProps) {
  const { groupInfo } = props;
  const { users } = groupInfo;

  const contacts = users.map((user) => {
    const { user_id: userId, name } = user;
    return (
      <ListItemButton dense component="li" sx={{ pl: 4, py: 0.5 }} key={userId}>
        <ListItemIcon>
          <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>
            {name[0]}
          </Avatar>
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    );
  });

  return <List disablePadding>{contacts}</List>;
}

export default GroupContacts;
