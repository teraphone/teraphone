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

  const updateAuthHeader = () => {
    const refreshAuth = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: {
          refreshToken: auth.refreshToken,
        },
      };
      try {
        const response = await axios.post('/v1/private/auth', config);
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
    };

    const isExpired =
      auth.accessTokenExpiration - Math.floor(Date.now() / 1000) < 0;
    const expiresSoon =
      auth.expiration - Math.floor(Date.now() / 1000) < 3600 && !isExpired;

    if (isExpired) {
      // eslint-disable-next-line no-console
      console.log('WARNING: AUTH TOKEN EXPIRED! REFRESHING...');
      refreshAuth();
    }
    if (expiresSoon) {
      // eslint-disable-next-line no-console
      console.log('WARNING: AUTH TOKEN EXPIRING SOON. REFRESHING...');
      refreshAuth();
    }

    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers) {
          config.headers = {};
        }
        console.log(`updateAuthHeader, time: ${Math.floor(Date.now() / 1000)}`);
        config.headers.Authorization = `Bearer ${auth.accessToken}`;

        return config;
      },
      // eslint-disable-next-line promise/no-promise-in-callback
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  };

  React.useEffect(updateAuthHeader, [auth, dispatch]);

  return axiosPrivate;
};

export default useAxiosPrivate;
