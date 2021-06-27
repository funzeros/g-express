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
  mate?: RWFn;
  gameStart?: RWFn;
  syncState?: RWFn;
  nextTurn?: RWFn;
  attack?: RWFn;
  gameEnd?: RWFn;
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
interface RiderInstance<T = string> {
  id: string;
  name: string;
  rider: string;
  url: string;
  cost: number;
  mHp: number;
  cHp: number;
  atk: number;
  def: number;
  dex: number;
  mFury: number; // 最大怒气
  cFury: number; // 当前怒气
  mAtks: number; // 最大可攻击次数
  sAtks: number; // 剩余攻击次数
  effects: T[];
}
export interface PlayVO extends UserInfo {
  maxHP: number;
  currentHP: number;
  maxAct: number;
  currentAct: number;
  handCards: string[];
  libCards: string[];
  riderCards: RiderInstance[];
}
export const userStatusDict = {
  online: "在线",
  offLine: "下线",
  matting: "匹配中",
  gaming: "游戏中",
};
export type UserStatus = keyof typeof userStatusDict;
export interface RWClient {
  ws?: WebSocket;
  userInfo: UserInfo;
  status: UserStatus;
  roomId?: number;
  cards?: string[];
}
