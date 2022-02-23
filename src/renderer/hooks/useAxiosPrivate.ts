import * as React from 'react';
import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
  const { token } = useAuth();

  React.useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;

        return config;
      },
      // eslint-disable-next-line promise/no-promise-in-callback
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [token]);

  return axiosPrivate;
};

export default useAxiosPrivate;
