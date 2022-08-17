import { Icon } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material/styles';
import microsoftLogo from '../../../assets/images/microsoft-logo.svg';

function MSSignInLoadingButton({
  children = 'Sign in with Microsoft',
  disableElevation = false,
  loading = false,
  onClick = () => {},
}: {
  children?: React.ReactNode;
  disableElevation?: boolean;
  loading?: boolean;
  onClick?: () => void;
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
        boxShadow: !disableElevation ? theme.shadows[2] : 'none',
        px: 1.5,
        '&:hover': {
          backgroundColor: theme.palette.grey[50],
          boxShadow: !disableElevation ? theme.shadows[4] : 'none',
        },
        '& .MuiButton-startIcon': { my: 0, ml: 0, mr: 1.5 },
      }}
      type="submit"
      variant="outlined"
    >
      {children}
    </LoadingButton>
  );
}

export default MSSignInLoadingButton;
