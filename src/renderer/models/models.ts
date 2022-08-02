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

export type Group = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
};

export type Room = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  group_id: number;
  capacity: number;
  room_type_id: number;
  deployment_zone_id: number;
  deprecation_code_id: number;
};

export type User = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
};

export type GroupUser = {
  created_at: string;
  updated_at: string;
  group_id: number;
  user_id: number;
  group_role_id: number;
};

export type GroupUserInfo = {
  user_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  group_role_id: number;
};

export type RoomUser = {
  created_at: string;
  updated_at: string;
  room_id: number;
  user_id: number;
  room_role_id: number;
  can_join: boolean;
  can_see: boolean;
};

export type RoomUserInfo = {
  user_id: number;
  room_role_id: number;
  can_join: boolean;
  can_see: boolean;
};

export type GroupInvite = {
  id: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
  code: string;
  group_id: number;
  invite_status_id: number;
  referrer_id: number;
};

export type Referral = {
  created_at: string;
  updated_at: string;
  user_id: number;
  referrer_id: number;
};

export const RoomTypeMap = {
  public: 1,
  private: 2,
  secret: 3,
};

export const DeploymentZoneMap = {
  'us-east-1': 1,
};

export const DeprecationCodeMap = {
  active: 1,
  inactive: 2,
};

export const RoomRoleMap = {
  banned: 1,
  guest: 2,
  member: 3,
  moderator: 4,
  admin: 5,
  owner: 6,
};

export const GroupRoleMap = {
  banned: 1,
  guest: 2,
  member: 3,
  moderator: 4,
  admin: 5,
  owner: 6,
};

export const InviteStatusMap = {
  pending: 1,
  accepted: 2,
  expired: 3,
};

export type RoomInfo = {
  room: Room;
  users: RoomUserInfo[];
  token: string;
};

export type RoomsInfo = RoomInfo[];

export type GroupInfo = {
  group: Group;
  users: GroupUserInfo[];
  rooms: RoomsInfo;
};

export type GroupsInfo = GroupInfo[];

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
