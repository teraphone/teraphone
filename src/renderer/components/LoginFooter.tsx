import { Box } from '@mui/material';

function LoginFooter() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexShrink: 0,
        justifyContent: 'center',
        m: 2,
      }}
    >
      <a
        href="https://teraphone.app/privacy-policy"
        target="_blank"
        rel="noreferrer"
      >
        Privacy Policy
      </a>
    </Box>
  );
}

export default LoginFooter;
