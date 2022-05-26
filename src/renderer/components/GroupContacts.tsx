import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
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
      <List disablePadding>{contacts}</List>
    </Box>
  );
}

export default GroupContacts;
