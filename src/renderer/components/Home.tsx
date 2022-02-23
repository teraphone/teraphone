import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const auth = useAuth();

  // eslint-disable-next-line no-console
  console.log(`zztoken`);
  // eslint-disable-next-line no-console
  console.log(auth.state.token);

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

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
