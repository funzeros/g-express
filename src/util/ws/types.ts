import {WsType} from "../../const/ws";
import {WSVO} from "../../types/ws";

export class WSDTO<T = any> implements WSVO {
  constructor(options: WSVO<T>) {
    Object.keys(options).forEach(k => {
      this[k] = options[k];
    });
  }
  code = 0; // 状态码
  data: T; // 数据体
  source = "g-taro"; // 请求端
  type: WsType.default; // 请求类型
  sourceId = 0; // 请求来源id
  targetId = 0; // 请求目标id
  toSDTO() {
    return JSON.stringify(this);
  }
}
