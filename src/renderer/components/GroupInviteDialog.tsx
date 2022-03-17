import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import * as models from '../models/models';

export interface GroupIniviteDialogProps {
  groupinfo: models.GroupInfo;
  open: boolean;
  onClose: () => void;
}

function GroupInviteDialog(props: GroupIniviteDialogProps) {
  const { groupinfo, open, onClose } = props;
  const [inviteCode, setInviteCode] = React.useState('');

  const handleClose = () => {
    onClose();
    setInviteCode('');
  };

  const getInviteCode = () => {
    console.log('getInviteCode');
    setInviteCode('1234567890123456');
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Invite to {groupinfo.group.name}</DialogTitle>
      <DialogContent>
        <Box textAlign="center">
          <Button onClick={getInviteCode}>Generate Code</Button>
        </Box>
        <TextField
          id="invite-code"
          label=""
          defaultValue=""
          value={inviteCode}
          InputProps={{ readOnly: true }}
        />
        <DialogContentText>Invite codes are single-use.</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default GroupInviteDialog;
