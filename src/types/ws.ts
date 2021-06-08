import {GObj} from "./common";

export interface WSVO<T = any> {
  code?: number; // 状态码
  data?: T; // 数据体
  source?: string; // 请求端
  type?: number; // 请求类型
  sourceId?: number; // 请求来源id
  targetId?: number; // 请求目标id
}
type RWFn = (ws: WebSocket, res: RWWSVO) => void;
export interface RWWSTypes {
  connect?: RWFn;
  msg?: RWFn;
  close?: RWFn;
  sys?: RWFn;
  error?: RWFn;
}
export type RWWSType = keyof RWWSTypes;

export interface RWWSVO<T = GObj> {
  code?: number; // 状态码
  data?: T; // 数据体
  type?: RWWSType; // 请求类型
  sourceId?: number; // 请求来源id
  targetId?: number; // 请求目标id
}

export interface UserInfo {
  id: number;
  name: string;
  token: string;
}
export interface RWClient {
  ws: WebSocket;
  userInfo: UserInfo;
  online: boolean;
}
