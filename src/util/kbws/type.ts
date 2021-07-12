import {GObj} from "../../types/common";

type KBFn = (ws: WebSocket, res: KBWSVO) => void;
export interface KBWSTypes {
  connect: KBFn;
  msg: KBFn;
  close: KBFn;
  sys: KBFn;
  error: KBFn;
  syncUsers: KBFn;
  chat: KBFn;
}
type KBWSType = keyof KBWSTypes;

export interface KBWSVO<T = GObj> {
  code: number; // 状态码
  data?: T; // 数据体
  type: KBWSType; // 请求类型
  sourceId: number; // 请求来源id
  targetId: number; // 请求目标id
}

export class KBWSDTO<T = GObj> implements KBWSVO {
  constructor(options: Partial<KBWSVO<T>>) {
    Object.assign(this, options);
  }
  code = 0; // 状态码
  data: T; // 数据体
  type: KBWSType; // 请求类型
  sourceId = 0; // 请求来源id
  targetId = 0; // 请求目标id
  toSDTO() {
    return JSON.stringify(this);
  }
}
