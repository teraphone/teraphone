import { AxiosInstance } from 'axios';
import * as models from '../models/models';

// World endpoint:
// GetWorld                     GET     /v1/world

// License endpoint:
// UpdateLicense                PATCH    /v1/license

// Rooms endpoints:
// JoinLiveKitRoom              GET     /v1/roomservice/rooms/:group_id/:room_id/join

export type GetWorldResponse = {
  teams: models.TeamInfo[];
  user: models.TenantUser;
  license: models.UserLicense;
};

export function GetWorld(client: AxiosInstance) {
  const url = '/v1/private/world';
  return client.get(url);
}

export type UpdateLicenseResponse = {
  success: boolean;
  license: models.UserLicense;
};

export function UpdateLicense(client: AxiosInstance) {
  const url = '/v1/private/license';
  return client.patch(url);
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
