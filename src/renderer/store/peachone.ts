import { emptySplitApi as api } from './emptyApi';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getV1Public: build.query<GetV1PublicApiResponse, GetV1PublicApiArg>({
      query: () => ({ url: `/v1/public` }),
    }),
    getV1Private: build.query<GetV1PrivateApiResponse, GetV1PrivateApiArg>({
      query: () => ({ url: `/v1/private` }),
    }),
    postV1PublicSignup: build.mutation<
      PostV1PublicSignupApiResponse,
      PostV1PublicSignupApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/public/signup`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postV1PublicSignupWithInvite: build.mutation<
      PostV1PublicSignupWithInviteApiResponse,
      PostV1PublicSignupWithInviteApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/public/signup-with-invite`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    postV1PublicLogin: build.mutation<
      PostV1PublicLoginApiResponse,
      PostV1PublicLoginApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/public/login`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getV1PrivateAuth: build.query<
      GetV1PrivateAuthApiResponse,
      GetV1PrivateAuthApiArg
    >({
      query: () => ({ url: `/v1/private/auth` }),
    }),
    postV1PrivateGroups: build.mutation<
      PostV1PrivateGroupsApiResponse,
      PostV1PrivateGroupsApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/private/groups`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getV1PrivateGroups: build.query<
      GetV1PrivateGroupsApiResponse,
      GetV1PrivateGroupsApiArg
    >({
      query: () => ({ url: `/v1/private/groups` }),
    }),
    getV1PrivateGroups1: build.query<
      GetV1PrivateGroups1ApiResponse,
      GetV1PrivateGroups1ApiArg
    >({
      query: () => ({ url: `/v1/private/groups/1` }),
    }),
    patchV1PrivateGroups2: build.mutation<
      PatchV1PrivateGroups2ApiResponse,
      PatchV1PrivateGroups2ApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/private/groups/2`,
        method: 'PATCH',
        body: queryArg.body,
      }),
    }),
    deleteV1PrivateGroups5: build.mutation<
      DeleteV1PrivateGroups5ApiResponse,
      DeleteV1PrivateGroups5ApiArg
    >({
      query: () => ({ url: `/v1/private/groups/5`, method: 'DELETE' }),
    }),
    postV1PrivateGroups3Users: build.mutation<
      PostV1PrivateGroups3UsersApiResponse,
      PostV1PrivateGroups3UsersApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/private/groups/3/users`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getV1PrivateGroups1Users: build.query<
      GetV1PrivateGroups1UsersApiResponse,
      GetV1PrivateGroups1UsersApiArg
    >({
      query: () => ({ url: `/v1/private/groups/1/users` }),
    }),
    getV1PrivateGroups6Users11: build.query<
      GetV1PrivateGroups6Users11ApiResponse,
      GetV1PrivateGroups6Users11ApiArg
    >({
      query: () => ({ url: `/v1/private/groups/6/users/11` }),
    }),
    patchV1PrivateGroups1Users12: build.mutation<
      PatchV1PrivateGroups1Users12ApiResponse,
      PatchV1PrivateGroups1Users12ApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/private/groups/1/users/12`,
        method: 'PATCH',
        body: queryArg.body,
      }),
    }),
    deleteV1PrivateGroups1Users10: build.mutation<
      DeleteV1PrivateGroups1Users10ApiResponse,
      DeleteV1PrivateGroups1Users10ApiArg
    >({
      query: () => ({ url: `/v1/private/groups/1/users/10`, method: 'DELETE' }),
    }),
    postV1PrivateGroups1Invites: build.mutation<
      PostV1PrivateGroups1InvitesApiResponse,
      PostV1PrivateGroups1InvitesApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/private/groups/1/invites`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getV1PrivateGroups6Invites: build.query<
      GetV1PrivateGroups6InvitesApiResponse,
      GetV1PrivateGroups6InvitesApiArg
    >({
      query: () => ({ url: `/v1/private/groups/6/invites` }),
    }),
    getV1PrivateGroups6Invites4: build.query<
      GetV1PrivateGroups6Invites4ApiResponse,
      GetV1PrivateGroups6Invites4ApiArg
    >({
      query: () => ({ url: `/v1/private/groups/6/invites/4` }),
    }),
    deleteV1PrivateGroups6Invites2: build.mutation<
      DeleteV1PrivateGroups6Invites2ApiResponse,
      DeleteV1PrivateGroups6Invites2ApiArg
    >({
      query: () => ({
        url: `/v1/private/groups/6/invites/2`,
        method: 'DELETE',
      }),
    }),
    postV1PrivateGroups1Rooms: build.mutation<
      PostV1PrivateGroups1RoomsApiResponse,
      PostV1PrivateGroups1RoomsApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/private/groups/1/rooms`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getV1PrivateGroups1Rooms: build.query<
      GetV1PrivateGroups1RoomsApiResponse,
      GetV1PrivateGroups1RoomsApiArg
    >({
      query: () => ({ url: `/v1/private/groups/1/rooms` }),
    }),
    getV1PrivateGroups1Rooms1: build.query<
      GetV1PrivateGroups1Rooms1ApiResponse,
      GetV1PrivateGroups1Rooms1ApiArg
    >({
      query: () => ({ url: `/v1/private/groups/1/rooms/1` }),
    }),
    patchV1PrivateGroups1Rooms1: build.mutation<
      PatchV1PrivateGroups1Rooms1ApiResponse,
      PatchV1PrivateGroups1Rooms1ApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/private/groups/1/rooms/1`,
        method: 'PATCH',
        body: queryArg.body,
      }),
    }),
    deleteV1PrivateGroups1Rooms3: build.mutation<
      DeleteV1PrivateGroups1Rooms3ApiResponse,
      DeleteV1PrivateGroups1Rooms3ApiArg
    >({
      query: () => ({ url: `/v1/private/groups/1/rooms/3`, method: 'DELETE' }),
    }),
    getV1PrivateGroups1Rooms1Users: build.query<
      GetV1PrivateGroups1Rooms1UsersApiResponse,
      GetV1PrivateGroups1Rooms1UsersApiArg
    >({
      query: () => ({ url: `/v1/private/groups/1/rooms/1/users` }),
    }),
    patchV1PrivateGroups1Rooms1Users2: build.mutation<
      PatchV1PrivateGroups1Rooms1Users2ApiResponse,
      PatchV1PrivateGroups1Rooms1Users2ApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/private/groups/1/rooms/1/users/2`,
        method: 'PATCH',
        body: queryArg.body,
      }),
    }),
    postV1PrivateInvites: build.mutation<
      PostV1PrivateInvitesApiResponse,
      PostV1PrivateInvitesApiArg
    >({
      query: (queryArg) => ({
        url: `/v1/private/invites`,
        method: 'POST',
        body: queryArg.body,
      }),
    }),
    getV1RoomserviceRooms: build.query<
      GetV1RoomserviceRoomsApiResponse,
      GetV1RoomserviceRoomsApiArg
    >({
      query: () => ({ url: `/v1/roomservice/rooms` }),
    }),
    getV1RoomserviceRooms14Join: build.query<
      GetV1RoomserviceRooms14JoinApiResponse,
      GetV1RoomserviceRooms14JoinApiArg
    >({
      query: () => ({ url: `/v1/roomservice/rooms/1/4/join` }),
    }),
    getV1RoomserviceRooms11: build.query<
      GetV1RoomserviceRooms11ApiResponse,
      GetV1RoomserviceRooms11ApiArg
    >({
      query: () => ({ url: `/v1/roomservice/rooms/1/1` }),
    }),
    getV1PrivateWorld: build.query<
      GetV1PrivateWorldApiResponse,
      GetV1PrivateWorldApiArg
    >({
      query: () => ({ url: `/v1/private/world` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as peachone };
export type GetV1PublicApiResponse = /** status 200 Successful response */ Blob;
export type GetV1PublicApiArg = void;
export type GetV1PrivateApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateApiArg = void;
export type PostV1PublicSignupApiResponse =
  /** status 200 Successful response */ Blob;
export type PostV1PublicSignupApiArg = {
  body: object;
};
export type PostV1PublicSignupWithInviteApiResponse =
  /** status 200 Successful response */ Blob;
export type PostV1PublicSignupWithInviteApiArg = {
  body: object;
};
export type PostV1PublicLoginApiResponse =
  /** status 200 Successful response */ Blob;
export type PostV1PublicLoginApiArg = {
  body: object;
};
export type GetV1PrivateAuthApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateAuthApiArg = void;
export type PostV1PrivateGroupsApiResponse =
  /** status 200 Successful response */ Blob;
export type PostV1PrivateGroupsApiArg = {
  body: object;
};
export type GetV1PrivateGroupsApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateGroupsApiArg = void;
export type GetV1PrivateGroups1ApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateGroups1ApiArg = void;
export type PatchV1PrivateGroups2ApiResponse =
  /** status 200 Successful response */ Blob;
export type PatchV1PrivateGroups2ApiArg = {
  body: object;
};
export type DeleteV1PrivateGroups5ApiResponse =
  /** status 200 Successful response */ Blob;
export type DeleteV1PrivateGroups5ApiArg = void;
export type PostV1PrivateGroups3UsersApiResponse =
  /** status 200 Successful response */ Blob;
export type PostV1PrivateGroups3UsersApiArg = {
  body: object;
};
export type GetV1PrivateGroups1UsersApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateGroups1UsersApiArg = void;
export type GetV1PrivateGroups6Users11ApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateGroups6Users11ApiArg = void;
export type PatchV1PrivateGroups1Users12ApiResponse =
  /** status 200 Successful response */ Blob;
export type PatchV1PrivateGroups1Users12ApiArg = {
  body: object;
};
export type DeleteV1PrivateGroups1Users10ApiResponse =
  /** status 200 Successful response */ Blob;
export type DeleteV1PrivateGroups1Users10ApiArg = void;
export type PostV1PrivateGroups1InvitesApiResponse =
  /** status 200 Successful response */ Blob;
export type PostV1PrivateGroups1InvitesApiArg = {
  body: string;
};
export type GetV1PrivateGroups6InvitesApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateGroups6InvitesApiArg = void;
export type GetV1PrivateGroups6Invites4ApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateGroups6Invites4ApiArg = void;
export type DeleteV1PrivateGroups6Invites2ApiResponse =
  /** status 200 Successful response */ Blob;
export type DeleteV1PrivateGroups6Invites2ApiArg = void;
export type PostV1PrivateGroups1RoomsApiResponse =
  /** status 200 Successful response */ Blob;
export type PostV1PrivateGroups1RoomsApiArg = {
  body: object;
};
export type GetV1PrivateGroups1RoomsApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateGroups1RoomsApiArg = void;
export type GetV1PrivateGroups1Rooms1ApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateGroups1Rooms1ApiArg = void;
export type PatchV1PrivateGroups1Rooms1ApiResponse =
  /** status 200 Successful response */ Blob;
export type PatchV1PrivateGroups1Rooms1ApiArg = {
  body: object;
};
export type DeleteV1PrivateGroups1Rooms3ApiResponse =
  /** status 200 Successful response */ Blob;
export type DeleteV1PrivateGroups1Rooms3ApiArg = void;
export type GetV1PrivateGroups1Rooms1UsersApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateGroups1Rooms1UsersApiArg = void;
export type PatchV1PrivateGroups1Rooms1Users2ApiResponse =
  /** status 200 Successful response */ Blob;
export type PatchV1PrivateGroups1Rooms1Users2ApiArg = {
  body: object;
};
export type PostV1PrivateInvitesApiResponse =
  /** status 200 Successful response */ Blob;
export type PostV1PrivateInvitesApiArg = {
  body: object;
};
export type GetV1RoomserviceRoomsApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1RoomserviceRoomsApiArg = void;
export type GetV1RoomserviceRooms14JoinApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1RoomserviceRooms14JoinApiArg = void;
export type GetV1RoomserviceRooms11ApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1RoomserviceRooms11ApiArg = void;
export type GetV1PrivateWorldApiResponse =
  /** status 200 Successful response */ Blob;
export type GetV1PrivateWorldApiArg = void;
export const {
  useGetV1PublicQuery,
  useGetV1PrivateQuery,
  usePostV1PublicSignupMutation,
  usePostV1PublicSignupWithInviteMutation,
  usePostV1PublicLoginMutation,
  useGetV1PrivateAuthQuery,
  usePostV1PrivateGroupsMutation,
  useGetV1PrivateGroupsQuery,
  useGetV1PrivateGroups1Query,
  usePatchV1PrivateGroups2Mutation,
  useDeleteV1PrivateGroups5Mutation,
  usePostV1PrivateGroups3UsersMutation,
  useGetV1PrivateGroups1UsersQuery,
  useGetV1PrivateGroups6Users11Query,
  usePatchV1PrivateGroups1Users12Mutation,
  useDeleteV1PrivateGroups1Users10Mutation,
  usePostV1PrivateGroups1InvitesMutation,
  useGetV1PrivateGroups6InvitesQuery,
  useGetV1PrivateGroups6Invites4Query,
  useDeleteV1PrivateGroups6Invites2Mutation,
  usePostV1PrivateGroups1RoomsMutation,
  useGetV1PrivateGroups1RoomsQuery,
  useGetV1PrivateGroups1Rooms1Query,
  usePatchV1PrivateGroups1Rooms1Mutation,
  useDeleteV1PrivateGroups1Rooms3Mutation,
  useGetV1PrivateGroups1Rooms1UsersQuery,
  usePatchV1PrivateGroups1Rooms1Users2Mutation,
  usePostV1PrivateInvitesMutation,
  useGetV1RoomserviceRoomsQuery,
  useGetV1RoomserviceRooms14JoinQuery,
  useGetV1RoomserviceRooms11Query,
  useGetV1PrivateWorldQuery,
} = injectedRtkApi;
