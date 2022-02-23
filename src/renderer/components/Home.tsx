import useAuth from '../hooks/useAuth';

const Home = () => {
  const auth = useAuth();
  // eslint-disable-next-line no-console
  console.log(`zztoken`);
  // eslint-disable-next-line no-console
  console.log(auth);
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
