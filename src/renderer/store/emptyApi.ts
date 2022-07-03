/* eslint-disable import/prefer-default-export */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// This is the (empty) API service that endpoints are injected into
// See https://redux-toolkit.js.org/rtk-query/usage/code-generation
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: () => ({}),
});
