/* eslint-disable no-console */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import * as models from '../models/models';
import {
  CreateGroupInvite,
  CreateGroupInviteResponse,
} from '../requests/requests';

export interface GroupIniviteDialogProps {
  groupInfo: models.GroupInfo;
  open: boolean;
  onClose: () => void;
}

function GroupInviteDialog(props: GroupIniviteDialogProps) {
  const { groupInfo, open, onClose } = props;
  const [inviteCode, setInviteCode] = React.useState('');
  const axiosPrivate = useAxiosPrivate();

  const handleClose = () => {
    onClose();
  };

  const getInviteCode = async () => {
    console.log('getInviteCode');
    const req = await CreateGroupInvite(axiosPrivate, groupInfo.group.id);
    const { group_invite: groupInvite } = req.data as CreateGroupInviteResponse;
    setInviteCode(groupInvite.code);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Invite to {groupInfo.group.name}</DialogTitle>
      <DialogContent>
        <Box textAlign="center" sx={{ pb: 2 }}>
          <Button onClick={getInviteCode}>Generate New Code</Button>
        </Box>
        <TextField
          id="invite-code"
          label=""
          value={inviteCode}
          InputProps={{
            readOnly: true,
            disableUnderline: true,
            inputProps: { style: { textAlign: 'center', padding: 12 } },
          }}
          helperText="Invite codes are single-use."
          fullWidth
          size="small"
          variant="filled"
        />
      </DialogContent>
    </Dialog>
  );
}

export default GroupInviteDialog;
