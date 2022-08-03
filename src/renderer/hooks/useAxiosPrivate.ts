/* eslint-disable no-console */
import * as React from 'react';
import axios, { axiosPrivate } from '../api/axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setAccessToken,
  setAccessTokenExpiration,
  setRefreshToken,
  setRefreshTokenExpiration,
  selectAuth,
} from '../redux/AuthSlice';

type UpdateAuthResponse = {
  success: boolean;
  accessToken: string;
  accessTokenExpiration: number;
  refreshToken: string;
  refreshTokenExpiration: number;
};

const useAxiosPrivate = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector(selectAuth);

  const refreshAuth = React.useCallback(async () => {
    const data = { refreshToken: auth.refreshToken };
    const config = {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    };
    try {
      const response = await axios.post('/v1/private/auth', data, config);
      const {
        accessToken,
        accessTokenExpiration,
        refreshToken,
        refreshTokenExpiration,
      } = response.data as UpdateAuthResponse;
      dispatch(setAccessToken(accessToken));
      dispatch(setAccessTokenExpiration(accessTokenExpiration));
      dispatch(setRefreshToken(refreshToken));
      dispatch(setRefreshTokenExpiration(refreshTokenExpiration));
    } catch (error) {
      console.log('error refreshing auth tokens', error);
    }
  }, [auth, dispatch]);

  React.useEffect(() => {
    const isExpired =
      auth.accessTokenExpiration - Math.floor(Date.now() / 1000) < 0;
    const expiresSoon =
      auth.accessTokenExpiration - Math.floor(Date.now() / 1000) < 600 &&
      !isExpired;

    if (isExpired) {
      // eslint-disable-next-line no-console
      console.log('WARNING: AUTH TOKEN EXPIRED! REFRESHING...');
      refreshAuth().catch(console.error);
    }
    if (expiresSoon) {
      // eslint-disable-next-line no-console
      console.log('WARNING: AUTH TOKEN EXPIRING SOON. REFRESHING...');
      refreshAuth().catch(console.error);
    }

    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers) {
          config.headers = {};
        }
        console.log('setting auth header');
        config.headers.Authorization = `Bearer ${auth.accessToken}`;

        return config;
      },
      // eslint-disable-next-line promise/no-promise-in-callback
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [auth, dispatch, refreshAuth]);

  return axiosPrivate;
};

export default useAxiosPrivate;
