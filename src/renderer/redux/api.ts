import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PeachoneResponse, ConnectionTestToken } from './types';

export const peachoneApi = createApi({
  reducerPath: 'peachoneApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.teraphone.app/v1' }),
  endpoints: (builder) => ({
    getConnectionTestToken: builder.query<
      PeachoneResponse<ConnectionTestToken>,
      void
    >({
      query: () => '/public/connection-test-token',
    }),
  }),
});

export const { useGetConnectionTestTokenQuery } = peachoneApi;
