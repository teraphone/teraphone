import { AxiosInstance } from 'axios';
import * as models from '../models/models';

// Welcome endpoint:
// PrivateWelcome               GET     /v1/private/

// Auth endpoint:
// RefreshToken                 GET     /v1/private/auth

// Group endpoints:
// CreateGroup                  POST    /v1/private/groups
// GetGroups                    GET     /v1/private/groups
// GetGroup                     GET     /v1/private/groups/:group_id
// UpdateGroup                  PUT     /v1/private/groups/:group_id
// DeleteGroup                  DELETE  /v1/private/groups/:group_id
// CreateGroupUser              POST    /v1/private/groups/:group_id/users
// GetGroupUsers                GET     /v1/private/groups/:group_id/users
// GetGroupUser                 GET     /v1/private/groups/:group_id/users/:user_id
// UpdateGroupUser              PATCH   /v1/private/groups/:group_id/users/:user_id
// DeleteGroupUser              DELETE  /v1/private/groups/:group_id/users/:user_id
// CreateGroupInvite            POST    /v1/private/groups/:group_id/invites
// GetGroupInvites              GET     /v1/private/groups/:group_id/invites
// GetGroupInvite               GET     /v1/private/groups/:group_id/invites/:invite_id
// DeleteGroupInvite            DELETE  /v1/private/groups/:group_id/invites/:invite_id
// CreateRoom                   POST    /v1/private/groups/:group_id/rooms
// GetRooms                     GET     /v1/private/groups/:group_id/rooms
// GetRoom                      GET     /v1/private/groups/:group_id/rooms/:room_id
// UpdateRoom                   PATCH   /v1/private/groups/:group_id/rooms/:room_id
// DeleteRoom                   DELETE  /v1/private/groups/:group_id/rooms/:room_id
// GetRoomUsers                 GET     /v1/private/groups/:group_id/rooms/:room_id/users
// GetRoomUser                  GET     /v1/private/groups/:group_id/rooms/:room_id/users/:user_id
// UpdateRoomUser               PATCH   /v1/private/groups/:group_id/rooms/:room_id/users/:user_id

// Invites endpoints:
// AcceptGroupInvite            POST    /v1/private/invites

// Rooms endpoints:
// GetLiveKitRooms              GET     /v1/roomservice/rooms
// JoinLiveKitRoom              GET     /v1/roomservice/rooms/:group_id/:room_id/join
// GetLiveKitRoomParticipants   GET     /v1/roomservice/rooms/:group_id/:room_id

export type CreateGroupResponse = {
  success: boolean;
  group: models.Group;
};

export function CreateGroup(client: AxiosInstance, name: string) {
  const config = {
    data: { name },
  };
  return client.post('/groups', config);
}

export type GetGroupsResponse = {
  success: boolean;
  groups: models.Group[];
};

export function GetGroups(client: AxiosInstance) {
  return client.get('/v1/private/groups');
}

export type GetGroupUsersResponse = {
  success: boolean;
  group_users: models.GroupUserInfo[];
};

export function GetGroupUsers(client: AxiosInstance, group_id: number) {
  const url = `/v1/private/groups/${group_id}/users`;
  return client.get(url);
}

export type GetRoomsResponse = {
  success: boolean;
  rooms: models.Room[];
};

export function GetRooms(client: AxiosInstance, group_id: number) {
  const url = `/v1/private/groups/${group_id}/rooms`;
  return client.get(url);
}

export type GetRoomUsersResponse = {
  success: boolean;
  room_users: models.RoomUserInfo[];
};

export function GetRoomUsers(
  client: AxiosInstance,
  group_id: number,
  room_id: number
) {
  const url = `/v1/private/groups/${group_id}/rooms/${room_id}/users`;
  return client.get(url);
}

export type CreateGroupInviteResponse = {
  success: boolean;
  group_invite: models.GroupInvite;
};

export function CreateGroupInvite(client: AxiosInstance, group_id: number) {
  const url = `/v1/private/groups/${group_id}/invites`;
  return client.post(url);
}

export type JoinLiveKitRoomResponse = {
  success: boolean;
  token: string;
};

export function JoinLiveKitRoom(
  client: AxiosInstance,
  group_id: number,
  room_id: number
) {
  const url = `/v1/roomservice/rooms/${group_id}/${room_id}/join`;
  return client.get(url);
}

export function GetWorld(client: AxiosInstance) {
  const url = '/v1/private/world';
  return client.get(url);
}
