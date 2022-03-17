import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import * as models from '../models/models';

export interface GroupIniviteDialogProps {
  groupinfo: models.GroupInfo;
  open: boolean;
  onClose: () => void;
}

function GroupInviteDialog(props: GroupIniviteDialogProps) {
  const { groupinfo, open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Invite to {groupinfo.group.name}
      </Typography>
    </Dialog>
  );
}

export default GroupInviteDialog;
