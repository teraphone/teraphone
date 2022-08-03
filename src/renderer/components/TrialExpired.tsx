/* eslint-disable no-console */
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import { useAppSelector } from '../redux/hooks';
import { selectUserLicense, selectTenantUser } from '../redux/AppUserSlice';

const TrialExpired = () => {
  const userLicense = useAppSelector(selectUserLicense);
  const tenantUser = useAppSelector(selectTenantUser);
  const infoFontSize = 12;
  console.log('userLicense', userLicense);
  console.log('tenantUser', tenantUser);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">Your free trial has expired.</Typography>
        <br />
        <Typography variant="body1">
          Please contact your System Administrator and ask them to assign a
          license to your account:
        </Typography>
        <br />
        <Box sx={{ width: '100%' }}>
          <Typography variant="body1" sx={{ fontSize: infoFontSize }}>
            Tenant ID (tid): {tenantUser.tid}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: infoFontSize }}>
            User ID (oid): {tenantUser.oid}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: infoFontSize }}>
            Name: {tenantUser.name}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: infoFontSize }}>
            Email: {tenantUser.email}
          </Typography>
        </Box>
        <br />
        <Box sx={{ width: '100%' }}>
          <Typography variant="body1">
            Or contact help@teraphone.app for support.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default TrialExpired;
