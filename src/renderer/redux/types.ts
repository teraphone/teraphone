export type BasePeachoneResponse = {
  success: boolean;
};

export type PeachoneResponse<T> = BasePeachoneResponse & T;

export type ConnectionTestToken = {
  roomToken: string;
};
