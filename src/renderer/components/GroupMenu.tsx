import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import * as models from '../models/models';

function GroupMenu(props: { groupinfo: models.GroupInfo }) {
  const { groupinfo } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        <ListItem
          button
          onClick={handleClick}
          divider
          secondaryAction={
            <KeyboardArrowDownIcon
              sx={{ color: 'text.secondary', fontSize: 20, marginTop: 0.5 }}
            />
          }
        >
          <ListItemText disableTypography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              {groupinfo.group.name}
            </Typography>
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
}

export default GroupMenu;
