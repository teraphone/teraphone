export type TenantUser = {
  oid: string;
  name: string;
  email: string;
  tid: string;
  createdAt: string;
  updatedAt: string;
};

export type UserLicense = {
  oid: string;
  tid: string;
  licenseExpiresAt: string;
  licenseStatus: number;
  licensePlan: number;
  licenseAutoRenew: boolean;
  licenseRequested: boolean;
  licenseRequestedAt: string;
  trialActivated: boolean;
  trialExpiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type TenantTeam = {
  id: string;
  tid: string;
  displayName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamRoom = {
  id: string;
  teamId: string;
  displayName: string;
  description: string;
  capacity: number;
  deploymentZone: number;
  roomType: number;
  createdAt: string;
  updatedAt: string;
};

export type RoomInfoType = {
  room: TeamRoom;
  roomToken: string;
};

export type TeamInfo = {
  team: TenantTeam;
  rooms: RoomInfoType[];
  users: TenantUser[];
};

export const LicenseStatus = {
  inactive: 0,
  suspended: 1,
  pending: 2,
  active: 3,
};

export const LicensePlan = {
  none: 0,
  standard: 1,
  professional: 2,
};

export const DeploymentZone = {
  'us-west-1b': 0,
};

export const RoomType = {
  public: 0,
  private: 1,
  secret: 2,
};

export type ParticipantRTInfo = {
  isMuted: boolean;
  isDeafened: boolean;
  isCameraShare: boolean;
  isScreenShare: boolean;
};

export type RoomRTInfo = Map<string, ParticipantRTInfo>;

export type ParticipantRTUsers = {
  [userId: string]: ParticipantRTInfo;
};

export type ParticipantRTRooms = {
  [roomId: string]: ParticipantRTUsers;
};

export type ParticipantRTGroups = {
  [teamId: string]: ParticipantRTRooms;
};

export type OnlineRTUsers = {
  [userId: string]: boolean;
};

export type OnlineRTGroups = {
  [teamId: string]: OnlineRTUsers;
};
