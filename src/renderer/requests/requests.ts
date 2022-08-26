import { AxiosInstance } from 'axios';
import * as models from '../models/models';

// World endpoint:
// GetWorld                     GET     /v1/world

// Trial endpoint:
// UpdateTrial                  PATCH    /v1/trial

// Rooms endpoints:
// JoinLiveKitRoom              GET     /v1/roomservice/rooms/:group_id/:room_id/join

export type GetWorldResponse = {
  teams: models.TeamInfo[];
};

export function GetWorld(client: AxiosInstance) {
  const url = '/v1/private/world';
  return client.get(url);
}

export type UpdateTrialResponse = {
  success: boolean;
  user: models.TenantUser;
};

export function UpdateTrial(client: AxiosInstance) {
  const url = '/v1/private/trial';
  return client.patch(url);
}

export type JoinLiveKitRoomResponse = {
  success: boolean;
  token: string;
};

export function JoinLiveKitRoom(
  client: AxiosInstance,
  teamId: string,
  roomId: string
) {
  const url = `/v1/roomservice/rooms/${teamId}/${roomId}/join`;
  return client.get(url);
}
