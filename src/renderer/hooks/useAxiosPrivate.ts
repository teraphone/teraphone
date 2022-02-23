import * as React from 'react';
import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
  const auth = useAuth();

  const updateAuthHeader = () => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers) {
          config.headers = {};
        }
        // eslint-disable-next-line no-console
        console.log(`Bearer ${auth.state.token}`);
        config.headers.Authorization = `Bearer ${auth.state.token}`;

        return config;
      },
      // eslint-disable-next-line promise/no-promise-in-callback
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  };

  updateAuthHeader(); // initialize header
  React.useEffect(updateAuthHeader, [auth.state]);

  return axiosPrivate;
};

export default useAxiosPrivate;
