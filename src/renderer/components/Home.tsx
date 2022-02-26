import Button from '@mui/material/Button';
import * as React from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import * as requests from '../requests/requests';

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const auth = useAuth();

  const setAuthExpire = () => {
    const { token } = auth.state;
    auth.setState({ token, expiration: 0 });
  };

  const setAuthExpireSoon = () => {
    const { token } = auth.state;
    auth.setState({ token, expiration: Math.floor(Date.now() / 1000) + 1000 });
  };

  const pingPrivateWelcome = () => {
    axiosPrivate
      .get('/v1/private')
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(response);
        return true;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);

        return false;
      });
  };

  let groups = {} as requests.GetGroupsResponse;
  const groups2 = {} as requests.GetGroupsResponse;

  const getGroups = () => {
    requests
      .GetGroups(axiosPrivate)
      .then((response) => {
        groups = response.data;
        return true;
      })
      .catch(() => {
        groups.success = false;
        return false;
      });
  };

  React.useEffect(() => {
    console.log('useEffect -> getGroups');
    getGroups(); // this will run just once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logGroups = () => {
    console.log(groups);
  };

  return (
    <div>
      <h1>Home</h1>
      <p>Unix time: {Math.floor(Date.now() / 1000)}</p>
      <p>Expiration: {auth.state.expiration}</p>
      <p>Token: {auth.state.token}</p>
      {/* <p>{groups}</p> */}
      <Button variant="contained" onClick={setAuthExpire}>
        Set Auth Expire
      </Button>
      <Button variant="contained" onClick={setAuthExpireSoon}>
        Set Auth Expire Soon
      </Button>
      <Button variant="contained" onClick={pingPrivateWelcome}>
        Ping Private Welcome
      </Button>
      <Button variant="contained" onClick={getGroups}>
        Get Groups
      </Button>
      <Button variant="contained" onClick={logGroups}>
        Log Groups
      </Button>
    </div>
  );
};

export default Home;
