import Button from '@mui/material/Button';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

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

  return (
    <div>
      <h1>Home</h1>
      <p>Unix time: {Math.floor(Date.now() / 1000)}</p>
      <p>Expiration: {auth.state.expiration}</p>
      <p>Token: {auth.state.token}</p>
      <Button variant="contained" onClick={setAuthExpire}>
        Set Auth Expire
      </Button>
      <Button variant="contained" onClick={setAuthExpireSoon}>
        Set Auth Expire Soon
      </Button>
      <Button variant="contained" onClick={pingPrivateWelcome}>
        Ping Private Welcome
      </Button>
    </div>
  );
};

export default Home;
