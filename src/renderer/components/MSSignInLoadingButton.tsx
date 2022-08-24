import { Icon, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { SxProps } from '@mui/system';
import microsoftLogo from '../../../assets/images/microsoft-logo.svg';

function MSSignInLoadingButton({
  children = 'Sign in with Microsoft',
  disableElevation = false,
  loading = false,
  onClick = () => {},
  sx = {},
}: {
  children?: React.ReactNode;
  disableElevation?: boolean;
  loading?: boolean;
  onClick?: () => void;
  sx?: SxProps;
}) {
  const theme = useTheme();

  return (
    <LoadingButton
      color="info"
      loading={loading}
      onClick={onClick}
      startIcon={
        <Icon>
          <img alt="Microsoft logo" src={microsoftLogo} />
        </Icon>
      }
      sx={{
        backgroundColor: '#fff',
        borderRadius: 0,
        boxShadow: !disableElevation ? theme.shadows[2] : theme.shadows[0],
        px: 1.5,
        '&:hover': {
          backgroundColor: theme.palette.grey[50],
          boxShadow: !disableElevation ? theme.shadows[4] : theme.shadows[0],
        },
        '&:active': {
          boxShadow: theme.shadows[0],
        },
        '& .MuiButton-startIcon': { my: 0, ml: 0, mr: 1.5 },
        ...sx,
      }}
      type="submit"
      variant="outlined"
    >
      {children}
    </LoadingButton>
  );
}

export default MSSignInLoadingButton;
