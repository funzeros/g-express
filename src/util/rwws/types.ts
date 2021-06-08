import {GObj} from "../../types/common";
import {RWWSType, RWWSVO} from "../../types/ws";

export class RWWSDTO<T = GObj> implements RWWSVO {
  constructor(options: RWWSVO<T>) {
    Object.assign(this, options);
  }
  code = 0; // 状态码
  data: T; // 数据体
  type: RWWSType; // 请求类型
  sourceId = 0; // 请求来源id
  targetId = 0; // 请求目标id
  toSDTO() {
    return JSON.stringify(this);
  }
}
