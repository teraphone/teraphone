/* eslint-disable no-console */
import { Link } from 'react-router-dom';
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
      <Link
        to="https://teraphone.app/privacy-policy"
        // target="_blank"
        // onClick={() =>
        //   window.open('https://teraphone.app/privacy-policy', '_blank')
        // }
      >
        Privacy Policy
      </Link>
    </Box>
  );
}

export default LoginFooter;
